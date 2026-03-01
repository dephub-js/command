#!/usr/bin/env node
import { description, name, version } from '@/helpers/pkg.js';

import { Command } from './index.js';

const cmd = new Command()
  .name(name.split('/')[1] ?? 'command')
  .description(description)
  .version(version);

await cmd.run();
