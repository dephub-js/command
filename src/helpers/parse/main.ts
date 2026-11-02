import { type Config, flattenChain } from '@/helpers/utils.js';
import { validateInput } from '@/helpers/validate/input.js';
import { validateConfig } from '@/helpers/validate/main.js';

import { parseCommands } from './command.js';
import { type CommandSchema, parseInput, type ParseInput } from './input.js';

export interface ParsedCommand extends ParseInput {
  chains: Config[];
  handled: boolean;
}

export function parser(rootConfig: Config, tokens: string[]): ParsedCommand {
  validateConfig(rootConfig);

  const { chains, remaining } = parseCommands(rootConfig, tokens);

  // Flatten the chain into a schema for the specific subcommand path
  const schema: CommandSchema = flattenChain(chains);

  // Parse using the resolved schema
  const result = parseInput(remaining, schema, chains);

  const isHelp = Boolean(result.options.help) && !rootConfig.hidden.help;
  const isVersion =
    Boolean(result.options.version) && !rootConfig.hidden.version;

  // Validate the input against the same schema
  if (!isHelp && !isVersion) {
    validateInput(schema, result);
  }

  return { ...result, chains, handled: isHelp || isVersion };
}
