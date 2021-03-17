import { DicoRC } from "./DicoRC";
import { wait } from "./wait";

export interface AccountOptions {
  token: string;
  username: string;
  email: string;
}

const users: { [key: string]: AccountOptions } = {
  "96d9632f363564cc3032521409cf22a852f2032eec099ed5967c0d000cec607a": {
    token: "96d9632f363564cc3032521409cf22a852f2032eec099ed5967c0d000cec607a",
    username: "john",
    email: "john@example.com"
  },
  "2bd806c97f0e00af1a1fc3328fa763a9269723c8db8fac4f93af71db186d6e90": {
    token: "2bd806c97f0e00af1a1fc3328fa763a9269723c8db8fac4f93af71db186d6e90",
    username: "alice",
    email: "alice@example.com"
  },
  "81b637d8fcd2c6da6359e6963113a1170de795e4b725b84d1e0b4cfd9ec58ce9": {
    token: "81b637d8fcd2c6da6359e6963113a1170de795e4b725b84d1e0b4cfd9ec58ce9",
    username: "bob",
    email: "bob@example.com"
  }
};
enum Code {
  InvalidUserAccessToken = "Invalid user access token",
  NotLoggedIn = "Not logged in",
  AlreadyLoggedOut = "Already logged out"
}

export class Account {
  static Code = Code;

  static async login(userAccessToken: string): Promise<AccountOptions> {
    await wait(500);

    const maybeUser = users[userAccessToken];

    if (maybeUser) {
      DicoRC.update({ account: maybeUser });
      return maybeUser;
    } else {
      throw new Error(Code.InvalidUserAccessToken);
    }
  }

  static async logout(): Promise<void> {
    await wait(500);

    const config = DicoRC.read();

    if (!config.account) {
      throw new Error(Code.AlreadyLoggedOut);
    } else {
      delete config.account;
      DicoRC.write(config);
    }
  }

  static get(): AccountOptions {
    const { account } = DicoRC.read();

    if (account) {
      return account;
    } else {
      throw new Error(Code.NotLoggedIn);
    }
  }

  static async isLoggedIn(): Promise<boolean> {
    await wait(250);

    const { account } = DicoRC.read();

    return !!(account && users[account.token]);
  }
}
