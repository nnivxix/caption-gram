# Caption Gram

A web app for extracting captions from Instagram, YouTube, and Facebook posts using web scraping. Optionally supports sending notifications to Telegram.

## Requirements

- **Node.js** >= 22.x
- **pnpm** >= 10.x

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

| Variable          | Required | Description             |
| ----------------- | -------- | ----------------------- |
| `CAPTION_API_URL` | Optional | URL of the Caption API. |

Example `.env`:

```env
CAPTION_API_URL=http://localhost:8000
```


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

## Links
- [Telegram Bot](https://t.me/caption_gram_bot)
- [Caption Gram API GitHub Repository](https://github.com/nnivxix/caption-gram-api)