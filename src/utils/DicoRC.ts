import * as rc from "rc9";
import { AccountOptions } from "./Account";

export interface DicoRCOptions {
  account?: AccountOptions;
}

export class DicoRC {
  static RCFILE: string = ".dicorc";

  /**
   * Read config file
   */
  static read(): DicoRCOptions {
    return rc.readUser(DicoRC.RCFILE);
  }

  /**
   * Write config file
   */
  static write(config: DicoRCOptions): void {
    rc.writeUser(config, DicoRC.RCFILE);
  }

  /**
   * Update config file
   */
  static update(config: DicoRCOptions): void {
    rc.updateUser(config, DicoRC.RCFILE);
  }
}
