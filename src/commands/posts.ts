import { getPostsForUser } from "../lib/db/queries/posts";
import { Post, User } from "../lib/db/schema";

export async function handlerBrowse(cmdName: string, user: User, ...args: string[]) {
  let limit = 2;
  if (args[0]) {
    limit = parseInt(args[0]);
  }
  const posts = await getPostsForUser(user.id, limit);
  if (posts.length === 0) {
    console.log(`No posts found for this user`);
    return;
  }

  console.log(`Posts for user ${user.id}`);
  for (const post of posts) {
    printPost(post);
  }
}

function printPost(post: Post) {
  console.log("======================================");
  console.log(`=====${post.title}=====`);
  console.log(`${post.description}`);
  console.log(`read here: ${post.url}`);
  console.log(`published: ${post.publishedAt?.toLocaleString()}`);
  console.log("======================================");
  console.log();
}
