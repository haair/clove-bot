module.exports = {
    name: 'ready',
    once: true,
    execute(client) {
        console.log(`Bot đã sẵn sàng! Đăng nhập với tên: ${client.user.tag}`);
    }
};