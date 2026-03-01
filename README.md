# @dephub/command 🛠️

> A type-safe CLI command builder for Node.js, enabling easy creation of commands with arguments, options, subcommands, and handlers.

[![NPM version](https://img.shields.io/npm/v/@dephub/command.svg?style=flat)](https://npmjs.org/package/@dephub/command)
[![ESM-only](https://img.shields.io/badge/ESM-only-brightgreen?style=flat)](https://nodejs.org/)

## Features ✨

- 🔒 Type-safe definitions for arguments and options
- 📚 Support for nested subcommands and aliases
- ⚙️ Automatic handling of --help and --version flags
- ✅ Built-in validation for configurations and inputs
- 🔄 Variadic arguments and options for flexible parsing
- 📦 Seamless integration with Node.js environments

---

## Installation 📦

- npm: `npm install @dephub/command`
- pnpm: `pnpm add @dephub/command`
- yarn: `yarn add @dephub/command`
- bun: `bun add @dephub/command`

---

## Usage 🎯

### CLI 💻 <!-- if available -->

This package is a library for building CLI tools. Once you've defined your command, you can run it from the command line using Node.js. For example, save the script below as `mycli.ts` and execute it with `node mycli.js [args]`.

Example command execution:

```bash
node run mycli.ts input.txt --output output.txt
```

### API 🧩

Use the `Command` class to build and configure your CLI. Here's a basic example:

```typescript
import { Command } from '@dephub/command';

const cmd = new Command()
  .name('mycli')
  .description('A simple CLI tool example')
  .version('1.0.0')
  .argument('input', { description: 'Input file path' })
  .option('--output', {
    kind: 'value',
    description: 'Output file path',
    shortFlag: '-o',
  })
  .handler(({ args, options }) => {
    console.log('Input file:', args.input);
    console.log('Output file:', options.output);
  });

try {
  await clit.run(); // (defaults tokens `process.argv.slice(2)`)
} catch (err) {
  if (err instanceof CommandError) {
    console.error(`\nError: ${err.message}\n`);
    cmd.help();
    process.exit(1);
  }
  throw err;
}
```

For more advanced usage, including subcommands:

```typescript
import { Command } from '@dephub/command';

const cmd = new Command()
  .name('mycli')
  .description('CLI with subcommands')
  .command('sub', 'Subcommand description')
  .argument('arg', 'Subcommand argument')
  .handler(({ args }) => {
    console.log('Subcommand arg:', args.arg);
  });

try {
  await clit.run(); // (defaults tokens `process.argv.slice(2)`)
} catch (err) {
  if (err instanceof CommandError) {
    console.error(`\nError: ${err.message}\n`);
    cmd.help();
    process.exit(1);
  }
  throw err;
}
```

Run with `mycli sub value` to execute the subcommand.

---

## License 📄

MIT License – see [LICENSE](LICENSE) for details.

**Author:** Estarlin R ([estarlincito.com](https://estarlincito.com))
