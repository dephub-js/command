import { spawn } from 'node:child_process';

import type { CommandExecution } from '@/core/types.js';

export async function execution(config: CommandExecution): Promise<void> {
  const { args = [], command, options = {} } = config;
  const child = spawn(command, args, options);

  let stdout = '';
  let stderr = '';

  const encoding = options.encoding ?? 'utf8';

  if (child.stdout) {
    child.stdout.setEncoding(encoding);
    child.stdout.on('data', (data) => {
      stdout += data;
    });
  }

  if (child.stderr) {
    child.stderr.setEncoding(encoding);
    child.stderr.on('data', (data) => {
      stderr += data;
    });
  }

  await new Promise((resolve, reject) => {
    child.on('close', (code) => {
      resolve({
        code: code ?? 0,
        stderr: stderr ? stderr.trim() : null,
        stdout: stdout ? stdout.trim() : null,
      });
    });
    child.on('error', (err) => {
      reject(new Error(err.message));
    });
  });
}
