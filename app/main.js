const fs = require("fs");
const path = require("path");
const GitClient = require('./git/clients');

const gitClient = new GitClient();

const CatFilesCommand = require('./git/commands/cat-file');
const HashObjectCommand = require('./git/commands/hash-object');
const handleLsTreeCommand = require('./git/commands/ls-tree');
const commitTreeCommand = require('./git/commands/commit');

const command = process.argv[2];

switch (command) {
  case "init":
    createGitDirectory();
    break;
  case "cat-file":
    handleCatFileCommand();
    break;
  case "hash-object":
    handleHashObjectCommand();
    break;
  case "ls-tree":
    handleTreeCommand();
    break;
  case "commit":
    handleCommitCode();
    break;
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

function handleCatFileCommand() {
  const flag = process.argv[3];
  const commitSHA = process.argv[4];

  const command = new CatFilesCommand(flag, commitSHA);
  gitClient.run(command);
}

function handleHashObjectCommand() {
  let flag = process.argv[3];
  let filePath = process.argv[4];

  const hashCommand = new HashObjectCommand(flag, filePath);
  gitClient.run(hashCommand);
}

function handleTreeCommand() {
  let flag = process.argv[3];
  let sha = process.argv[4];
  if (!sha && flag === '--name-only') return;

  if (!sha) {
    sha = flag;
    flag = null;
  }

  const command = new handleLsTreeCommand(flag, sha);
  gitClient.run(command);
}

function handleCommitCode() {
  const tree = process.argv[3];
  const commitSHA = process.argv[5];
  const commitMessage = process.argv[7];

  const exec = new commitTreeCommand(tree, commitSHA, commitMessage);
  gitClient.run(exec);
}