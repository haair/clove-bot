// deploy-commands.js (triển khai slash command)
const { SlashCommandBuilder } = require('discord.js');

const axios = require('axios');
const { parseDateDMY } = require('../utils/convert');

// function parseDateDMY(dateString) {
//     const [day, month, year] = dateString.split('/').map(Number);
//     return new Date(year, month - 1, day); // Tháng bắt đầu từ 0 (Jan = 0)
// }

module.exports = {
    data: new SlashCommandBuilder()
        .setName('love')
        .setDescription('Data lớp lone')
    ,
    async execute(interaction) {
        try {
            const response = await axios.get('https://student-api-451c.onrender.com/api/students', {
                headers: {
                    'X-API-Key': process.env.API_KEY
                    // hoặc
                    // 'x-api-key': 'YOUR_API_KEY'
                }
            });
            const data = response.data; // lấy 5 người đầu tiên để hiển thị

            let isHavaBirthDay = false;

            // Tạo bảng dạng chuỗi
            let table = "```";
            table += `| Full name            | Birth      | Sex | Facebook        |\n`;
            table += `|----------------------|------------|-----|-----------------|\n`;
            data.forEach(user => {
                const now = new Date();
                const userDate = new parseDateDMY(user.ngay_sinh);
                if (now.getMonth() === userDate.getMonth()) {
                    isHavaBirthDay = true;
                    const name = user.ho_ten.padEnd(20);
                    const birth = user.ngay_sinh
                    const sex = user.gioi_tinh.padEnd(3);
                    const fb = user.fb_url.slice(-15);
                    table += `| ${name} | ${birth} | ${sex} | ${fb} |\n`;
                }
            });
            if (!isHavaBirthDay) {
                table += `\nTHÁNG NÀY ĐÉO CÓ SINH NHẬT BẠN NÀO CẢ!`
            }
            table += `\n* https://www.facebook.com/profile.php?id={id ở cột Facebook}`
            table += "```";

            await interaction.reply(table);
        } catch (error) {
            console.error(error);
            await interaction.editReply('Lỗi khi gọi API.');
        }
    },
};