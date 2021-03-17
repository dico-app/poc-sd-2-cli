import chalk from "chalk";
import exit from "exit";
import Listr from "listr";
import { logger } from "../../../utils";
import { Account } from "../../../utils/Account";
import { wait } from "../../../utils/wait";
import login from "../account/login";
import { Command } from "../Command";

const tasks = new Listr([
  {
    title: "Downloading dico config from Dico.app...",
    task: async (): Promise<void> => {
      await wait(1000);
    }
  },
  {
    title: "Updating dico.config.jsonc file...",
    task: async (): Promise<void> => {
      await wait(500);
    }
  }
]);

export default {
  name: "Pull",
  description: "Pull dico from Dico.app",
  usage: "pull",
  async run(): Promise<void> {
    try {
      if (await Account.isLoggedIn()) {
        await tasks.run();
        logger.log(`\n${chalk.bgGreen(" SUCCESS ")}\n`);
      } else {
        throw new Error(Account.Code.NotLoggedIn);
      }
    } catch (error) {
      switch (error.message) {
        case Account.Code.NotLoggedIn:
          logger.error(
            `${Account.Code.NotLoggedIn}, please log in first:\n\n  $ dico ${login.usage}`
          );
          exit(1);
          break;

        default:
          throw error;
      }
    }
  }
} as Command;
