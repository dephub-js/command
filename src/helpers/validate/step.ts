import { CommandError } from '#/helpers/error.ts';
import { type Config } from '#/helpers/utils.ts';

export function validateSteps(steps: Config['steps']) {
  for (const step of steps) {
    if (step.kind === 'execution') {
      if (!step.execution.command) {
        throw new CommandError('Command is required');
      }
    }
  }
}
