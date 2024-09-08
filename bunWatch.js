import {watch, readFileSync, writeFileSync} from "fs"
import {resolve} from "path"

let lastEventTime = Date.now();
/* change to false if you dont want to use the rename workaround */
const enableRenameInsteadOfChangeWorkaround = true;

const tsConfigPath = "tsconfig.json"

let srcDir = "./src"
let outDir = "./dist"

const transpiler = new Bun.Transpiler("ts")

try {
    const txt = readFileSync(resolve(__dirname, tsConfigPath), "utf8")
    const json = JSON.parse(txt)
    outDir = json.outDir || outputDir
    srcDir = json.srcDir || srcDir
} catch {
    console.log(`cannot load output dir from '${outputDir}'. Using 'dist' as default.`)
}

/* might trigger two or more events */
watch(resolve(__dirname, "./src"), (event, filename) => {
    const dateNow = Date.now()
    const elapsedTime = dateNow - lastEventTime
    lastEventTime = dateNow
    
    /* for me, 500ms above is acceptable. You can alter this if your file change is faster */
    if(elapsedTime <= 500)
        return console.log(`file ${filename} ${event} ignored`)
    
    console.log(`file ${filename} has been ${event}d, transpiling to `)
    
    try {
        const txt = readFileSync(filename, "utf8")
        const transpiled = transpiler.transformSync(txt)
        writeFileSync(resolve(__dirname, outDir, filename), transpiled)
    } catch(e) {
        console.log(e.message)
    }
    
})