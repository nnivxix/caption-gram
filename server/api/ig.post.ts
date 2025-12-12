import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";

export default defineEventHandler(async (event) => {
  // link : https://www.instagram.com/p/DOH-c0WExT8/?utm_source=ig_web_copy_link
  const body = await readBody<{
    url: string;
  }>(event);

  // Validate and fix URL
  let url = body.url.trim();
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    url = "https://" + url;
  }

  if (!url.includes("instagram.com")) {
    throw createError({
      statusCode: 400,
      message: "URL must be an Instagram post link",
    });
  }

  let browser;
  try {
    // Launch browser with chromium for serverless
    const isDev = import.meta.dev;

    browser = await puppeteer.launch({
      args: isDev
        ? ["--no-sandbox", "--disable-setuid-sandbox"]
        : chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: isDev
        ? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
        : await chromium.executablePath(),
      headless: true,
    });

    const page = await browser.newPage();

    // Set user agent to avoid being blocked
    await page.setUserAgent(
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    );

    // Navigate to Instagram post
    await page.goto(url, {
      waitUntil: "networkidle2",
      timeout: 30000,
    });

    // Extract caption from meta description
    const caption = await page
      .$eval('meta[name="description"]', (el) => el.getAttribute("content"))
      .catch(() => null);

    if (!caption) {
      throw new Error("Caption not found in meta tag");
    }

    return {
      data: caption,
    };
  } catch (error) {
    console.error("Error scraping Instagram:", error);
    throw createError({
      statusCode: 500,
      message:
        error instanceof Error
          ? error.message
          : "Failed to scrape Instagram post",
    });
  } finally {
    // Always close browser
    if (browser) {
      await browser.close();
    }
  }
});
