import chalk from "chalk";
import pkg from "../../../../package.json";
import { logger } from "../../../utils";
import { Command } from "../Command";
import commands from "..";

const SPACER = "__spacer";
const ORDER: string[] = [
  "login",
  "logout",
  "whoami",
  SPACER,
  "init",
  "push",
  "pull",
  SPACER,
  "help",
  "version"
];

function getCommandHelp(
  { description, usage }: Command,
  usageMaxLength: number = 0
): string {
  return `  ${usage}  ${" ".repeat(
    Math.max(usageMaxLength - usage.length, 0)
  )}${description
    .split("\n")
    .join(`\n    ${" ".repeat(Math.max(usageMaxLength, 0))}`)}`;
}

function getCommandsHelp(): string {
  const commandsHelp = [];
  const usageMaxLength = Math.max(
    ...Object.keys(commands).map(key => commands[key].usage.length)
  );

  ORDER.forEach(key => {
    if (key === SPACER) {
      commandsHelp.push("");
    } else {
      commandsHelp.push(getCommandHelp(commands[key], usageMaxLength));
    }
  });
  commandsHelp.push("");
  for (const key in commands) {
    if (!ORDER.includes(key)) {
      commandsHelp.push(getCommandHelp(commands[key], usageMaxLength));
    }
  }

  if (commandsHelp[commandsHelp.length - 1] === "") {
    commandsHelp.pop();
  }

  return commandsHelp.join("\n");
}

export default {
  name: "Help",
  description: `Display help for ${pkg.name}`,
  usage: "help, --help, -h",
  run(): void {
    const header = `📚 Dico.app CLI\n${chalk.cyanBright(
      "Read the docs:"
    )} https://docs.dico.app`;
    const intro = "Dico.app command line tool";
    const version = `VERSION\n  ${pkg.name}@${pkg.version}`;
    const usage = `USAGE\n  $ dico [COMMAND] <OPTIONS>`;
    const commands = `COMMANDS\n${getCommandsHelp()}`;

    logger.log(`\n${[header, intro, version, usage, commands].join("\n\n")}\n`);
  }
} as Command;
