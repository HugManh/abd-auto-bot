require('dotenv').config();
const { WebClient } = require('@slack/web-api');
const cron = require('node-cron');
const moment = require('moment');
const { quotes } = require('./quotes');

const token = process.env.SLACK_BOT_TOKEN;
const channelId = process.env.SLACK_CHANNEL_ID;

const web = new WebClient(token);

async function sendMessage(message) {
    try {
        const now = moment().format('YYYY-MM-DD HH:mm:ss');
        const result = await web.chat.postMessage({
            channel: channelId,
            text: message,
        });
        console.log(`[${now}] Message sent:`, result.ts);
    } catch (error) {
        console.error('Error sending message:', error);
    }
}

// 8h15
cron.schedule('30 8 * * *', () => {
    const dayOfMonth = moment().date();
    const quote = quotes[dayOfMonth - 1] || 'Chúc anh em một ngày làm việc hiệu quả!`:';
    sendMessage(quote);
});

// 13h30
cron.schedule('30 13 * * *', () => {
    sendMessage("Mọi người nhớ làm việc cẩn thận, tỉ mỉ, test kĩ những task mình làm nhé 🚀`");
});

// 17h15
cron.schedule('15 17 * * *', () => {
    sendMessage("Anh em nhớ báo cáo tiến độ hàng ngày nha 🚀`,");
});

console.log('Slack bot started, waiting for the next scheduled time...');
