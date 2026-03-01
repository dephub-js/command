/* eslint-disable no-plusplus */
/* eslint-disable security/detect-possible-timing-attacks */
/* eslint-disable security/detect-object-injection */
/* eslint-disable no-nested-ternary */
import type {
  CommandArgument,
  CommandConfig,
  CommandOption,
} from '@/core/types.js';

import { CommandError } from '@/helpers/error.js';
import {
  type Config,
  isOption,
  isSubcommand,
  kebabToCamelCase,
} from '@/helpers/utils.js';
import { validateConfig } from '@/helpers/validate/index.js';

import { parseCommandArgument } from './argument.js';
import { parseCommandOption } from './option.js';

export const validateChoices = (
  variant: 'argument' | 'option',
  opt: {
    choices: string[];
    name: string;
    value: string | string[];
  },
) => {
  const { choices, name, value: val } = opt;

  const valuesToCheck = Array.isArray(val) ? val : val ? [val] : [];

  for (const value of valuesToCheck) {
    if (!choices.includes(value)) {
      throw new CommandError(
        `Value "${value}" for ${variant} "${name}" must be one of: ${choices.join(
          ', ',
        )}`,
      );
    }
  }
};

export interface ParseInput {
  args: Record<string, string | string[]>;
  options: Record<string, boolean | string | string[]>;
  unparsed: string[];
}

export const parseRuntime = <
  Options extends CommandOption[] = [],
  Arguments extends CommandArgument[] = [],
>(
  config: CommandConfig<Options, Arguments>,
  tokens: string[] = process.argv.slice(2),
): ParseInput => {
  const $config = config as Config;
  validateConfig($config);

  const input: ParseInput = {
    args: {},
    options: {},
    unparsed: [],
  };

  let argIndex = 0;
  let tokenIndex = 0;

  while (tokenIndex < tokens.length) {
    const token = tokens[tokenIndex];

    // '--' separator → stop parsing
    if (token === '--') {
      input.unparsed = tokens.slice(tokenIndex + 1);
      break;
    }

    // Options (flags, inline, values or variadic.)
    if (isOption(token)) {
      const { consumed, option } = parseCommandOption(
        token,
        tokens.slice(tokenIndex),
        $config,
      );
      Object.assign(input.options, option);

      // Exit early if --help | -h
      if (!config.hidden.version && ['--version', '-v'].includes(token)) {
        return input;
      }

      // Exit early if  --version | -v
      if (!config.hidden.help && ['--help', '-h'].includes(token)) {
        return input;
      }

      tokenIndex += consumed;
      continue;
    }

    // Subcommands (stop here and pass remainder)
    if (isSubcommand(token, $config.subcommands)) {
      input.unparsed = tokens.slice(tokenIndex);
      break;
    }

    // Positional arguments
    const { argument, consumed } = parseCommandArgument(
      tokens.slice(tokenIndex),
      $config,
      argIndex,
    );
    Object.assign(input.args, argument);
    tokenIndex += consumed;
    argIndex++;
  }

  // Validate choices, required options and apply defaults
  for (const option of config.options) {
    if (
      option.kind === 'inline' ||
      option.kind === 'variadic' ||
      option.kind === 'value'
    ) {
      const key = kebabToCamelCase(option.longFlag);
      const optionValue = input.options[key];

      if (!input.options[key] && !option.optional) {
        throw new CommandError(
          `Required option "${option.longFlag}" is missing`,
        );
      }

      if (option.default) {
        if (
          !input.options[key] ||
          (Array.isArray(input.options[key]) && input.options[key].length === 0)
        ) {
          input.options[key] = option.default;
        }
      }

      if (option.choices && typeof optionValue !== 'boolean') {
        validateChoices('option', {
          choices: option.choices,
          name: option.longFlag,
          value: optionValue,
        });
      }
    }
  }

  // Validate choices,required arguments and apply defaults
  for (const {
    choices,
    default: defaultValue,
    name,
    optional,
  } of config.arguments) {
    const key = kebabToCamelCase(name);
    const argValue = input.args[key];
    if (!argValue && !optional) {
      throw new CommandError(`Required argument "${name}" is missing`);
    }

    if (defaultValue) {
      if (!argValue || (Array.isArray(argValue) && argValue.length === 0)) {
        input.args[key] = defaultValue;
      }
    }

    if (choices) {
      validateChoices('argument', { choices, name, value: argValue });
    }
  }

  return input;
};
