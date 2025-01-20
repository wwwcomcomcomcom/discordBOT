import { ClientEvents, Events } from "discord.js";

export class Command {
  constructor(
    public name: string,
    public description: string,
    public callback: (
      [message]: ClientEvents[Events.MessageCreate],
      ...args: string[]
    ) => void
  ) {
    Command.commandList.push(this);
  }

  static commandList: Command[] = [];

  static getCommand(name: string) {
    return Command.commandList.find((command) => command.name === name);
  }
  static handleMessage([message]: ClientEvents[Events.MessageCreate]) {
    if (message.author.bot) return;
    const [commandName, ...args] = message.content.split(" ");
    const command = Command.getCommand(commandName);
    if (command) {
      command.callback([message], ...args);
    }
  }
}
