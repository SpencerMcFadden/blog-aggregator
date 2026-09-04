import { handlerDeleteAll, handlerLogin, handlerRegister, handlerUsers } from "./commands/users.js";
import { registerCommand, runCommand } from "./commands/commands.js";
import { CommandsRegistry } from "./commands/types/commands_registry.js";
import { handleAgg } from "./commands/aggregate.js";
import { handlerCreateFeed } from "./commands/feeds.js";

async function main() {
  const registry: CommandsRegistry = {};
  registerCommand(registry, "login", handlerLogin);
  registerCommand(registry, "register", handlerRegister);
  registerCommand(registry, "reset", handlerDeleteAll);
  registerCommand(registry, "users", handlerUsers);
  registerCommand(registry, "agg", handleAgg);
  registerCommand(registry, "addfeed", handlerCreateFeed);

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
