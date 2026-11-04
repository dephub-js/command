# @dephub/command 🛠️

> A type-safe CLI command builder for Node.js, enabling easy creation
> of commands with arguments, options, subcommands, and handlers.

[![NPM version](https://img.shields.io/npm/v/@dephub/command.svg?style=flat)](https://npmjs.org/package/@dephub/command)
[![ESM-only](https://img.shields.io/badge/ESM-only-brightgreen?style=flat)](https://nodejs.org/)

## Features ✨

- 🔒 Type-safe definitions for arguments and options
- 📚 Support for nested subcommands and aliases
- ⚙️ Automatic handling of --help and --version flags
- ✅ Built-in validation for configurations and inputs
- 🔄 Variadic arguments and options for flexible parsing

---

## Installation 📦

- npm: `npm install @dephub/command`
- pnpm: `pnpm add @dephub/command`
- yarn: `yarn add @dephub/command`
- bun: `bun add @dephub/command`

---

## Usage 🎯

Use the `Command` class to build and run CLI applications with arguments,
options, and subcommands.

```ts
//cli.js
import { Command, CommandError } from '@dephub/command';

const http = new Command()
  .name('http')
  .version('1.0.0')
  .description('A lightweight HTTP client CLI')
  .argument('url', 'The target URL for the request')
  .option('--header', {
    shortFlag: '-H',
    description: 'Custom header (e.g., "Content-Type: application/json")',
    optional: true,
  });

http
  .command('get', 'Perform a GET request')
  .handler(({ args, options }) => {
    console.log(`GET ${args.url}`);
    console.log(`Header: ${options.header}`);
  })
  .exec('curl', ['-I', 'https://example.com'], {
    stdio: 'inherit',
  });

http
  .command('post', 'Perform a POST request')
  .option('--body', {
    shortFlag: '-B',
    description: 'The JSON body string to send',
  })
  .handler(({ args, options }) => {
    console.log(`POST ${args.url}`);
    console.log(`Body: ${options.body}`);
  });

try {
  // uses process.argv.slice(2)
  await http.run();
} catch (err) {
  if (err instanceof CommandError) {
    console.error(`\nError: ${err.message}\n`);
    http.help();
    process.exit(1);
  }
  throw err;
}
```

### Running the CLI 💻

```bash
node run cli.js --help
```

```text
Usage: http <url> [options] [command]

A lightweight HTTP client CLI

Arguments:
  <url>           The target URL for the request

Options:
--header, -H  [header]             Custom header (e.g., "Content-Type: application/json")
--help, -h                         Show help
--version, -v                      Show version

Commands:
  get             Perform a GET request
  post            Perform a POST request
```

```bash
node run cli.js get 'https://estarlincito.com' --header "Authorization: Kyumiu"
```

```text
GET https://estarlincito.com
Header: Authorization: Kyumiu
```

```bash
node run cli.js post 'https://estarlincito.com' --body "user: estarlincito"
```

```text
POST https://estarlincito.com
Body: user: estarlincito
```

## License 📄

MIT License – see [LICENSE](LICENSE) for details.

**Author:** Estarlin R ([estarlincito.com](https://estarlincito.com))
