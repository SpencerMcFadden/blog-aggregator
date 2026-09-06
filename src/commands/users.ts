import { readConfig, setUser } from "../config";
import { getUserByName, createUser, deleteAllUsers, getUsers } from "../lib/db/queries/users";

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

export async function handlerReset(cmdName: string, ...args: string[]) {
  await deleteAllUsers();
  console.log("all users deleted");
}

export async function handlerUsers(cmdName: string, ...args: string[]) {
  const users = await getUsers();
  const currentUser = readConfig().currentUserName;
  for (const user of users) {
    if (user.name === currentUser) {
      console.log(`* ${user.name} (current)`);
      continue;
    }
    console.log(`* ${user.name}`);
  }
}
