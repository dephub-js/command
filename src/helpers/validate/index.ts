import type { Config } from '@/helpers/utils.js';

import { validateArguments } from './argument.js';
import { validateAliases, validateName } from './name.js';
import { validateOptions } from './option.js';
import { validateSubcommands } from './sub.js';

export const validateConfig = (config: Config): void => {
  validateName(config.name);
  validateAliases(config.aliases);
  validateArguments(config.arguments);
  validateOptions(config.options);
  validateSubcommands(config.subcommands);
};
