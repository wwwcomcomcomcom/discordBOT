import { REST, Routes } from "discord.js";
import "../index";
import { slashCommands } from "../index";
export function deployCommands() {
  console.log("Deploying commands...");
  const rest = new REST({ version: "9" }).setToken(process.env.DISCORD_TOKEN!);
  const commandDatas = slashCommands.map((command) => command.command.toJSON());
  rest
    .put(Routes.applicationCommands(process.env.CLIENT_ID!), {
      body: commandDatas,
    })
    .then(() => console.log("Successfully registered application commands."))
    .catch(console.error);
}
