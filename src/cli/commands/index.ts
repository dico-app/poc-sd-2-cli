import { Command } from "./Command";

import misc from "./misc";
import account from "./account";
import dico from "./dico";

export default {
  ...misc,
  ...account,
  ...dico
} as { [key: string]: Command };
