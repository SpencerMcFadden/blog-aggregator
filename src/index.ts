import { handlerLogin } from "./commands/handler_login.js";
import { registerCommand } from "./commands/register_command.js";
import { runCommand } from "./commands/run_command.js";
import { CommandsRegistry } from "./commands/types/commands_registry.js";

function main() {
  const registry: CommandsRegistry = {};
  registerCommand(registry, "login", handlerLogin);

  const args = process.argv.slice(2);
  if (args.length < 1) {
    console.log("no arguments provided");
    process.exit(1);
  }

  const cmdName = args[0];
  const commands = args.slice(1);

  try {
    runCommand(registry, cmdName, ...commands);
  } catch (e) {
    console.log((e as Error).message);
    process.exit(1);
  }
}

main();
