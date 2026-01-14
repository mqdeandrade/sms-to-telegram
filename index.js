import express from "express";

const app = express();
const PORT = process.env.PORT || 3000;

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;
const AUTH_TOKEN = process.env.AUTH_TOKEN;

if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID || !AUTH_TOKEN) {
  console.error(
    "Missing required environment variables: TELEGRAM_BOT_TOKEN and/or TELEGRAM_CHAT_ID and/or AUTH_TOKEN"
  );
  process.exit(1);
}

app.use(express.json());

async function sendToTelegram(message) {
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      chat_id: TELEGRAM_CHAT_ID,
      text: message,
      parse_mode: "HTML",
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Telegram API error: ${response.status} - ${error}`);
  }

  return response.json();
}

function formatMessage(payload) {
  const { from, text, sentStamp, receivedStamp, sim } = payload;

  return `📱 <b>New SMS Received</b>

<b>From:</b> ${from || "Unknown"}
<b>SIM:</b> ${sim || "Unknown"}
<b>Sent:</b> ${sentStamp || "Unknown"}
<b>Received:</b> ${receivedStamp || "Unknown"}

<b>Message:</b>
${text || "(empty)"}`;
}

app.post(`/sms/${AUTH_TOKEN}`, async (req, res) => {
  console.log("Received SMS payload:", JSON.stringify(req.body, null, 2));

  try {
    const { from, text } = req.body;

    if (!from && !text) {
      return res.status(400).json({
        success: false,
        error: "Invalid payload: missing required fields",
      });
    }

    const message = formatMessage(req.body);
    await sendToTelegram(message);

    console.log("Message forwarded to Telegram successfully");
    res.json({ success: true, message: "SMS forwarded to Telegram" });
  } catch (error) {
    console.error("Error forwarding to Telegram:", error.message);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`SMS to Telegram forwarder running on port ${PORT}`);
});
