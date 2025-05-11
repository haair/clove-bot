const { QueryType } = require('discord-player');

module.exports = {
    name: 'play',
    description: 'Phát nhạc từ YouTube',
    async execute(message, args, client, player) {
        if (!message.member.voice.channel) {
            return message.channel.send('Bạn cần ở trong voice channel để phát nhạc!');
        }

        const query = args.join(' ');
        if (!query) {
            return message.channel.send('Vui lòng cung cấp link YouTube hoặc từ khóa tìm kiếm!');
        }

        try {
            const { track } = await player.play(message.member.voice.channel, query, {
                requestedBy: message.author,
                searchEngine: QueryType.YOUTUBE,
                nodeOptions: {
                    metadata: message
                }
            });

            message.channel.send(`Đang phát: **${track.title}**`);
        } catch (error) {
            console.error('Lỗi khi phát nhạc:', error);
            message.channel.send('Không thể phát nhạc! Vui lòng thử lại.');
        }
    }
};