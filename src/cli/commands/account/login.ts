import exit from "exit";
import Listr, { ListrTaskWrapper } from "listr";
import { logger } from "../../../utils";
import { Account } from "../../../utils/Account";
import { Command } from "../Command";

interface LoginContext {
  token: string;
}

enum Code {
  NoTokenProvided = "No token provided"
}

const tasks = new Listr([
  {
    title: "Logging in...",
    task: async (ctx: LoginContext, task: ListrTaskWrapper): Promise<void> => {
      const account = await Account.login(ctx.token);
      task.title = `Logged in as: ${account.username} <${account.email}>`;
    }
  }
]);

export default {
  name: "Log In",
  description: "Log in to Dico.app",
  usage: "login <TOKEN>",
  async run(args: string[]): Promise<void> {
    try {
      const token = args[0];
      if (token) {
        await tasks.run({ token });
      } else {
        throw new Error(Code.NoTokenProvided);
      }
    } catch (error) {
      switch (error.message) {
        case Code.NoTokenProvided:
          logger.error(
            `${Code.NoTokenProvided}\n\nUSAGE:\n  $ dico ${this.usage}`
          );
          exit(1);
          break;

        default:
          throw error;
      }
    }
  }
} as Command;
