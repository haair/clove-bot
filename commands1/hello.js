module.exports = {
    name: 'hello',
    description: 'Chào người dùng',
    execute(message, args) {
        message.channel.send(`Xin chào ${message.author}! Rất vui được gặp bạn! 😄`);
    }
};