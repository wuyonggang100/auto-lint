const fs = require("fs");
const path = require("path");
const util = require("util");
// const { wrapLoading } = require("./util");

const { exec } = require("child_process");
// const exec = util.promisify(require("child_process").exec);
let downloadDir = util.promisify(require("./downloadDir"));

module.exports = async function () {

  // 1. 拉取模板复制到本地
  // 从如下gitUrl地址拉取项目目录indexDB-demo,目录保存位置为saveDir，默认为当前命令执行时所在目录
  downloadDir({
    gitUrl: "https://gitee.com/gang100/auto-lint.git",
    dirName: "template",
    saveDir: process.cwd(),
  });
  //   // npm i -D husky lint-staged @commitlint/cli @commitlint/config-conventional prettier
  //   // npm i -g husky
  // 2. 安装依赖



  // exec(
  //   `npm i -D husky lint-staged @commitlint/cli @commitlint/config-conventional prettier eslint-config-prettier eslint-plugin-prettier
  //    eslint typescript @typescript-eslint/parser @typescript-eslint/eslint-plugin
  //   `,
  //   (err, stdout, stderr) => {
  //     if (err) {
  //       console.log(err);
  //       console.warn(new Date(), "install fail");
  //     }
  //   }
  // );

  exec("npm i -g husky", (err, stdout, stderr) => {
    if (err) {
      console.log(err);
      console.warn(new Date(), "install fail");
    }
  });
  exec("npx husky install", (err, stdout, stderr) => {
    if (err) {
      console.log(err);
      console.warn(new Date(), "install fail");
    }
  });

  // 3. 写入 package.json 文件  或 "prettier --write ." 
  fs.readFile("./package.json", "utf-8", (err, data) => {
    if (!err) {
      const json = new Function(`return ${data}`)()
      json.husky = {
        "hooks": {
          "pre-commit": "lint-staged",
          "commit-msg": "commitlint -E HUSKY_GIT_PARAMS"
        }
      }
      json["lint-staged"] = {
        "src/**/*.{js,vue,ts,jsx,tsx}": [
          "eslint --fix",
          "git add"
        ]
      }
      fs.writeFile("./package.json", JSON.stringify(json, null, '\t'), (err) => {
        if (err) {
          console.log(err);
        }
      })
    } else {
      console.log(err);
    }
  });
};
