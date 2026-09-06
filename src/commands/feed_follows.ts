import {
  createFeedFollow,
  deleteFeedFollow,
  getFeedFollowsForUser,
} from "../lib/db/queries/feed_follows";
import { getFeedByURL } from "../lib/db/queries/feeds";
import { User } from "../lib/db/schema";

export async function handlerFollow(cmdName: string, user: User, ...args: string[]) {
  if (args.length !== 1) {
    throw new Error(`usage: ${cmdName} <name>`);
  }

  const url = args[0];
  const feed = await getFeedByURL(url);
  if (!feed) {
    throw new Error(`Feed not found with url: ${url}`);
  }

  const createdFollow = await createFeedFollow(user.id, feed.id);

  console.log(`${createdFollow.userName} followed ${createdFollow.feedName}`);
}

export async function handlerFollowing(cmdName: string, user: User, ...args: string[]) {
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

export async function handlerUnfollow(cmdName: string, user: User, ...args: string[]) {
  if (args.length !== 1) {
    throw new Error(`usage: ${cmdName} <url>`);
  }
  const url = args[0];
  const feed = await getFeedByURL(url);
  if (!feed) {
    throw new Error(`Feed not found for: ${url}`);
  }

  const result = await deleteFeedFollow(user.id, feed.id);
  if (!result) {
    throw new Error(`Failed to unfollow feed: ${url}`);
  }

  console.log(`Unfollowed ${feed.name} successfully`);
}
