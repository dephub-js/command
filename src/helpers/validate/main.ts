import type { Config } from '#/helpers/utils.ts';

import { validateArguments } from './argument.ts';
import { validateAliases, validateName } from './name.ts';
import { validateOptions } from './option.ts';
import { validateSteps } from './step.ts';
import { validateSubcommands } from './sub.ts';

export function validateConfig(config: Config): void {
  validateName(config.name);
  validateAliases(config.aliases);
  validateArguments(config.arguments);
  validateOptions(config.options);
  validateSubcommands(config.subcommands);
  validateSteps(config.steps);
}
