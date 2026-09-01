import { setUser } from "../config";

export function handlerLogin(cmdName: string, ...args: string[]) {
  if (args.length !== 1) {
    throw new Error("username is required.");
  }

  const username = args[0];
  setUser(username);
  console.log(`username has been set to ${username}`);
}
