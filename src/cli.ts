#!/usr/bin/env node
/* eslint-disable no-console */
import process from 'node:process';

import { Command, CommandError } from './index.ts';

const cmd = new Command()
  .name(__PKG_NAME__.split('/')[1])
  .description(__PKG_DESCRIPTION__)
  .version(__PKG_VERSION__);

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
