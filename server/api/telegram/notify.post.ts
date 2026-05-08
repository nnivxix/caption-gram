export default defineEventHandler(async (event) => {
  const { chatId, caption, url } = await readBody(event);
  const config = useRuntimeConfig();
  const token = config.telegramBotToken;

  if (!token) {
    throw createError({
      statusCode: 500,
      message: "Telegram bot token not configured",
    });
  }

  if (!chatId) {
    throw createError({
      statusCode: 400,
      message: "Chat ID is required",
    });
  }

  const timestamp = new Date().toLocaleString("id-ID", {
    timeZone: "Asia/Jakarta",
    dateStyle: "medium",
    timeStyle: "short",
  });

  const message = `
🎯 *Caption Extracted!*

${caption}

🔗 *URL:* ${url}
⏰ *Time:* ${timestamp}
  `.trim();

  try {
    const response = await $fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: "POST",
        body: {
          chat_id: chatId,
          text: message,
          parse_mode: "Markdown",
        },
      },
    );

    return { success: true, data: response };
  } catch (error: any) {
    console.error("Telegram notification error:", error);
    throw createError({
      statusCode: 500,
      message:
        error?.data?.description || "Failed to send Telegram notification",
    });
  }
});
