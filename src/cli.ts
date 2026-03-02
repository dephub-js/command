#!/usr/bin/env node
/* eslint-disable no-console */
import { description, name, version } from '@/helpers/pkg.js';

import { Command, CommandError } from './index.js';

const cmd = new Command()
  .name(name.split('/')[1] ?? 'command')
  .description(description)
  .version(version);

try {
  await cmd.run();
} catch (err) {
  if (err instanceof CommandError) {
    console.error(`\nError: ${err.message}\n`);
    cmd.help();
    process.exit(1);
  }
  throw err;
}
