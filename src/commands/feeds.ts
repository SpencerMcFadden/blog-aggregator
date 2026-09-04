import { readConfig } from "../config";
import { createFeed } from "../lib/db/queries/feeds";
import { getUserByName } from "../lib/db/queries/users";
import { Feed, User } from "../lib/db/schema";

export async function handlerCreateFeed(cmdName: string, ...args: string[]) {
  if (args.length !== 2) {
    throw new Error(`usage: ${cmdName} <name> <url>`);
  }
  const feedName = args[0];
  const feedURL = args[1];
  const currentUsername = readConfig().currentUserName;
  const currentUser = await getUserByName(currentUsername);

  if (!currentUser) {
    throw new Error("Failed to determine current user");
  }

  const result = await createFeed(feedName, feedURL, currentUser.id);
  if (!result) {
    throw new Error(`Failed to create feed`);
  }

  console.log(`Created successfully:`);
  printFeed(result, currentUser);
}

function printFeed(feed: Feed, user: User) {
  console.log(`Feed:`);
  for (const [key, value] of Object.entries(feed)) {
    console.log(` - ${key}: ${value}`);
  }
  console.log(` - user: ${user.name}`);
}
