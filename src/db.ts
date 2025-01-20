import { PrismaClient } from "@prisma/client";
import { CustomUser } from "./user";

const prisma = new PrismaClient();

export async function createUser(id: string) {
  await prisma.user
    .create({
      data: {
        id: id,
        money: BigInt(0).toString(),
      },
    })
    .catch((reason: any) => {
      console.error(reason);
    })
    .finally(() => {
      console.log("user created");
    });
}

const userCache = new Map<string, CustomUser>();
export function saveUserOnCache(user: CustomUser) {
  userCache.set(user.id, user);
}
/**
 *
 * @param id
 * @returns CustomUser
 * if user is not exist, create user and return CustomUser
 */
export async function getUser(id: string): Promise<CustomUser> {
  const cachedUser = userCache.get(id);
  if (cachedUser !== undefined) {
    return cachedUser;
  }

  return await prisma.user
    .findUnique({
      where: {
        id: id,
      },
    })
    .then(
      async (
        userData: {
          id: string;
          money: string | number | bigint | boolean;
        } | null
      ) => {
        if (userData === null) {
          await createUser(id);
          return new CustomUser(id, BigInt(0));
        } else {
          return new CustomUser(userData.id, BigInt(userData.money));
        }
      }
    );
}
export function updateUser(user: CustomUser) {
  prisma.user
    .update({
      where: {
        id: user.id,
      },
      data: {
        money: user.money.toString(),
      },
    })
    .catch((reason: any) => {
      console.error(reason);
    })
    .finally(() => {
      console.log("user updated");
    });
}

export async function getAllUsers(): Promise<CustomUser[]> {
  return await prisma.user.findMany().then((users: any[]) => {
    return users.map(
      (user: { id: string; money: string | number | bigint | boolean }) => {
        return new CustomUser(user.id, BigInt(user.money));
      }
    );
  });
}
