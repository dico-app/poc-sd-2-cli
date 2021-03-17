import Listr, { ListrTaskWrapper } from "listr";
import { Account } from "../../../utils/Account";
import { Command } from "../Command";

const tasks = new Listr([
  {
    title: "Checking current user...",
    task: async (_: {}, task: ListrTaskWrapper): Promise<void> => {
      if (await Account.isLoggedIn()) {
        const account = Account.get();
        task.title = `Logged in as: ${account.username} <${account.email}>`;
      } else {
        task.title = Account.Code.NotLoggedIn;
      }
    }
  }
]);

export default {
  name: "Who Am I",
  description: "Know who you're logged in as to Dico.app",
  usage: "whoami",
  async run(): Promise<void> {
    try {
      await tasks.run();
    } catch (error) {
      switch (error.message) {
        default:
          throw error;
      }
    }
  }
} as Command;
