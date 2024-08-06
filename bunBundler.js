if(typeof Bun === undefined) {
    throw new Error("Cannot run bun bundler, script needed to run by bun.");
}

await Bun.build({
    entrypoints: [ "./src/index.ts" ],
    target: "node",
    outdir: "./build",
    naming: "bundle.[name].min.mjs",
    minify: true
})