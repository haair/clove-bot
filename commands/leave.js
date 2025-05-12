const { SlashCommandBuilder } = require('discord.js');
const { createAudioPlayer, createAudioResource, AudioPlayerStatus, VoiceConnectionStatus, getVoiceConnection } = require('@discordjs/voice');
const fs = require('fs');
const path = require('path');

// Đường dẫn đến thư mục sounds
const soundsDir = path.join(__dirname, '..', 'sounds');
// File âm thanh mặc định khi rời
const goodbyeSound = 'nah.mp3';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leave')
        .setDescription('Ngắt kết nối bot khỏi voice channel và phát âm thanh rời'),
    async execute(interaction, client) {
        const connection = getVoiceConnection(interaction.guild.id)
        if (!connection) {
            return interaction.reply({ content: 'Bot không ở trong voice channel!', ephemeral: true });
        }

        try {
            // Tìm file âm thanh rời
            const goodbyeSoundFile = path.join(soundsDir, goodbyeSound);
            if (fs.existsSync(goodbyeSoundFile)) {
                const player = createAudioPlayer();
                const resource = createAudioResource(fs.createReadStream(goodbyeSoundFile));
                player.play(resource);
                connection.subscribe(player);
                // await interaction.reply({ content: `Đang phát âm thanh rời: ${goodbyeSound.replace('.mp3', '')}` });
                await new Promise(resolve => player.on(AudioPlayerStatus.Idle, resolve));
            } else {
                await interaction.reply({ content: `Cảnh báo: Không tìm thấy âm thanh rời (${goodbyeSound}).` });
            }

            // Ngắt kết nối
            if (connection.state.status !== VoiceConnectionStatus.Destroyed) {
                connection.destroy();
            }
            // await interaction.followUp({ content: 'Đã rời voice channel!' });
            await interaction.reply({ content: 'Bye' });
        } catch (error) {
            console.error('Lỗi khi rời voice channel:', error);
            await interaction.reply({ content: 'Có lỗi xảy ra khi rời voice channel!', ephemeral: true });
            if (connection.state.status !== VoiceConnectionStatus.Destroyed) {
                connection.destroy();
                client.voiceConnections.delete(interaction.guild.id);
            }
        }
    }
};