import { saveUserOnCache } from "./db";

export class CustomUser {
  static cooldown = 1000 * 3;
  public lastWorked = 0;
  isCooldown() {
    return Date.now() - this.lastWorked < CustomUser.cooldown;
  }
  updateCooldown() {
    this.lastWorked = Date.now();
  }
  constructor(public id: string, public money: bigint) {
    saveUserOnCache(this);
  }
}
