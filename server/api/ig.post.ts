import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";

export default defineEventHandler(async (event) => {
  const body = await readBody<{ url: string }>(event);

  // Validate and normalize URL
  const url = normalizeUrl(body.url);
  validateUrl(url);

  // Scrape the post
  const caption = await scrapePost(url);

  return {
    success: true,
    data: { caption },
  };
});

function normalizeUrl(url: string): string {
  const trimmed = url.trim();
  if (!trimmed.startsWith("http://") && !trimmed.startsWith("https://")) {
    return "https://" + trimmed;
  }
  return trimmed;
}

function validateUrl(url: string): void {
  const isInstagram = url.includes("instagram.com");
  const isYoutube = url.includes("youtube.com") || url.includes("youtu.be");

  if (!isInstagram && !isYoutube) {
    throw createError({
      statusCode: 400,
      message: "URL must be an Instagram or YouTube link",
    });
  }
}

async function scrapePost(url: string): Promise<string> {
  let browser;

  try {
    const isDev = process.dev || process.env.NODE_ENV === "development";

    browser = await puppeteer.launch({
      args: isDev
        ? ["--no-sandbox", "--disable-setuid-sandbox"]
        : chromium.args,
      executablePath: isDev
        ? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
        : await chromium.executablePath(),
      headless: true,
    });

    const page = await browser.newPage();

    await page.setUserAgent(
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    );

    await page.goto(url, {
      waitUntil: "networkidle2",
      timeout: 30000,
    });

    const caption = await page
      .$eval('meta[name="description"]', (el) => el.getAttribute("content"))
      .catch(() => null);

    if (!caption) {
      throw new Error("Caption not found in page metadata");
    }

    return caption;
  } catch (error) {
    console.error("Scraping error:", error);
    throw createError({
      statusCode: 500,
      message: error instanceof Error ? error.message : "Failed to scrape post",
    });
  } finally {
    await browser?.close();
  }
}
