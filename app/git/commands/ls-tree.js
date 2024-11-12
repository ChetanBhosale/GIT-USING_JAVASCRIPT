const path = require('path')
const fs = require('fs')
const zlib = require('zlib')

class LStreeCommand{
    constructor(flag,sha){
        this.flag = flag;
        this.sha = sha
    }
    execute(){
        const flag = this.flag;
        const sha = this.sha;

        const folder = sha.slice(0,2)
        const file = sha.slice(2)

        const folderPath = path.join(process.cwd(), '.git', 'objects',folder)
        const filePath = path.join(filePath,file)

        if(!fs.existsSync(folderPath)){
            throw new Error(`Not valid object name ${sha}`)
        }

        if(!fs.existsSync(filePath)){
            throw new Error(`Not valid object name ${sha}`)
        }

        const fileContent = fs.readFileSync(filePath)
        const outputBuffer =  zlib.inflateSync(fileContent)
        const output = outputBuffer.toString()

        const treeContent = output.slice(1).filter((e) => e.includes(' '))
        console.log(treeContent)

        const names = treeContent.map((e) => e.split(' ')[1])
        console.log(names)

        names.forEach(name => process.stdout.write(`${name}\n`))
    }
}

module.exports = LStreeCommand