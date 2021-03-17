import chalk from "chalk";
import exit from "exit";
import inquirer from "inquirer";
import { logger } from "../../../utils";
import { Account } from "../../../utils/Account";
import { DicoConfig } from "../../../utils/DicoConfig";
import { wait } from "../../../utils/wait";
import login from "../account/login";
import { Command } from "../Command";

export default {
  name: "Init",
  description: "Init a dico inside your project",
  usage: "init",
  async run(): Promise<void> {
    try {
      if (!(await Account.isLoggedIn())) {
        throw new Error(Account.Code.NotLoggedIn);
      } else if (DicoConfig.exists()) {
        throw new Error(DicoConfig.Code.DicoAlreadyExists);
      }
    } catch (error) {
      switch (error.message) {
        case Account.Code.NotLoggedIn:
          logger.error(
            `${Account.Code.NotLoggedIn}, please log in first:\n\n  $ dico ${login.usage}`
          );
          exit(1);
          break;

        case DicoConfig.Code.DicoAlreadyExists:
          logger.error(
            `${DicoConfig.Code.DicoAlreadyExists} in:\n\n  ${process.cwd()}`
          );
          exit(1);
          break;

        default:
          throw error;
      }
    }

    await wait(250);

    interface Dico {
      name: string;
      empty: boolean;
    }
    const dicos: Dico[] = [
      {
        name: "typeful",
        empty: true
      }
    ];

    interface Answers {
      dico: Dico;
      initDefault?: boolean;
    }
    const answers = await inquirer.prompt<Answers>([
      {
        type: "list",
        name: "dico",
        message: `Pick the dico to connect to: (${dicos.length} found)`,
        choices: dicos.map(i => ({ name: i.name, value: i })),
        loop: false,
        pageSize: 12
      },
      {
        type: "confirm",
        name: "initDefault",
        message:
          "It looks like that this dico is empty.\n  Would you like to init it with some default values?",
        default: true,
        when: ({ dico }: Answers) => dico.empty
      }
    ]);

    if (answers.initDefault) {
      DicoConfig.writeRaw(`{
  // Declare simple <key, value> collection
  "label": {
    "validate": "string",
    "cancel": "string"
  },
  // Organize collections inside folders
  "message": {
    "error": {
      "networkError": "string",
      "invalidInput": "string"
    },
    "success": {
      "formSubmitted": "string"
    }
  },
  // Leverage different key types
  "misc": {
    "usernameMinLength": "number",
    "logo": "svg",
    "contactMail": "email"
  }
}
`);
    } else {
      DicoConfig.writeRaw(`{}
`);
    }

    logger.log(
      `\n${chalk.bgGreen(" SUCCESS ")}\n\n  ${
        DicoConfig.JSONCFILE
      } created at: ${process.cwd()}\n`
    );
  }
} as Command;
