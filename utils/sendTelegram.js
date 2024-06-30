const axios = require("axios");

async function sendTelegram(msg) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  const linkurl = `https://api.telegram.org/bot${token}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(
    msg
  )}`;

  try {
    const response = await axios.get(linkurl);
    console.log("Message sent to Telegram:", response.data);
  } catch (error) {
    console.error("Error sending message to Telegram:", error);
  }
}

module.exports = sendTelegram;
