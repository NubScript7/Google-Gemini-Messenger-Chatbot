import { defineConfig } from 'tsup'
import { config } from 'dotenv'

config({ quiet: true })

const IS_DEV = process.env.APP_STATE !== 'production'

export default defineConfig({
  entry: ['src/application/index.ts'],       // your main file
  format: ['esm'],               // output format
  platform: 'node',              // Node runtime
  target: 'node20',              // adjust to your Node version
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
