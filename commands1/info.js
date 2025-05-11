module.exports = {
    name: 'info',
    description: 'Hiển thị thông tin về bot',
    execute(message, args) {
        message.channel.send('Tôi là một bot đơn giản được tạo bởi Grok! Dùng !hello để chào tôi nhé!');
    }
};