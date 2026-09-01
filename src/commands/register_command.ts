import { CommandHandler } from "./types/command_handler";
import { CommandsRegistry } from "./types/commands_registry";

export function registerCommand(
  registry: CommandsRegistry,
  cmdName: string,
  handler: CommandHandler,
) {
  registry[cmdName] = handler;
}
