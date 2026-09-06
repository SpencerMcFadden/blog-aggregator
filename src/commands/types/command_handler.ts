import { User } from "../../lib/db/schema";

export type CommandHandler = (cmdName: string, ...args: string[]) => Promise<void>;

export type UserCommandHandler = (cmdName: string, users: User, ...args: string[]) => Promise<void>;
