const axios = require('axios');
require('dotenv').config();

async function testTelegram() {
  const telegramToken = process.env.TELEGRAM_BOT_TOKEN;
  const telegramChatId = process.env.TELEGRAM_CHAT_ID;

  if (!telegramToken || !telegramChatId) {
    console.error('Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID');
    return;
  }

  try {
    const textMsg = `🚨 <b>Test Message</b>\n\nThis is a test message to verify the bot is working.`;
    
    const response = await axios.post(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
      chat_id: telegramChatId,
      text: textMsg,
      parse_mode: 'HTML'
    });
    
    console.log('Success! Message sent:', response.data);
  } catch (error) {
    console.error('Failed to send Telegram message:', error.response ? error.response.data : error.message);
  }
}

testTelegram();
