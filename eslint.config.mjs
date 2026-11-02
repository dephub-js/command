import tsConfig from '@dephub/eslint-ts';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  ...tsConfig,
  {
    rules: {
      '@typescript-eslint/no-unnecessary-type-assertion': 'off',
      '@typescript-eslint/restrict-template-expressions': 'off',
      'no-nested-ternary': 'off',
      'no-param-reassign': 'off',
      'no-plusplus': 'off',
      'security/detect-object-injection': 'off',
      'security/detect-possible-timing-attacks': 'off',
    },
  },
]);
