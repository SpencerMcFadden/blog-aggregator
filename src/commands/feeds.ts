import { readConfig } from "../config";
import { createFeedFollow } from "../lib/db/queries/feed_follows";
import { createFeed, getFeeds } from "../lib/db/queries/feeds";
import { getUserById, getUserByName } from "../lib/db/queries/users";
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
  const follow = await createFeedFollow(currentUser.id, result.id);

  console.log(`Created successfully:`);
  printFeed(result, currentUser);
  console.log(`${currentUser} followed ${follow.feedName}`);
}

export async function handlerFeeds(_: string) {
  const result = await getFeeds();
  if (result.length === 0) {
    console.log(`No feeds found`);
    return;
  }
  for (const feed of result) {
    const user = await getUserById(feed.userId);
    if (!user) {
      throw new Error(`User not found for feed ${feed.id}`);
    }
    printFeed(feed, user);
    console.log();
  }
}

function printFeed(feed: Feed, user: User) {
  console.log(`Feed:`);
  for (const [key, value] of Object.entries(feed)) {
    console.log(` - ${key}: ${value}`);
  }
  console.log(` - user: ${user.name}`);
}
