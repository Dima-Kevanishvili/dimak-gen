import * as shell from "shelljs";
import * as fs from "fs";
import * as path from "path";
import { CliOptions } from "../types";
const TEMPLATES_WITH_GQL_COGE_GEN = ["prisma-gql-ts"];
function postProcess(options: CliOptions) {
  const isNode = fs.existsSync(path.join(options.templatePath, "package.json"));
  if (isNode) {
    shell.cd(options.tartgetPath);
    // const result = shell.exec("yarn install");
    // if (result.code !== 0) {
    //   return false;
    // }
    if (TEMPLATES_WITH_GQL_COGE_GEN.includes(options.templateName)) {
      const codeGenRes = shell.exec("yarn genGqlTypea");
      if (codeGenRes.code !== 0) {
        return false;
      }
    }
  }
  return true;
}

export default postProcess;
