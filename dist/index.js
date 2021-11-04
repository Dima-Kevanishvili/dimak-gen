#!/usr/bin/env node
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const inquirer = __importStar(require("inquirer"));
const path = __importStar(require("path"));
const createDirectoryContents_1 = __importDefault(require("./utils/createDirectoryContents"));
const createProjectFolder_1 = __importDefault(require("./utils/createProjectFolder"));
const postProcess_1 = __importDefault(require("./utils/postProcess"));
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
    const options = {
        projectName,
        templateName: projectChoice,
        templatePath,
        tartgetPath,
    };
    if (!(0, createProjectFolder_1.default)(tartgetPath)) {
        return;
    }
    (0, createDirectoryContents_1.default)(templatePath, projectName);
    (0, postProcess_1.default)(options);
});
//# sourceMappingURL=index.js.map