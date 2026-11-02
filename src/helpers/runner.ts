import type {
  CommandArgument,
  CommandArgumentKind,
  CommandConfig,
  CommandInput,
  CommandOption,
} from '@/core/types.js';

import type { Config } from './utils.ts';

import { parser } from './parse/main.js';

export async function runner<
  Options extends CommandOption[] = [],
  Arguments extends CommandArgument[] = [],
>(config: CommandConfig<Options, Arguments>, tokens: string[]) {
  const { chains, handled, ...parsed } = parser(config as Config, tokens);
  if (handled) return;

  for (const { handlers } of chains) {
    for (const handler of handlers) {
      // Handlers are middleware; execution order matters.
      // eslint-disable-next-line no-await-in-loop
      await handler(
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
