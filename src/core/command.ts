/* eslint-disable security/detect-object-injection */
import { showHelp } from '@/helpers/help.js';
import { parseRuntime } from '@/helpers/parse/index.js';
import { runner } from '@/helpers/runner.js';
import { $config } from '@/helpers/utils.js';

import type {
  CommandArgument,
  CommandHideKind,
  CommandInput,
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
 * import { Command } from '@dep/command';
 *
 * const cmd = new Command()
 *   .name('mycli')
 *   .description('A simple CLI tool example')
 *   .version('1.0.0')
 *   .argument('input', { description: 'Input file path' })
 *   .option('--output', { kind: 'value', description: 'Output file path', shortFlag: '-o' })
 *   .handler(({ args, options }) => {
 *     console.log('Input file:', args.input);
 *     console.log('Output file:', options.output);
 *   });
 *
 * cmd.run();
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
      showHelp(this[$config]());
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
   * @param tokens - Optional array of tokens to parse; defaults to process.argv.slice(2).
   * @returns The parsed CommandInput with typed args, options, and unparsed tokens.
   */
  parse(tokens?: string[]): CommandInput<Options, Arguments> {
    return parseRuntime(this[$config](), tokens ?? []) as CommandInput<
      Options,
      Arguments
    >;
  }

  /**
   * Runs the command with the provided tokens (or default CLI arguments).
   * Parses input, handles flags like --help/--version, executes handlers, and processes subcommands.
   * Automatically adds --help/-h and --version/-v options unless hidden.
   * @param tokens - Optional array of tokens to run with; defaults to process.argv.slice(2).
   * @returns A Promise that resolves when the command execution completes.
   */
  async run(tokens?: string[]): Promise<void> {
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
