import * as fs from "fs";
import chalk from "chalk";

function createProjectFolder(projectPath: string) {
  if (fs.existsSync(projectPath)) {
    console.log(
      chalk.red(`Folder ${projectPath} exists. Delete or use another name.`)
    );
    return false;
  }
  fs.mkdirSync(projectPath);

  return true;
}

export default createProjectFolder;
