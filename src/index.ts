#!/usr/bin/env node

import * as fs from "fs";
import * as inquirer from "inquirer";
import * as path from "path";
import { CliOptions } from "./types";
import createDirectoryContents from "./utils/createDirectoryContents";
import createProjectFolder from "./utils/createProjectFolder";
import postProcess from "./utils/postProcess";

const CHOICES = fs.readdirSync(path.join(__dirname, "templates"));
const QUESTIONS = [
  {
    name: "template",
    type: "list",
    message: "What template would you like to use?",
    choices: CHOICES,
  },
  {
    name: "name",
    type: "input",
    message: "Please input a new project name:",
  },
];

const CURR_DIR = process.cwd();

inquirer.prompt(QUESTIONS).then((answers) => {
  const projectChoice = answers["template"];
  const projectName = answers["name"];
  const templatePath = path.join(__dirname, "templates", projectChoice);

  const tartgetPath = path.join(CURR_DIR, projectName);

  const options: CliOptions = {
    projectName,
    templateName: projectChoice,
    templatePath,
    tartgetPath,
  };

  if (!createProjectFolder(tartgetPath)) {
    return;
  }

  createDirectoryContents(templatePath, projectName);

  postProcess(options);
});
