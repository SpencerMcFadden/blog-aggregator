import { CommandsRegistry } from "./types/commands_registry";

export async function runCommand(registry: CommandsRegistry, cmdName: string, ...args: string[]) {
  const commandHandler = registry[cmdName];
  if (!commandHandler) {
    throw new Error(`command: ${cmdName} not found`);
  }

  await commandHandler(cmdName, ...args);
}
