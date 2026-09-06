import { readConfig } from "../config";
import { createFeedFollow, getFeedFollowsForUser } from "../lib/db/queries/feed_follows";
import { getFeedByURL } from "../lib/db/queries/feeds";
import { getUserByName } from "../lib/db/queries/users";

export async function handlerFollow(cmdName: string, ...args: string[]) {
  if (args.length !== 1) {
    throw new Error(`usage: ${cmdName} <name>`);
  }

  const userName = readConfig().currentUserName;
  const user = await getUserByName(userName);
  if (!user) {
    throw new Error(`User ${userName} not found`);
  }

  const url = args[0];
  const feed = await getFeedByURL(url);
  if (!feed) {
    throw new Error(`Feed not found with url: ${url}`);
  }

  const createdFollow = await createFeedFollow(user.id, feed.id);

  console.log(`${createdFollow.userName} followed ${createdFollow.feedName}`);
}

export async function handlerFollowing(cmdName: string, ...args: string[]) {
  const currentUser = readConfig().currentUserName;
  const user = await getUserByName(currentUser);

  if (!user) {
    throw new Error(`User ${currentUser} not found`);
  }

  const feeds = await getFeedFollowsForUser(user.id);
  if (feeds.length === 0) {
    console.log(`No feed follows found for this user`);
    return;
  }

  console.log(`Feed follows for user ${user.id}`);
  for (const feed of feeds) {
    console.log(`* ${feed.feedName}`);
  }
}
