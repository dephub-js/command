import { CommandError } from '@/helpers/error.js';

export function validateChoices(
  variant: 'argument' | 'option',
  opt: {
    choices: string[];
    name: string;
    value: string | string[];
  },
) {
  const { choices, name, value } = opt;

  const valuesToCheck = Array.isArray(value) ? value : value ? [value] : [];

  for (const v of valuesToCheck) {
    if (!choices.includes(v)) {
      throw new CommandError(
        `Value "${v}" for ${variant} "${name}" must be one of: ${choices.join(
          ', ',
        )}`,
      );
    }
  }
}
