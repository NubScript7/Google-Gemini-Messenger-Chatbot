import { resolve } from "path";
import { spawnSync } from "child_process"
//import fs from "fs"
if(typeof Bun === undefined) {
    throw new Error("Cannot run bun bundler, script needed to run by bun.");
}



/*
await Bun.build({
    entrypoints: [ "./src/index.ts" ],
    target: "node",
    outdir: resolve(__dirname, "./build"),
    naming: "bundle.min.mjs",
    minify: true
})
*/

const entrypoints = [ resolve(__dirname, "./src/index.ts") ]
const target = "node"
const outDir = resolve(__dirname, "./build")
const filename = "bundle.min.mjs"
const minify = true
const externals = [ "ejs" ]

/*
function getExternals() {
  const packageJson = JSON.parse(fs.readFileSync("./package.json"))

  const sections = [
    'dependencies',
    'devDependencies',
    'peerDependencies',
  ], externals = new Set()

  for (const section of sections)
    if (packageJson[section])
      Object.keys(packageJson[section]).forEach(_ => externals.add(_))

  console.log('externals', externals)

  return Array.from(externals)
}
*/

const buildArgs = [
    entrypoints.join(" "),
    target ? "--target="+target : "",
    outDir ? "--outdir="+outDir : "",
    filename ? "--chunk-naming="+filename : "",
    minify ? "--minify" : "",
    externals ? externals.map(module => "-e "+module).join(" ") : "",
    "--format=cjs"
]

// console.log(buildArgs, buildArgs.join(" "))

const process = spawnSync("bun", ["build", ...buildArgs])

const [err, output] = process.output

console.log((err ? err : output).toString())

console.log("bun build", ...buildArgs)
// const output = process.output

/*
console.log({
    signal: process.signal,
    status: process.status,
    output: [ output[0], output[1].toString() ],
    stdout: process.stdout.toString(),
    stderr: process.stderr.toString()
})
*/
