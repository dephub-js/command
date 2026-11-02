import { CommandError } from '@/helpers/error.js';
import {
  type Config,
  handlerVariadic,
  isFlag,
  isInlineOption,
  kebabToCamelCase,
} from '@/helpers/utils.js';

export interface ParsedOption {
  consumed: number;
  option: Record<string, boolean | string | string[]>;
}

export function parseOption(
  token: string,
  tokens: string[],
  options: Config['options'],
): ParsedOption {
  const flagName = kebabToCamelCase(token);

  const matchedOption = options.find(({ longFlag, shortFlag }) => {
    if (longFlag) {
      if (
        kebabToCamelCase(longFlag) === flagName ||
        flagName.includes(`${kebabToCamelCase(longFlag)}=`)
      ) {
        return true;
      }
    }

    if (shortFlag) {
      if (
        kebabToCamelCase(shortFlag) === flagName ||
        flagName.includes(`${kebabToCamelCase(shortFlag)}=`)
      ) {
        return true;
      }
    }

    return false;
  });

  if (!matchedOption) {
    throw new CommandError(`Unknown option: ${token}`);
  }

  let optionValue: boolean | null | string | string[] = null;
  let consumed = 0;
  const index = tokens.indexOf(token);

  switch (matchedOption.kind) {
    case 'flag': {
      if (isFlag(token)) {
        optionValue = true;
        consumed = 1;
      }
      break;
    }

    case 'inline': {
      if (isInlineOption(flagName)) {
        optionValue = flagName.split('=')[1];
        consumed = 1;
      }
      break;
    }

    case 'value': {
      if (isFlag(token)) {
        optionValue = tokens[index + 1];
        consumed = 2;
      }
      break;
    }
    case 'variadic': {
      if (isFlag(token)) {
        optionValue = handlerVariadic(tokens.slice(index + 1));
        consumed = optionValue.length + 1;
      }
      break;
    }
  }

  if (optionValue === null) {
    throw new CommandError(`Unexpected option: ${token}`);
  }

  return {
    consumed,
    option: { [kebabToCamelCase(matchedOption.longFlag)]: optionValue },
  };
}
