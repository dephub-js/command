import { showHelp } from '@/helpers/help.js';
import { type ParsedCommand, parser } from '@/helpers/parse/main.js';
import { runner } from '@/helpers/runner.js';
import { $config, type Config } from '@/helpers/utils.js';

import type {
  CommandArgument,
  CommandHideKind,
  CommandOption,
} from './types.js';

import { CommandBuilder } from './builder.js';

/**
 * The main Command class for defining and executing CLI commands.
 * Extends CommandBuilder to provide additional methods for configuration and execution.
 * @template Options - An array of CommandOption definitions for the command.
 * @template Arguments - An array of CommandArgument definitions for the command.
 * @example
 * ```typescript
 * import { Command } from '@dephub/command';
 *
 * const cmd = new Command()
 *   .name('mycli')
 *   .description('A simple CLI tool example')
 *   .version('1.0.0')
 *   .argument('input', { description: 'Input file path' })
 *   .option('--output', { description: 'Output file path', shortFlag: '-o' })
 *   .handler(({ args, options }) => {
 *     console.log('Input file:', args.input);
 *     console.log('Output file:', options.output);
 *   });
 *
 * await cmd.run();
 * ```
 */
export class Command<
  Options extends CommandOption[] = [],
  Arguments extends CommandArgument[] = [],
> extends CommandBuilder<Options, Arguments, 'command'> {
  /**
   * Sets the description of the command.
   * @param description - The description to assign to the command.
   * @returns The Command instance for chaining.
   */
  description(description: string): this {
    this[$config]().description = description;
    return this;
  }

  /**
   * Displays the help information for the command if not hidden.
   */
  help() {
    if (!this[$config]().hidden.help) {
      showHelp([this[$config]()]);
    }
  }

  hide(kind: CommandHideKind): this {
    this[$config]().hidden[kind] = true;
    return this;
  }

  /**
   * Sets the name of the command.
   * @param name - The name to assign to the command.
   * @returns The Command instance for chaining.
   */
  name(name: string): this {
    this[$config]().name = name;
    return this;
  }

  /**
   * Parses the provided tokens (or default CLI arguments) into a typed CommandInput.
   * @param tokens - Optional array of tokens to run with; defaults to process.
   * @returns The parsed CommandInput with typed args, options, handled, chains, and unparsed tokens.
   */
  parse(tokens: string[] = process.argv.slice(2)): ParsedCommand {
    return parser(this[$config]() as Config, tokens);
  }

  /**
   * Runs the command with the provided tokens (or default CLI arguments).
   * Parses input, handles flags like --help/--version, executes handlers, and processes subcommands.
   * Automatically adds --help/-h and --version/-v options unless hidden.
   * @param tokens - Optional array of tokens to run with; defaults to process.
   * @returns A Promise that resolves when the command execution completes.
   */
  async run(tokens: string[] = process.argv.slice(2)): Promise<void> {
    // Auto-add --help / --version unless hidden
    if (!this[$config]().hidden.help) {
      this.option('--help', {
        description: `Show help`,
        kind: 'flag',
        shortFlag: '-h',
      });
    }

    if (!this[$config]().hidden.version) {
      this.option('--version', {
        description: `Show version`,
        kind: 'flag',
        shortFlag: '-v',
      });
    }
    await runner(this[$config](), tokens);
  }

  /**
   * Sets the version of the command.
   * @param version - The version string to assign.
   * @returns The Command instance for chaining.
   */
  version(version: string): this {
    this[$config]().version = version;
    return this;
  }
}
