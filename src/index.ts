import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  Client,
  Collection,
  Events,
  GatewayIntentBits,
  MessageActionRowComponentBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuInteraction,
  StringSelectMenuOptionBuilder,
  UserSelectMenuBuilder,
} from "discord.js";
import "dotenv/config";
import { Command } from "./command";

import "./money/moneyCommand";

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

new Command("!help", "Help command", ([message]) => {
  message.reply(
    Command.commandList
      .map((command) => `${command.name} - ${command.description}`)
      .join("\n")
  );
});

new Command("!test", "Test command", ([message]) => {
  const confirmButton = new ButtonBuilder()
    .setCustomId("confirm")
    .setLabel("확인")
    .setStyle(ButtonStyle.Primary);
  const cancelButton = new ButtonBuilder()
    .setCustomId("cancel")
    .setLabel("취소")
    .setStyle(ButtonStyle.Secondary);
  const select = new StringSelectMenuBuilder()
    .setCustomId("starter")
    .setPlaceholder("Make a selection!")
    .addOptions(
      new StringSelectMenuOptionBuilder()
        .setLabel("Bulbasaur")
        .setDescription("The dual-type Grass/Poison Seed Pokémon.")
        .setValue("bulbasaur"),
      new StringSelectMenuOptionBuilder()
        .setLabel("Charmander")
        .setDescription("The Fire-type Lizard Pokémon.")
        .setValue("charmander"),
      new StringSelectMenuOptionBuilder()
        .setLabel("Squirtle")
        .setDescription("The Water-type Tiny Turtle Pokémon.")
        .setValue("squirtle")
    );
  const row =
    new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
      confirmButton,
      cancelButton
    );
  const row2 =
    new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
      select
    );
  const userSelect = new UserSelectMenuBuilder()
    .setCustomId("users")
    .setPlaceholder("Select multiple users.")
    .setMinValues(1)
    .setMaxValues(10);
  const row3 =
    new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
      userSelect
    );
  message.reply({
    content: "테스트",
    components: [row, row2, row3],
  });
});

client.on(Events.InteractionCreate, (interaction) => {
  if (!interaction.isMessageComponent()) return;
  console.log(interaction.customId);
  if (interaction.isButton()) {
    handleButtonInteraction(interaction);
  } else if (interaction.isStringSelectMenu()) {
    handleSelectMenuInteraction(interaction);
  } else if (interaction.isUserSelectMenu()) {
    interaction.reply(`You selected <@${interaction.values.join(", ")}>`);
  }
});
function handleButtonInteraction(interaction: ButtonInteraction) {
  if (interaction.customId === "confirm") {
    interaction.reply("Confirmed!");
  } else if (interaction.customId === "cancel") {
    interaction.reply("Cancelled!");
    interaction.message.edit({
      content: ":x: This message has been closed.",
      components: [],
    });
  }
}
function handleSelectMenuInteraction(interaction: StringSelectMenuInteraction) {
  console.log(interaction.customId);
  if (interaction.customId === "starter") {
    interaction.reply(`You selected ${interaction.values[0]}`);
  }
}

client.on(Events.MessageCreate, (message) => {
  Command.handleMessage([message]);
});

client.login(process.env.DISCORD_TOKEN);
