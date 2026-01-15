# SMS to Telegram Forwarder

A lightweight Node.js/Express application that receives SMS data via webhook and forwards it to a Telegram bot.
The SMS forwarding is done via https://github.com/bogkonstantin/android_income_sms_gateway_webhook

## Quick Start

```bash
# Clone the repo
git clone <your-repo-url>
cd sms-to-telegram

# Create your .env file
cp .env.example .env

# Edit .env with your values
nano .env

# Start the application
docker compose up -d
```

## Environment Variables

| Variable             | Required | Description                                                   |
| -------------------- | -------- | ------------------------------------------------------------- |
| `TELEGRAM_BOT_TOKEN` | Yes      | Your Telegram bot token from @BotFather                       |
| `TELEGRAM_CHAT_ID`   | Yes      | The chat ID where messages will be sent                       |
| `AUTH_TOKEN`         | Yes      | The suffix on the sms URL to protect your endpoint from abuse |
| `PORT`               | No       | Internal server port (default: 3000)                          |

## Getting Telegram Credentials

### Bot Token

1. Open Telegram and search for `@BotFather`
2. Send `/newbot` and follow the prompts
3. Copy the token provided

### Chat ID

1. Start a chat with your new bot
2. Send any message to it
3. Visit: `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates`
4. Find your `chat.id` in the response

Or message `@userinfobot` to get your personal chat ID.

## API Endpoints

### POST /sms/AUTH_TOKEN

Forward an SMS to Telegram.

**Request:**

```json
{
  "from": "+1234567890",
  "text": "Hello world",
  "sentStamp": "2024-01-15 10:30:00",
  "receivedStamp": "2024-01-15 10:30:05",
  "sim": "SIM1"
}
```

**Response:**

```json
{
  "success": true,
  "message": "SMS forwarded to Telegram"
}
```

### GET /health

Health check endpoint.

## Testing

```bash
curl -X POST http://localhost:3000/sms/AUTH_TOKEN \
  -H "Content-Type: application/json" \
  -d '{
    "from": "+1234567890",
    "text": "Test message",
    "sentStamp": "2024-01-15 10:30:00",
    "receivedStamp": "2024-01-15 10:30:05",
    "sim": "SIM1"
  }'
```

## Docker Commands

```bash
# Start
docker compose up -d

# View logs
docker compose logs -f

# Stop
docker compose down

# Rebuild after changes
docker compose up -d --build
```

## License

MIT
