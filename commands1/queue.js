module.exports = {
    name: 'queue',
    description: 'Hiển thị danh sách bài hát trong hàng đợi',
    execute(message, args, client, player) {
        const queue = player.getQueue(message.guild.id);
        if (!queue || !queue.playing) {
            return message.channel.send('Không có nhạc trong hàng đợi!');
        }

        const tracks = queue.tracks.map((track, i) => `${i + 1}. ${track.title} (yêu cầu bởi ${track.requestedBy.username})`);
        message.channel.send(`**Hàng đợi hiện tại**:\n${tracks.join('\n')}\n\nĐang phát: ${queue.current.title}`);
    }
};