export default defineEventHandler(async (event) => {
  const { chatId } = await readBody(event);
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

  const message = `
✅ *Chat ID Validated Successfully!*

Your Telegram Chat ID has been verified and saved.
You will now receive caption notifications here.

🤖 Caption Gram Bot is ready to send you captions!
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

    return { success: true, chatId, data: response };
  } catch (error: any) {
    console.error("Telegram validation error:", error);
    throw createError({
      statusCode: 400,
      message:
        error?.data?.description ||
        "Invalid Chat ID. Please check and try again.",
    });
  }
});
