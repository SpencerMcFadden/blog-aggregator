import { CommandHandler } from "./command_handler";

export type CommandsRegistry = Record<string, CommandHandler>;
