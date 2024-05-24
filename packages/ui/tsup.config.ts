import { defineConfig, Options } from 'tsup'

export default defineConfig((options: Options) => ({
  treeshake: true,
  splitting: true,
  entry: ['components/**/*.tsx'],
  format: ['esm', 'cjs'],
  dts: true,
  minify: true,
  silent: true,
  external: ['react'],
  ...options,
}))
