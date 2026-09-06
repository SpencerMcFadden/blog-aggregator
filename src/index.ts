import { handlerLogin, handlerRegister, handlerReset, handlerUsers } from "./commands/users.js";
import { registerCommand, runCommand } from "./commands/commands.js";
import { CommandsRegistry } from "./commands/types/commands_registry.js";
import { handleAgg } from "./commands/aggregate.js";
import { handlerAddFeed, handlerFeeds } from "./commands/feeds.js";
import { handlerFollow, handlerFollowing, handlerUnfollow } from "./commands/feed_follows.js";
import { middlewareLoggedIn } from "./middleware.js";

async function main() {
  const registry: CommandsRegistry = {};
  registerCommand(registry, "login", handlerLogin);
  registerCommand(registry, "register", handlerRegister);
  registerCommand(registry, "reset", handlerReset);
  registerCommand(registry, "users", handlerUsers);
  registerCommand(registry, "agg", handleAgg);
  registerCommand(registry, "addfeed", middlewareLoggedIn(handlerAddFeed));
  registerCommand(registry, "feeds", handlerFeeds);
  registerCommand(registry, "follow", middlewareLoggedIn(handlerFollow));
  registerCommand(registry, "following", middlewareLoggedIn(handlerFollowing));
  registerCommand(registry, "unfollow", middlewareLoggedIn(handlerUnfollow));

  const args = process.argv.slice(2);
  if (args.length < 1) {
    console.log("no arguments provided");
    process.exit(1);
  }

  const cmdName = args[0];
  const commands = args.slice(1);

  try {
    await runCommand(registry, cmdName, ...commands);
  } catch (e) {
    if (e instanceof Error) {
      console.error(`Error running command ${cmdName}: ${e}`);
    } else {
      console.error(`Error running command ${cmdName}`);
    }
    process.exit(1);
  }

  process.exit(0);
}

main();
