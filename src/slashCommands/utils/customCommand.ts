import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { slashCommands } from "..";

export class CustomCommand {
  command: SlashCommandBuilder;
  execute: (interaction: CommandInteraction) => void;
  constructor(
    command: SlashCommandBuilder,
    execute: (interaction: CommandInteraction) => void
  ) {
    this.command = command;
    this.execute = execute;
    slashCommands.push(this);
  }
}
