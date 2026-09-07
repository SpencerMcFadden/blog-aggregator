import { eq, getTableColumns, sql } from "drizzle-orm";
import { db } from "..";
import { feedFollows, posts } from "../schema";

export async function createPost(
  title: string,
  url: string,
  feedId: string,
  description: string | null,
  publishedAt: Date | null,
) {
  const [result] = await db
    .insert(posts)
    .values({
      title: title,
      url: url,
      feedId: feedId,
      description: description,
      publishedAt: publishedAt,
    })
    .returning();
  return result;
}

export async function getPostsForUser(userId: string, numPosts: number) {
  const result = await db
    .select({
      ...getTableColumns(posts),
    })
    .from(posts)
    .innerJoin(feedFollows, eq(posts.feedId, feedFollows.feedId))
    .where(eq(feedFollows.userId, userId))
    .orderBy(sql`${posts.publishedAt} desc nulls last`)
    .limit(numPosts);
  return result;
}
