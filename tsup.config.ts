import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],       // your main file
  format: ['esm'],               // output format
  platform: 'node',              // Node runtime
  target: 'node20',              // adjust to your Node version
  outDir: 'dist',                // output directory
  sourcemap: true,               // for debugging
  clean: true,                   // clears dist before build
  minify: false,                 // optional: disable minify for dev
  external: [
    // 'hono',                       // your Hono dependency
    // 'node:*'                      // Node built-ins
  ],
  watch: process.env.NODE_ENV === 'development',
})
