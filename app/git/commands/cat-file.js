const path = require('path')
const zlib = require('zlib')
const fs = require('fs')


class CatFilecommand { 
    constructor(flag,commitSHA){
        this.flag = flag;
        this.commitSHA = commitSHA;
    }
    execute(){
        const flag = this.flag
        const commitSHA = this.commitSHA

        switch(flag){
            case "-p" : {
                const folder = commitSHA.slice(0,2)
                const file = commitSHA.slice(2)

                const completePath = path.join(process.cwd(), '.git', ".object", folder,file)
                
                if(!fs.existsSync(completePath)){
                    throw new Error('Not a valid object name '+commitSHA)

                    const fileContent = fs.readFileSync(completePath)

                    const outputBuffer = zlib.inflateSync(fileContent)
                    const output = outputBuffer.toString()

                    process.stdout.write(output)
                }

            }
            break;
        }
    }
}

module.exports = CatFilecommand