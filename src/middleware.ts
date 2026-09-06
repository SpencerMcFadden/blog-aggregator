import { readConfig } from "./config";
import { getUserByName } from "./lib/db/queries/users";
import { CommandHandler } from "./commands/types/command_handler";
import { UserCommandHandler } from "./commands/types/user_command_handler";

export function middlewareLoggedIn(handler: UserCommandHandler): CommandHandler {
  return async (cmdName: string, ...args: string[]): Promise<void> => {
    const config = readConfig();
    const user = await getUserByName(config.currentUserName);
    if (!user) {
      throw new Error(`User ${config.currentUserName} not found`);
    }
    await handler(cmdName, user, ...args);
  };
}
