import { defineConfig } from 'tsup'
import { config } from 'dotenv'

config({ quiet: true })

const IS_DEV = process.env.NODE_ENV !== 'production'

export default defineConfig({
  entry: ["src/main.ts"],
  format: ['esm'],               // output format
  bundle: true,
  platform: 'node',              // Node runtime
  target: 'node20',              // adjust to your Node version (node20)
  outDir: 'dist',                // output directory
  sourcemap: IS_DEV,               // for debugging
  clean: true,                   // clears dist before build
  minify: IS_DEV,                 // optional: disable minify for dev
  external: [
    // 'hono',                       // your Hono dependency
    // 'node:*'                      // Node built-ins
  ],
  watch: false,
})
