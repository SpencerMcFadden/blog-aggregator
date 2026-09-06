import { User } from "../../lib/db/schema";

export type UserCommandHandler = (cmdName: string, user: User, ...args: string[]) => Promise<void>;
