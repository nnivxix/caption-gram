import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";

export default defineEventHandler(async (event) => {
  const body = await readBody<{ url: string; chatId?: string }>(event);

  let telegramSent = true;
  // Validate and normalize URL
  const url = normalizeUrl(body.url);
  validateUrl(url);

  // Scrape the post
  const caption = await scrapePost(url);

  // Send to Telegram if chatId is provided
  if (body.chatId) {
    try {
      await $fetch("/api/telegram/notify", {
        method: "POST",
        body: {
          chatId: body.chatId,
          caption,
          url,
        },
      });
    } catch (error) {
      console.error("Failed to send Telegram notification:", error);
      // Don't throw error - we still want to return the caption
      // Telegram notification is optional
      telegramSent = false;
    }
  }

  return {
    success: true,
    data: { caption, telegramSent },
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
  let parsedUrl: URL;

  try {
    parsedUrl = new URL(url);
  } catch {
    throw createError({
      statusCode: 400,
      message: "URL must be a valid absolute URL",
    });
  }

  if (parsedUrl.protocol !== "https:" && parsedUrl.protocol !== "http:") {
    throw createError({
      statusCode: 400,
      message: "URL must use http or https",
    });
  }

  const hostname = parsedUrl.hostname.toLowerCase();

  const isInstagram = isAllowedHostname(hostname, ["instagram.com"]);
  const isYoutube = isAllowedHostname(hostname, ["youtube.com", "youtu.be"]);
  const isFacebook = isAllowedHostname(hostname, [
    "facebook.com",
    "fb.watch",
    "fb.com",
  ]);

  if (!isInstagram && !isYoutube && !isFacebook) {
    throw createError({
      statusCode: 400,
      message: "URL must be an Instagram, YouTube, or Facebook link",
    });
  }
}

function isAllowedHostname(hostname: string, allowedHosts: string[]): boolean {
  return allowedHosts.some(
    (allowedHost) =>
      hostname === allowedHost || hostname.endsWith(`.${allowedHost}`),
  );
}

async function scrapePost(url: string): Promise<string> {
  let browser;

  try {
    const isDev = import.meta.dev || process.env.NODE_ENV === "development";

    browser = await puppeteer.launch({
      args: isDev
        ? ["--no-sandbox", "--disable-setuid-sandbox"]
        : chromium.args,
      executablePath: isDev
        ? process.env.CHROME_EXECUTABLE_PATH
        : await chromium.executablePath(),
      headless: true,
    });

    const page = await browser.newPage();

    await page.setUserAgent(
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
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
