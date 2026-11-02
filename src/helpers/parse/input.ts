/* eslint-disable no-console */
import { showHelp } from '@/helpers/help.js';
import { type Config, isOption } from '@/helpers/utils.js';

import { parseArgument } from './argument.js';
import { parseOption } from './option.js';

export type CommandSchema = Pick<
  Config,
  'arguments' | 'hidden' | 'options' | 'version'
>;

export interface ParseInput {
  args: Record<string, string | string[]>;
  options: Record<string, boolean | string | string[]>;
  unparsed: string[];
}

export function parseInput(
  tokens: string[],
  schema: CommandSchema,
  chains: Config[],
): ParseInput {
  const input: ParseInput = {
    args: {},
    options: {},
    unparsed: [],
  };

  let argIndex = 0;
  let tokenIndex = 0;

  while (tokenIndex < tokens.length) {
    const token = tokens[tokenIndex];

    // Handle '--' separator
    if (token === '--') {
      input.unparsed = tokens.slice(tokenIndex + 1);
      break;
    }

    // Handle Options
    if (isOption(token)) {
      const { consumed, option } = parseOption(
        token,
        tokens.slice(tokenIndex),
        schema.options,
      );

      Object.assign(input.options, option);

      // Exit early if  --version | -v
      if (!schema.hidden.version && ['--version', '-v'].includes(token)) {
        console.log(schema.version);
        break;
      }

      // Exit early if --help | -h
      if (!schema.hidden.help && ['--help', '-h'].includes(token)) {
        showHelp(chains);
        break;
      }

      tokenIndex += consumed;
      continue;
    }

    // Positional arguments
    const { argument, consumed } = parseArgument(
      tokens.slice(tokenIndex),
      schema.arguments,
      argIndex,
    );

    Object.assign(input.args, argument);
    tokenIndex += consumed;
    argIndex++;
  }

  return input;
}
