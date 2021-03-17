import exit from "exit";
import Listr, { ListrTaskWrapper } from "listr";
import { Account } from "../../../utils/Account";
import { Command } from "../Command";

const tasks = new Listr([
  {
    title: "Logging out...",
    task: async (_: {}, task: ListrTaskWrapper): Promise<void> => {
      await Account.logout();
      task.title = "Logged out";
    }
  }
]);

export default {
  name: "Log Out",
  description: "Log out of Dico.app",
  usage: "logout",
  async run(): Promise<void> {
    try {
      await tasks.run();
    } catch (error) {
      switch (error.message) {
        case Account.Code.AlreadyLoggedOut:
          exit(1);
          break;

        default:
          throw error;
      }
    }
  }
} as Command;
