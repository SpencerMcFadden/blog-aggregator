import { scrapeFeeds } from "../lib/rss.js";

export async function handleAgg(cmdName: string, ...args: string[]) {
  if (args.length !== 1) {
    throw new Error(`usage: ${cmdName} <time_between_reqs>`);
  }

  const timeBetweenReqs = args[0];
  const parsedTime = parseDuration(timeBetweenReqs);
  if (!parsedTime) {
    throw new Error(`invalid duration: ${timeBetweenReqs} – use format Xh XXm XXs or XXXXms`);
  }

  console.log(`Collecting feeds every ${timeBetweenReqs}...`);

  scrapeFeeds().catch(handleError);

  const interval = setInterval(() => {
    scrapeFeeds().catch(handleError);
  }, parsedTime);

  await new Promise<void>((resolve) => {
    process.on("SIGINT", () => {
      console.log("Shutting down feed aggregator...");
      clearInterval(interval);
      resolve();
    });
  });
}

function parseDuration(durationStr: string) {
  const regex = /^(\d+)(ms|s|m|h)$/;
  const match = durationStr.match(regex);
  if (!match) {
    return;
  }
  if (match.length !== 3) {
    return;
  }
  const numDuration = parseInt(match[1], 10);
  switch (match[2]) {
    case "ms":
      return numDuration;
    case "s":
      return numDuration * 1000;
    case "m":
      return numDuration * 1000 * 60;
    case "h":
      return numDuration * 1000 * 60 * 60;
  }
}

function handleError(err: unknown) {
  console.error(`Error scraping feeds: ${err instanceof Error ? err.message : err}`);
}
