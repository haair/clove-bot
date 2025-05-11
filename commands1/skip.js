module.exports = {
    name: 'skip',
    description: 'Bỏ qua bài hát hiện tại',
    async execute(message, args, client, player) {
        const queue = player.getQueue(message.guild.id);
        if (!queue || !queue.playing) {
            return message.channel.send('Không có nhạc đang phát!');
        }

        queue.skip();
        message.channel.send('Đã bỏ qua bài hát hiện tại!');
    }
};