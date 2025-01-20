import { Command } from "../command";
import * as Repository from "../db";

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
  ([message], _bet: string, predict: string) => {
    const bet = Number(_bet);
    if (isNaN(bet)) {
      message.reply("베팅할 금액을 입력해주세요.");
      return;
    }
    if (bet < 100) {
      message.reply("100원 이상부터 베팅해주세요.");
      return;
    }
    if (!["앞면", "뒷면", "앞", "뒤"].includes(predict)) {
      message.reply("올바른 예측을 입력해주세요. (앞면, 뒷면, 앞, 뒤)");
      return;
    }
    predict = predict.slice(0, 1);
    if (predict === "뒤") predict = "뒷";
    Repository.getUser(message.author.id).then((user) => {
      if (user.isCooldown()) {
        message.reply("쿨타임이 남아있습니다.");
        return;
      } else {
        user.updateCooldown();
      }
      if (user.money < BigInt(bet)) {
        message.reply(`돈이 부족합니다. 잔액: ${user.money}원`);
        return;
      }
      const result = Math.random() > 0.5 ? "앞" : "뒷";
      if (result === predict) {
        user.money += BigInt(bet);
        Repository.updateUser(user);
        message.reply(`${result}면! ${bet}원을 얻었습니다.`);
      } else {
        user.money -= BigInt(bet);
        Repository.updateUser(user);
        message.reply(`${result}면! ${bet}원을 잃었습니다.`);
      }
    });
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
