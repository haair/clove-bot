const schedule = require('node-schedule');
const moment = require('moment-timezone');

function scheduleGoodMorning(client) {
    schedule.scheduleJob('* * * * *', async () => {
        const now = moment().tz('Asia/Ho_Chi_Minh');
        if (now.hour() === 23 && now.minute() === 30) {
            const channel = await client.channels.fetch(process.env.CHANNEL_ID);
            if (channel && channel.isTextBased()) {
                channel.send({
                    content: '@everyone 🌙 Chúc mọi người ngủ ngon!',
                    allowedMentions: { parse: ['everyone'] }
                });
            }
        }
    });

    // Valorant
    schedule.scheduleJob('* * * * *', async () => {
        const now = moment().tz('Asia/Ho_Chi_Minh');
        if (now.hour() === 21 && now.minute() === 59) {
            const channel = await client.channels.fetch(process.env.CHANNEL_ID);
            if (channel && channel.isTextBased()) {
                channel.send({
                    content: `@everyone Chào buổi sáng cả nhà iu, nhớ gửi shop của mình vào <#${process.env.THREAD_ID} nhé>`,
                    allowedMentions: { parse: ['everyone'] }
                });
            }
        }
    });

    // Netflix and chill
    schedule.scheduleJob('00 22 * * 4', async () => {
        const now = moment().tz('Asia/Ho_Chi_Minh');
        if (now.hour() === 21 && now.minute() === 59) {
            const channel = await client.channels.fetch('1258057651800113224');
            if (channel && channel.isTextBased()) {
                channel.send({
                    content: `@everyone Đến lúc xem phim rồi`,
                    allowedMentions: { parse: ['everyone'] }
                });
            }
        }
    });

}

module.exports = { scheduleGoodMorning };