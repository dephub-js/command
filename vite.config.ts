import { glob } from '@dephub/glob';
import { useCwd } from '@dephub/path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

import pkg from './package.json' with { type: 'json' };

const entry = await glob(['src/**/*.ts', '!src/**/*.test.ts'], {
  absolute: true,
});

const dtsPlugin = dts({
  entryRoot: 'src',
  exclude: ['vite.config.ts', 'src/cli.ts', 'src/**/*.test.ts'],
  outDirs: 'dist',
  tsconfigPath: './tsconfig.json',
});

export default defineConfig({
  build: {
    emptyOutDir: true,
    lib: {
      entry,
    },
    reportCompressedSize: true,
    rollupOptions: {
      external: ['*'],
      output: [
        {
          dir: 'dist',
          entryFileNames: '[name].js',
          format: 'esm',
          preserveModules: true,
          preserveModulesRoot: 'src',
        },
      ],
    },
    ssr: true,
    target: 'esnext',
  },
  define: {
    __PKG_DESCRIPTION__: JSON.stringify(pkg.description),
    __PKG_NAME__: JSON.stringify(pkg.name),
    __PKG_VERSION__: JSON.stringify(pkg.version),
  },
  plugins: [dtsPlugin],
  resolve: {
    alias: {
      '#': useCwd('src'),
    },
  },
});
