const axios = require('axios');
require('dotenv').config();

async function testTelegram() {
  const telegramToken = process.env.TELEGRAM_BOT_TOKEN;
  const telegramChatId = process.env.TELEGRAM_CHAT_ID;

  try {
    const textMsg = `🚨 <b>New Payment Verification</b>\n\n<b>User:</b> karthiknarsipatnam@gmail.com (karthik)\n<b>Amount:</b> ₹299\n<b>UTR:</b> <code>123456789012</code>`;
    
    const replyMarkup = {
      inline_keyboard: [
        [
          { text: "✅ Approve", url: `http://127.0.0.1.nip.io:1337/api/payment/admin-action?tx=123456789012&action=approve` },
          { text: "❌ Reject", url: `http://127.0.0.1.nip.io:1337/api/payment/admin-action?tx=123456789012&action=reject` }
        ]
      ]
    };

    const response = await axios.post(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
      chat_id: telegramChatId,
      text: textMsg,
      parse_mode: 'HTML',
      reply_markup: replyMarkup
    });
    
    console.log('Success! Message sent:', response.data);
  } catch (error) {
    console.error('Failed with 400:', error.response ? JSON.stringify(error.response.data) : error.message);
  }
}

testTelegram();
