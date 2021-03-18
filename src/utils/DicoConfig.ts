import fs from "fs";
import path from "path";
import JSONC from "comment-json";

interface DicoConfigOptions {}

enum Code {
  DicoAlreadyExists = "dico.config.jsonc already exists",
  DicoNotFound = "dico.config.jsonc not found"
}

export class DicoConfig {
  static Code = Code;
  static JSONCFILE: string = "dico.config.jsonc";

  static get path(): string {
    return path.join(process.cwd(), DicoConfig.JSONCFILE);
  }

  /**
   * Read config file
   */
  static read(): DicoConfigOptions {
    return JSONC.parse(fs.readFileSync(DicoConfig.path, { encoding: "utf8" }));
  }

  /**
   * Write raw config file
   */
  static writeRaw(configString: string): void {
    return fs.writeFileSync(DicoConfig.path, configString, "utf8");
  }

  /**
   * Write config file
   */
  static write(config: DicoConfigOptions): void {
    return fs.writeFileSync(
      DicoConfig.path,
      JSONC.stringify(config, null, 2),
      "utf8"
    );
  }

  /**
   * Check if config exists
   */
  static exists(): boolean {
    return fs.existsSync(DicoConfig.path);
  }
}
