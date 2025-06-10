require('dotenv').config()
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
const timezone = "Asia/Ho_Chi_Minh"
const timeformat = "YYYY-MM-DD HH:mm:ss [GMT]Z"

async function sendMessage(message) {
    const now = moment().format(timeformat);
    try {
        const result = await web.chat.postMessage({
            channel: channelId,
            text: message,
        });
        console.log(`[${now}] Channel: ${result.channel} Timestamp: ${result.ts}`);
    } catch (error) {
        console.error(`[${now}] Error sending message:`, error);
    }
}

async function botInfo() {
    const now = moment().format(timeformat);
    try {
        const auth = await web.auth.test();
        console.log(`[${now}] Slack Bot Info:`, {
            user_id: auth.user_id,
            user: auth.user,
            team: auth.team,
            url: auth.url
        });
    } catch (error) {
        console.error(`[${now}] Error Slack Bot:`, error);
    }
}

// Gửi lời chào khi bot khởi động
// sendMessage("Chúc anh em một ngày làm việc hiệu quả! 🚀");

// Railway sleep. If no packets are sent from the service for over 10 minutes, the service is considered inactive.
cron.schedule('*/5 * * * *', () => {
    botInfo()
}, { scheduled: true, timezone: timezone })

// 08:30 sáng, từ thứ 2 đến thứ 6
cron.schedule('30 8 * * 1-5', () => {
    const dayOfMonth = moment().date();
    const quote = quotes[dayOfMonth - 1] || 'Không có con đường nào dẫn đến thành công mà không có nỗ lực và công sức. 🛠️';
    const message = `${quote}\n Chúc mọi người có một ngày làm việc hiệu quả!`;
    sendMessage(message);
}, { scheduled: true, timezone: timezone });

// 13:30 chiều, từ thứ 2 đến thứ 6
cron.schedule('30 13 * * 1-5', () => {
    sendMessage("Hiện tại ưu tiên về chất lượng code + task, không yêu cầu về tốc độ phải nhanh. Mọi người nhớ làm việc cẩn thận, tỉ mỉ, test kĩ những task mình làm.  🚀");
}, { scheduled: true, timezone: timezone });

// 17:20 chiều, từ thứ 2 đến thứ 6
cron.schedule('20 17 * * 1-5', () => {
    sendMessage("Anh em nhớ báo cáo tiến độ hàng ngày nha 🚀");
}, { scheduled: true, timezone: timezone });

// 15:55 chiều, chỉ thứ 6
cron.schedule('55 15 * * 5', () => {
    sendMessage("Mọi người chuẩn bị vào họp team lúc 5h nhé");
}, { scheduled: true, timezone: timezone });
console.log('Slack bot started, waiting for the next scheduled time...');
botInfo()
