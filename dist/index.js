import { Client, GatewayIntentBits } from "discord.js";
import "dotenv/config";
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});
client.once("ready", () => {
    console.log(`Logged in as ${client.user?.tag}!`);
});
client.on("messageCreate", (message) => {
    if (message.content === "!ping") {
        message.channel.send("Pong!");
    }
});
client.login(process.env.DISCORD_TOKEN);
