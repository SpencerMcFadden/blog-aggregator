import { setUser } from "../config";
import { createUser, getUserByName } from "../lib/db/queries/users";

export async function handlerRegister(cmdName: string, ...args: string[]) {
  if (args.length !== 1) {
    throw new Error(`usage: ${cmdName} <name>`);
  }
  const userName = args[0];

  if (await getUserByName(userName)) {
    throw new Error("a user with this name already exists");
  }

  await createUser(userName);

  setUser(userName);
  console.log(`user ${userName} created`);
}
