/* eslint-disable no-await-in-loop */
// Handlers are middleware; execution order matters.
import type {
  CommandArgument,
  CommandArgumentKind,
  CommandConfig,
  CommandInput,
  CommandOption,
} from '@/core/types.js';

import type { Config } from './utils.ts';

import { execution } from './execution.js';
import { parser } from './parse/main.js';

export async function runner<
  Options extends CommandOption[] = [],
  Arguments extends CommandArgument[] = [],
>(config: CommandConfig<Options, Arguments>, tokens: string[]): Promise<void> {
  const { chains, handled, ...parsed } = parser(config as Config, tokens);
  if (handled) return;

  for (const { steps } of chains) {
    for (const step of steps) {
      if (step.kind === 'execution') {
        await execution(step.execution);
        continue;
      }

      await step.handler(
        parsed as CommandInput<
          CommandOption[],
          CommandArgument<string, CommandArgumentKind, boolean>[]
        >,
        config as CommandConfig<
          CommandOption[],
          CommandArgument<string, CommandArgumentKind, boolean>[]
        >,
      );
    }
  }
}
