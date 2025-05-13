// deploy-commands.js (triển khai slash command)
const { SlashCommandBuilder, MessageFlags } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('soundboard')
        .setDescription('Phát một âm thanh từ soundboard')
        .addStringOption(option =>
            option.setName('sound')
                .setDescription('Chọn file âm thanh')
                .setRequired(true)
                .setAutocomplete(true)
        ),
    async execute(interaction) {
        const sound = interaction.options.getString('sound');
        const filePath = `./sounds/${sound}`;

        const { joinVoiceChannel, createAudioPlayer, createAudioResource } = require('@discordjs/voice');
        const fs = require('fs');

        if (!fs.existsSync(filePath)) {
            await interaction.reply({ content: 'Không tìm thấy file âm thanh!', ephemeral: true });
            return;
        }

        const member = interaction.member;
        const channel = member.voice?.channel;
        if (!channel) {
            await interaction.reply({ content: 'Bạn cần tham gia voice channel!', ephemeral: true });
            return;
        }

        const connection = joinVoiceChannel({
            channelId: channel.id,
            guildId: interaction.guild.id,
            adapterCreator: interaction.guild.voiceAdapterCreator,
        });

        const resource = createAudioResource(filePath);
        const player = createAudioPlayer();
        connection.subscribe(player);

        player.play(resource);

        await interaction.reply({ content: `🎵 Đang phát: \`${sound}\``, flags: MessageFlags.Ephemeral });
    },
};
