import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { CustomCommand } from "./utils/customCommand";

new CustomCommand(
  new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with Pong!"),
  async (interaction: CommandInteraction) => {
    await interaction.reply("Pong!");
  }
);
