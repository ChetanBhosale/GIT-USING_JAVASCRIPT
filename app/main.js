const fs = require("fs");
const path = require("path");
const GitClient = require('./git/clients')
// You can use print statements as follows for debugging, they'll be visible when running tests.
console.error("Logs from your program will appear here!");

const gitClient = new GitClient()

//commands
const CatFilesCommand = require('./git/commands/index')



// Uncomment this block to pass the first stage
const command = process.argv[2];

switch (command) {
  case "init":
    createGitDirectory();
    break;
  case "cat-file" : 
    handleCatFileCommand()
  default:
    throw new Error(`Unknown command ${command}`);
}

function createGitDirectory() {
  fs.mkdirSync(path.join(process.cwd(), ".git"), { recursive: true });
  fs.mkdirSync(path.join(process.cwd(), ".git", "objects"), { recursive: true });
  fs.mkdirSync(path.join(process.cwd(), ".git", "refs"), { recursive: true });

  fs.writeFileSync(path.join(process.cwd(), ".git", "HEAD"), "ref: refs/heads/main\n");
  console.log("Initialized git directory");
}


function handleCatFileCommand(){
    const flag = process.argv[3];
    const commitSHA = process.argv[4]

    const command = new CatFilesCommand(flag,commitSHA);
    gitClient.run(command)
    
    console.log({flag, commitSHA})
}