import { eq, sql } from "drizzle-orm";
import { db } from "..";
import { feeds } from "../schema";

export async function createFeed(name: string, url: string, userId: any) {
  const [result] = await db
    .insert(feeds)
    .values({ name: name, url: url, userId: userId })
    .returning();
  return result;
}

export async function getFeeds() {
  const result = await db.select().from(feeds);
  return result;
}

export async function getFeedByURL(url: string) {
  const [result] = await db.select().from(feeds).where(eq(feeds.url, url));
  return result;
}

export async function getNextFeedToFetch() {
  const [result] = await db
    .select()
    .from(feeds)
    .orderBy(sql`${feeds.lastFetchedAt} nulls first`);
  return result;
}

export async function markFeedFetched(feedId: string) {
  const now = new Date();
  const [result] = await db
    .update(feeds)
    .set({ updatedAt: now, lastFetchedAt: now })
    .where(eq(feeds.id, feedId))
    .returning();
  return result;
}
