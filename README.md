# Caption Gram

A web app for extracting captions from Instagram, YouTube, and Facebook posts using web scraping. Optionally supports sending notifications to Telegram.

## Requirements

- **Node.js** >= 18
- **pnpm** >= 9
- **Google Chrome** (for local development) — used by Puppeteer in development mode
- **Telegram Bot Token** (optional) — required only for Telegram notification feature

## Setup

### 1. Clone & Install Dependencies

```bash
git clone <repo-url>
cd caption-gram
pnpm install
```

### 2. Configure Environment

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Fill in the following variables in your `.env` file:

| Variable                 | Required  | Description                                                                                                                       |
| ------------------------ | --------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `TELEGRAM_BOT_TOKEN`     | Optional  | Telegram bot token from [@BotFather](https://t.me/BotFather). Required only if you want to use the Telegram notification feature. |
| `CHROME_EXECUTABLE_PATH` | Yes (dev) | Path to Google Chrome on your local machine. The default value works for macOS. Update it to match your OS if different.          |

Example `.env`:

```env
TELEGRAM_BOT_TOKEN=123456789:ABC-DEF1234ghIkl-zyx57W2v1u123ew11
CHROME_EXECUTABLE_PATH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
```

> **Linux:**
> ```env
> CHROME_EXECUTABLE_PATH=/usr/bin/google-chrome
> ```

> **Windows:**
> ```env
> CHROME_EXECUTABLE_PATH=C:\Program Files\Google\Chrome\Application\chrome.exe
> ```

## Running the App

### Development

```bash
pnpm dev
```

App runs at `http://localhost:3000`.

### Build for Production

```bash
pnpm build
```

### Preview Production Build

```bash
pnpm preview
```

## Features

- Extract captions from **Instagram**, **YouTube**, and **Facebook** links
- Send captions to **Telegram** (optional, requires bot token & chat ID)
- Configure the Telegram bot via the Settings page (`/settings/telegram-bot`)
