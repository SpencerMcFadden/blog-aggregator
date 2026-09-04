import { fetchFeed } from "../lib/rss.js";

export async function handleAgg(_: string) {
  const feedURL = "";

  const response = await fetchFeed(feedURL);
  const responseStr = JSON.stringify(response, null, 2);
  console.log(responseStr);
}
