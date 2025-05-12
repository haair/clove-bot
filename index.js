const { Client, GatewayIntentBits, Collection, REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();
const express = require('express');

// Tạo client bot
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates
    ]
});

// Đọc và đăng ký lệnh
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));


const commands = [];
for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    client.commands.set(command.data.name, command);
    commands.push(command.data.toJSON());
}

// Đăng ký slash commands với Discord API
const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
    try {
        console.log('Bắt đầu đăng ký slash commands...');
        await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
            { body: commands }
        );
        console.log('Đã đăng ký thành công slash commands.');
    } catch (error) {
        console.error('Lỗi khi đăng ký slash commands:', error);
    }
})();

// Đọc và đăng ký sự kiện
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    client.on(event.name, (...args) => event.execute(...args, client));
}

// Xử lý slash commands
client.on('interactionCreate', async interaction => {
    if (interaction.isAutocomplete()) {
        await interaction.deferReply({ ephemeral: true });
        const focusedValue = interaction.options.getFocused();
        const choices = fs.readdirSync('./sounds')
            .filter(f => f.endsWith('.mp3') || f.endsWith('.wav'));

        const filtered = choices
            .filter(choice => choice.toLowerCase().includes(focusedValue.toLowerCase()))
            .slice(0, 25); // Discord giới hạn 25 kết quả

        await interaction.respond(
            filtered.map(choice => ({ name: choice, value: choice })),
        );
    }

    // Slash command chính
    if (interaction.isChatInputCommand()) {
        const command = commands.get(interaction.commandName);
        if (command) {
            try {
                await command.execute(interaction);
            } catch (error) {
                console.error(error);
                await interaction.reply({ content: 'Đã xảy ra lỗi khi thực hiện lệnh!', ephemeral: true });
            }
        }
    }
});

// Đăng nhập bot
client.login(process.env.DISCORD_TOKEN);

const app = express();

app.get('/', (req, res) => res.send('Bot is running!'));

app.listen(3000, () => console.log('Web server running...'));
