const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('support')
        .setDescription('🛠 Lệnh hỗ trợ người dùng - liên hệ hỗ trợ kỹ thuật'),
    async execute(interaction) {
        await interaction.reply('Bạn cần hỗ trợ gì?');
    },
};
