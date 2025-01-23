import { Command } from "../command";
import * as Repository from "../db";
import { CustomUser } from "../user";
import { playCoin, playDice } from "./moneyGame";

function isNumberInput(input: string): boolean {
  return !isNaN(Number(input));
}
function parseBet(bet: string, user: CustomUser): bigint {
  if (bet === "올인") {
    return user.money;
  }
  return BigInt(bet);
}

new Command("!일", "일함", ([message]) => {
  Repository.getUser(message.author.id).then((user) => {
    if (user.isCooldown()) {
      message.reply("쿨타임이 남아있습니다.");
      return;
    }
    user.updateCooldown();

    user.money += BigInt(Math.floor(Math.random() * 10000));
    Repository.updateUser(user);
    message.reply(`일을 해서 돈을 벌었습니다. 현재 돈: ${user.money}`);
  });
});
//TODO: Implement !배움 command
// new Command("!배움", "공부함", ([message]) => {

// });

new Command(
  "!도박.동전",
  "동전던지기",
  async ([message], _bet: string, predict: string) => {
    const user = await Repository.getUser(message.author.id);
    try {
      const bet = parseBet(_bet, user);
      message.reply(playCoin(user, bet, predict));
    } catch (e) {
      message.reply("베팅할 금액을 입력해주세요.");
      return;
    }
  }
);
new Command(
  "!도박.주사위",
  "주사위 굴리기",
  async ([message], _bet: string, predict: string) => {
    const user = await Repository.getUser(message.author.id);
    try {
      const bet = parseBet(_bet, user);
      message.reply(playDice(user, bet, Number(predict)));
    } catch (e) {
      message.reply("베팅할 금액을 입력해주세요.");
      return;
    }
  }
);

new Command("!돈", "돈 확인", ([message]) => {
  Repository.getUser(message.author.id).then((user) => {
    message.reply(`현재 돈: ${user.money}`);
  });
});

new Command("!랭킹", "랭킹 확인", ([message]) => {
  Repository.getAllUsers().then((users) => {
    const sortedUsers = users.sort((a, b) => Number(b.money) - Number(a.money));
    const rank = sortedUsers.findIndex((user) => user.id === message.author.id);
    let response = "";
    sortedUsers.forEach((user, index) => {
      response += `\n${index + 1}등: <@${user.id}> - ${user.money}원`;
    });
    message.reply(`당신의 순위는 ${rank + 1}등 입니다.${response}`);
  });
});
