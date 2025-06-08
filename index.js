// require('dotenv').config();
const { WebClient } = require('@slack/web-api');
const cron = require('node-cron');
const moment = require('moment');
const { quotes } = require('./quotes');

const token = process.env.SLACK_BOT_TOKEN;
const channelId = process.env.SLACK_CHANNEL_ID;
if (!token || !channelId) {
  console.error("Missing SLACK_BOT_TOKEN or SLACK_CHANNEL_ID in .env");
}
console.log(`Slack Bot: ${channelId}`);

const web = new WebClient(token);

async function sendMessage(message) {
    try {
        const now = moment().format('YYYY-MM-DD HH:mm:ss');
        const result = await web.chat.postMessage({
            channel: channelId,
            text: message,
        });
        console.log(`[${now}] Channel: ${result.channel} Timestamp: ${result.ts}`);
    } catch (error) {
        console.error('Error sending message:', error);
    }
}

// Gửi lời chào khi bot khởi động
sendMessage("Chúc anh em một ngày làm việc hiệu quả! 🚀");

// 08:30 sáng, từ thứ 2 đến thứ 6
cron.schedule('30 8 * * 1-5', () => {
    const dayOfMonth = moment().date();
    const quote = quotes[dayOfMonth - 1] || 'Không có con đường nào dẫn đến thành công mà không có nỗ lực và công sức. 🛠️';
    const message = `${quote}\n Chúc mọi người có một ngày làm việc hiệu quả!`;
    sendMessage(message);
});

// 13:30 chiều, từ thứ 2 đến thứ 6
cron.schedule('30 13 * * 1-5', () => {
    sendMessage("Hiện tại ưu tiên về chất lượng code + task, không yêu cầu về tốc độ phải nhanh. Mọi người nhớ làm việc cẩn thận, tỉ mỉ, test kĩ những task mình làm.  🚀");
});

// 17:20 chiều, từ thứ 2 đến thứ 6
// cron.schedule('20 17 * * 1-5', () => {
//     sendMessage("Anh em nhớ báo cáo tiến độ hàng ngày nha 🚀\n📌 Link báo cáo: <https://docs.google.com/spreadsheets/d/1qM2UDT8pRcPFS-reqe4-WU3_sVsRQ-LPKc66huIAKag/edit?gid=0#gid=0>");
// });

// 15:55 chiều, chỉ thứ 6
cron.schedule('55 15 * * 5', () => {
    sendMessage("Mọi người chuẩn bị vào họp team lúc 5h nhé");
});
console.log('Slack bot started, waiting for the next scheduled time...');
