import { CustomException } from "../exception";
import { CustomUser } from "../user";

type Reply = string;

function validateGame(user: CustomUser, bet: bigint) {
  if (user.isCooldown()) {
    throw new CustomException("쿨타임이 남아있습니다.");
  } else {
    user.updateCooldown();
  }
  if (user.money < bet) {
    throw new CustomException(`돈이 부족합니다. 잔액: ${user.money}원`);
  }
}

export function playDice(
  user: CustomUser,
  bet: bigint,
  predict: number
): Reply {
  try {
    validateGame(user, bet);
  } catch (e) {
    return e instanceof CustomException ? e.message : String(e);
  }
  const result = Math.floor(Math.random() * 6) + 1;
  if (result === predict) {
    user.money += bet * BigInt(5);
    return `${result}! ${bet}원을 얻었습니다.`;
  } else {
    user.money -= bet;
    return `${result}! ${bet}원을 잃었습니다.`;
  }
}

export function playCoin(
  user: CustomUser,
  bet: bigint,
  predict: string
): Reply {
  try {
    validateGame(user, bet);
  } catch (e) {
    return e instanceof CustomException ? e.message : String(e);
  }
  if (predict === "뒤") predict = "뒷";
  const result = Math.random() > 0.5 ? "앞" : "뒷";
  if (result === predict) {
    user.money += bet;
    return `${result}면! ${bet}원을 얻었습니다.`;
  } else {
    user.money -= bet;
    return `${result}면! ${bet}원을 잃었습니다.`;
  }
}
