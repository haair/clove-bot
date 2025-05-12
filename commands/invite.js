const { SlashCommandBuilder } = require('discord.js');
const { createAudioPlayer, createAudioResource, joinVoiceChannel, getVoiceConnection, AudioPlayerStatus, VoiceConnectionStatus } = require('@discordjs/voice');
const fs = require('fs');
const path = require('path');

// Đường dẫn đến thư mục sounds
const soundsDir = path.join(__dirname, '..', 'sounds');
// File âm thanh mặc định khi join
const defaultSound = 'hello.mp3';
// File âm thanh mặc định khi rời
const goodbyeSound = 'nah.mp3';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('invite')
        .setDescription('Mời bot vào voice channel và phát âm thanh mặc định'),
    async execute(interaction) {
        // Kiểm tra người dùng có trong voice channel không
        if (!interaction.member.voice.channel) {
            return interaction.reply({ content: 'Bạn cần ở trong voice channel để mời bot!', ephemeral: true });
        }

        let connection;
        try {
            // Kiểm tra xem bot đã ở trong voice channel chưa
            connection = getVoiceConnection(interaction.guild.id)
            if (connection) {
                return interaction.reply({ content: 'Bot đã ở trong voice channel! Dùng /sound để phát âm thanh.', ephemeral: true });
            }

            // Tham gia voice channel
            connection = joinVoiceChannel({
                channelId: interaction.member.voice.channel.id,
                guildId: interaction.guild.id,
                adapterCreator: interaction.guild.voiceAdapterCreator
            });

            // Tạo audio player
            const player = createAudioPlayer();

            // Tìm file âm thanh mặc định
            const defaultSoundFile = path.join(soundsDir, defaultSound);
            if (!fs.existsSync(defaultSoundFile)) {
                await interaction.reply({ content: `Cảnh báo: Không tìm thấy âm thanh mặc định (${defaultSound}). Bot đã join nhưng không phát âm thanh.` });
                return;
            }

            // Tạo audio resource từ file MP3 mặc định
            const resource = createAudioResource(fs.createReadStream(defaultSoundFile));
            player.play(resource);

            // Kết nối player với voice
            connection.subscribe(player);

            // Thông báo đang phát
            await interaction.reply({ content: `Bot đã join và đang phát âm thanh mặc định: ${defaultSound.replace('.mp3', '')}` });

            // Xử lý lỗi player
            player.on('error', error => {
                console.error('Lỗi player:', error);
                interaction.followUp({ content: 'Có lỗi xảy ra khi phát âm thanh!' });
            });

        } catch (error) {
            console.error('Lỗi khi mời bot:', error);
            await interaction.reply({ content: 'Không thể mời bot hoặc phát âm thanh! Vui lòng thử lại.', ephemeral: true });
        }
    }
};