import { defineConfig, Options } from 'tsup'

export default defineConfig((options: Options) => ({
  treeshake: true,
  splitting: true,
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  minify: true,
  silent: true,
  external: ['react'],
  ...options,
}));
