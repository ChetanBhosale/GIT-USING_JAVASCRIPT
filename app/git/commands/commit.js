const crypto = require('crypto');
const zlib = require('zlib');
const fs = require('fs');
const path = require('path');


class CommitTreeCommand{
    constructor(tree,parent,message){
        this.tree = tree;
        this.parent = parent;
        this.message = message
    }
    execute()
    {
        const commitMessage = Buffer.concat([
            Buffer.from(`tree ${this.tree}\n`),
            Buffer.from(`parent ${this.parent}\n`),
            Buffer.from(`author Chetan Bhosale <chetanbhosale810@gmail.com> ${Date.now()} +0000\n`),
            Buffer.from(`commiter Chetan Bhosale <chetanbhosale810@gmail.com>`),
            Buffer.from(`message, ${this.message}`)
        ])

        const commitHeader = `commit ${commitMessage.length}`
        const data = Buffer.concat(Buffer.from(commitHeader), commitMessage)

        const hash = crypto.createHash('sha1').update(blob).digest('hex');


        const folder = hash.slice(0, 2);
        const file = hash.slice(2);
        console.log('this is the folder', folder);
        const completeFolderPath = path.join(process.cwd(), '.git', 'objects', folder);

        if (!fs.existsSync(completeFolderPath)) {
          fs.mkdirSync(completeFolderPath);
        }

        const compressedData = zlib.deflateSync(blob);
        fs.writeFileSync(path.join(completeFolderPath, file), compressedData);


      process.stdout.write(hash);

    }
}