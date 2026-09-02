import { setUser } from "../config";
import { getUserByName } from "../lib/db/queries/users";

export async function handlerLogin(cmdName: string, ...args: string[]) {
  if (args.length !== 1) {
    throw new Error("username is required.");
  }

  const username = args[0];
  if (!(await getUserByName(username))) {
    throw new Error("user not found.");
  }

  setUser(username);
  console.log(`username has been set to ${username}`);
}
