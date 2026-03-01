import { glob } from '@dephub/glob';
import { cwd } from '@dephub/path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

const entry = await glob(['src/**/*.ts'], {
  absolute: true,
});

const dtsPlugin = dts({
  entryRoot: 'src',
  exclude: ['vite.config.ts', 'src/cli.ts'],
  outDir: 'dist',
  tsconfigPath: './tsconfig.json',
});

export default defineConfig({
  build: {
    emptyOutDir: true,
    lib: {
      entry,
    },
    minify: 'esbuild',
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
  plugins: [dtsPlugin],
  resolve: {
    alias: {
      '@': cwd('src'),
    },
  },
});
