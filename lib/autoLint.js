const fs = require("fs");
const path = require("path");
const util = require("util");
const { wrapLoading } = require("./util");

const { exec } = require("child_process");
// const exec = util.promisify(require("child_process").exec);
let downloadDir = util.promisify(require("./downloadDir"));

// const copyDir = util.promisify(require("./copyDir").copyDir);

module.exports = async function () {
  // 1. 拉取模板复制到本地
  // 从如下gitUrl地址拉取项目目录indexDB-demo,目录保存位置为saveDir，默认为当前命令执行时所在目录

  downloadDir({
    gitUrl: "https://gitee.com/gang100/auto-lint.git",
    dirName: "template",
    saveDir: process.cwd(),
  });

  // console.log("我执行了-----");
  // await copyDir(path.resolve(process.cwd(), "template"), process.cwd());

  //   // npm i -D husky lint-staged @commitlint/cli @commitlint/config-conventional prettier
  //   // npm i -g husky
  // 2. 安装依赖
  // wrapLoading(
  //   exec,
  //   "installing...",
  //   `npm i -D husky lint-staged @commitlint/cli @commitlint/config-conventional prettier eslint eslint-config-prettier eslint-plugin-prettier`,
  //   (err, stdout, stderr) => {
  //     if (err) {
  //       console.log(err);
  //       console.warn(new Date(), "install fail");
  //     }
  //   }
  // );

  // wrapLoading(
  //   exec,
  //   "installing...",
  //   `npm i -g husky`,
  //   (err, stdout, stderr) => {
  //     if (err) {
  //       console.log(err);
  //       console.warn(new Date(), "install fail");
  //     }
  //   }
  // );
  exec(
    `npm i -D husky lint-staged @commitlint/cli @commitlint/config-conventional prettier eslint eslint-config-prettier eslint-plugin-prettier`,
    (err, stdout, stderr) => {
      if (err) {
        console.log(err);
        console.warn(new Date(), "install fail");
      }
    }
  );
  exec("npm i -g husky", (err, stdout, stderr) => {
    if (err) {
      console.log(err);
      console.warn(new Date(), "install fail");
    }
  });
  // 3. 写入 package.json 文件
  fs.readFile("./package.json", "utf-8", (err, data) => {
    if (!err) {
      let rawJson = data.trim().slice(0, -1);
      let lintJson = `
        ,"husky": {
          "hooks": {
            "pre-commit": "lint-staged",
            "commit-msg": "commitlint -E HUSKY_GIT_PARAMS"
          }
        },
        "lint-staged": {
            "src/**/*.{js,vue,ts,jsx,tsx}": [
              "prettier --write ."
            ]
        }
      }`;

      fs.writeFile("./package.json", rawJson + lintJson, (err) => {
        if (err) {
          console.log(err);
        }
      });
    } else {
      console.log(err);
    }
  });
};
