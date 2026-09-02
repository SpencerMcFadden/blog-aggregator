import { handlerLogin } from "./commands/handler_login.js";
import { handlerRegister } from "./commands/handler_register.js";
import { registerCommand } from "./commands/register_command.js";
import { runCommand } from "./commands/run_command.js";
import { CommandsRegistry } from "./commands/types/commands_registry.js";

async function main() {
  const registry: CommandsRegistry = {};
  registerCommand(registry, "login", handlerLogin);
  registerCommand(registry, "register", handlerRegister);

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
