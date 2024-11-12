const crypto = require('crypto');
const zlib = require('zlib');
const fs = require('fs');
const path = require('path');

class HashObjectCommand {
  constructor(flag, filePath) {
    this.flag = flag;
    this.filePath = filePath;
  }

  execute() {
    try {
      const filepath = path.resolve(this.filePath);

      if (!fs.existsSync(filepath)) {
        console.error(`could not open ${filepath} for reading: No such file or directory`);
        return;
      }

      const filecontent = fs.readFileSync(filepath);
      const fileLength = filecontent.length;
      const header = `blob ${fileLength}\0`;
      const blob = Buffer.concat([Buffer.from(header), filecontent]);

      const hash = crypto.createHash('sha1').update(blob).digest('hex');

      if (this.flag === '-w') {
        const folder = hash.slice(0, 2);
        const file = hash.slice(2);
        const completeFolderPath = path.join(process.cwd(), '.git', 'objects', folder);

        if (!fs.existsSync(completeFolderPath)) {
          fs.mkdirSync(completeFolderPath);
        }

        const compressedData = zlib.deflateSync(blob);
        fs.writeFileSync(path.join(completeFolderPath, file), compressedData);
      }

      process.stdout.write(hash);
    } catch (error) {
      console.error("Error executing HashObjectCommand:", error);
    }
  }
}

module.exports = HashObjectCommand;