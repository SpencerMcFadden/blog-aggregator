import { XMLParser } from "fast-xml-parser";
import { getNextFeedToFetch, markFeedFetched } from "./db/queries/feeds";

export async function fetchFeed(feedURL: string) {
  const response = await fetch(feedURL, {
    headers: {
      "User-Agent": "gator",
    },
  });
  if (!response.ok) {
    throw new Error(`Response status: ${response.status}`);
  }
  const feedData = await response.text();

  const parser = new XMLParser({
    processEntities: false,
  });
  const feedObj = parser.parse(feedData);
  const channel = feedObj.rss?.channel;
  if (!channel) {
    throw new Error("No channel field found");
  }

  if (!channel.title || !channel.link || !channel.description) {
    throw new Error(
      `Missing fields: title ${channel.title}, link ${channel.link}, description ${channel.description}`,
    );
  }

  const items = Array.isArray(channel.item)
    ? channel.item
    : channel.item instanceof Object
      ? [channel.item]
      : [];

  const validatedItems: RSSItem[] = [];
  for (const item of items) {
    if (!item.title || !item.link || !item.description || !item.pubDate) {
      continue;
    }
    validatedItems.push({
      title: item.title,
      link: item.link,
      description: item.description,
      pubDate: item.pubDate,
    });
  }

  const finalFeed: RSSFeed = {
    channel: {
      title: channel.title,
      link: channel.link,
      description: channel.description,
      item: validatedItems,
    },
  };
  return finalFeed;
}

export async function scrapeFeeds() {
  const nextFeed = await getNextFeedToFetch();
  if (!nextFeed) {
    console.log(`Could not determine next feed to fetch`);
    return;
  }
  const fetchedFeed = await fetchFeed(nextFeed.url);
  const markSuccess = await markFeedFetched(nextFeed.id);
  if (!markSuccess) {
    throw new Error(`Failed to mark feed: ${nextFeed.id}`);
  }

  for (const item of fetchedFeed.channel.item) {
    console.log(` * ${item.title}`);
  }

  console.log(
    `Feed ${nextFeed.name} found with ${fetchedFeed.channel.item.length} titles returned.`,
  );
}

type RSSFeed = {
  channel: {
    title: string;
    link: string;
    description: string;
    item: RSSItem[];
  };
};

type RSSItem = {
  title: string;
  link: string;
  description: string;
  pubDate: string;
};
