module.exports = {
    name: 'stop',
    description: 'Dừng phát nhạc và xóa hàng đợi',
    async execute(message, args, client, player) {
        const queue = player.getQueue(message.guild.id);
        if (!queue || !queue.playing) {
            return message.channel.send('Không có nhạc đang phát!');
        }

        queue.destroy();
        message.channel.send('Đã dừng nhạc và xóa hàng đợi!');
    }
};