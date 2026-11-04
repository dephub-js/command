import { CommandError } from '@/helpers/error.js';
import { type Config } from '@/helpers/utils.js';

export function validateSteps(steps: Config['steps']) {
  for (const step of steps) {
    if (step.kind === 'execution') {
      if (!step.execution.command) {
        throw new CommandError('Command is required');
      }
    }
  }
}
