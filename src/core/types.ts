import type { CommandBuilder } from './builder.js';

/**
 * Represents the structure of a command argument.
 * @template N - The name of the argument.
 * @template K - The kind of the argument (from CommandArgumentKind).
 * @template O - Indicates if the argument is optional (true) or required (false).
 */
export interface CommandArgument<
  N extends string = string,
  K extends CommandArgumentKind = CommandArgumentKind,
  O extends boolean = boolean,
> {
  /** Allowed choices for the argument value. If set, input must match one of these. */
  choices?: string[];
  /** Default value for the argument. For 'variadic', it's an array; otherwise, a string. */
  default?: K extends 'variadic' ? string[] : string;
  /** A description of the argument for help output. */
  description?: string;
  /** The kind of the argument, determining if it's single or variadic. */
  kind: K;
  /** The name of the argument (used in help and parsing). Required. */
  name: N;
  /** Whether the argument is optional (true) or required (false). */
  optional: O;
}

/**
 * Defines the possible kinds for command arguments.
 * - 'value': A single positional argument value.
 * - 'variadic': Multiple positional argument values (e.g., ...args).
 */
export type CommandArgumentKind = 'value' | 'variadic';

/**
 * Represents the full configuration for a command or subcommand.
 * @template Options - An array of CommandOption definitions.
 * @template Arguments - An array of CommandArgument definitions.
 */
export interface CommandConfig<
  Options extends CommandOption[] = CommandOption[],
  Arguments extends CommandArgument[] = CommandArgument[],
> {
  /** Aliases for the command name. */
  aliases: string[];
  /** Defined positional arguments for the command. */
  arguments: Arguments;
  /** A description of the command for help output. */
  description: string;
  /** Handler functions to execute when the command is run. */
  handlers: CommandHandler<Options, Arguments>[];
  /** Flags to hide certain built-in features like help or version. */
  hidden: Record<CommandHideKind, boolean>;
  /** The name of the command. */
  name: string;
  /** Defined options for the command. */
  options: Options;
  /** Subcommands under this command. */
  subcommands: CommandBuilder<Options, Arguments>[];
  /** The version of the command. */
  version: string;
}

/**
 * Type for a command handler function, which receives parsed input and config.
 * @template Options - An array of CommandOption definitions.
 * @template Arguments - An array of CommandArgument definitions.
 */
export type CommandHandler<
  Options extends CommandOption[] = CommandOption[],
  Arguments extends CommandArgument[] = CommandArgument[],
> = (
  /** The parsed CLI input. */
  input: CommandInput<Options, Arguments>,
  /** The full command configuration. */
  config: CommandConfig<Options, Arguments>,
) => Promise<void> | void;

/**
 * Defines the kinds of features that can be hidden in the command.
 * - 'help': Hides the help functionality.
 * - 'version': Hides the version functionality.
 */
export type CommandHideKind = 'help' | 'version';

/**
 * Represents the parsed input from the CLI, with typed arguments and options.
 * @template Options - An array of CommandOption definitions for type-safe options.
 * @template Arguments - An array of CommandArgument definitions for type-safe arguments.
 */
export type CommandInput<
  Options extends CommandOption[] = CommandOption[],
  Arguments extends CommandArgument[] = CommandArgument[],
> = {
  /** Parsed positional arguments, mapped to camelCase keys from their names. */
  args: {
    [K in Arguments[number]['name'] as KebabToCamelCase<K>]: Extract<
      Arguments[number],
      { name: K }
    > extends { kind: 'variadic' }
      ? string[]
      : Extract<Arguments[number], { name: K }>['optional'] extends true
        ? string | undefined
        : string;
  };
  /** Parsed options, mapped to camelCase keys from their longFlags. */
  options: {
    [K in Options[number]['longFlag'] as KebabToCamelCase<K>]: Extract<
      Options[number],
      { longFlag: K }
    > extends { kind: 'flag' }
      ? boolean
      : Extract<Options[number], { longFlag: K }> extends {
            kind: 'variadic';
          }
        ? string[]
        : Extract<Options[number], { longFlag: K }>['optional'] extends true
          ? string | undefined
          : string;
  };
  /** Any remaining unparsed tokens after parsing arguments and options. */
  unparsed: string[];
};

/**
 * Represents the structure of a command option.
 * @template L - The long flag name (e.g., '--output').
 * @template K - The kind of the option (from CommandOptionKind).
 * @template O - Indicates if the option is optional (true) or required (false).
 */
export type CommandOption<
  L extends string = string,
  K extends CommandOptionKind = CommandOptionKind,
  O extends boolean = boolean,
> = {
  /** Allowed choices for the option value. If set, input must match one of these. */
  choices?: string[];
  /** Default value for the option. For 'variadic', it's an array; otherwise, a string. */
  default?: K extends 'variadic' ? string[] : string;
  /** A description of the option for help output. */
  description?: string;
  /** The kind of the option, determining how it parses input. */
  kind: K;
  /** The long flag for the option (e.g., '--output'). Required. */
  longFlag: L;
  /** Whether the option is optional (true) or required (false). */
  optional: O;
  /** Optional short flag for the option (e.g., '-o'). */
  shortFlag?: string;
};

/**
 * Defines the possible kinds for command options.
 * - 'flag': A boolean flag (e.g., --verbose).
 * - 'value': An option that takes a single value (e.g., --output file.txt).
 * - 'inline': An option with an inline value (e.g., --output=file.txt).
 * - 'variadic': An option that takes multiple values (e.g., --include file1 file2).
 */
export type CommandOptionKind = 'flag' | 'inline' | 'value' | 'variadic';

/**
 * Utility type to convert a kebab-case string (e.g., '--my-flag' or 'my-flag') to camelCase (e.g., 'myFlag').
 * Strips leading '--' if present and capitalizes after each '-'.
 * @template S - The input string in kebab-case.
 */
export type KebabToCamelCase<S extends string> = S extends `--${infer Rest}`
  ? KebabToCamelCase<Rest>
  : S extends `${infer First}-${infer Rest}`
    ? `${First}${Capitalize<KebabToCamelCase<Rest>>}`
    : S;
