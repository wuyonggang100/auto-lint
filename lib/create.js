const path = require("path");
const fs = require("fs-extra"); // 比 fs 更强大
const Inquirer = require("inquirer"); // 提供选项的命令行交互操作

const Creator = require("./Creator");

module.exports = async function (projectName, options) {
  const cwd = process.cwd(); // 当前命令执行时的工作目录绝对路径
  const targetDir = path.resolve(cwd, projectName); // 需要创建的项目目录， 如果已经存在时需要提示
  console.log("-进来了--", targetDir);
  console.log('====',fs.existsSync(targetDir))
  if (fs.existsSync(targetDir)) {
    // 如果有 --force 命令，就先删掉原来的，再新建一个
    if (options.force) {
      await fs.remove(targetDir);
    } else {
      // 提示用户是否要覆盖,需要配置询问的方式
      let { action } = await Inquirer.prompt([
        {
          name: "action",
          type: "list",
          message: "Tarhet directory already exists, Pick an action",
          choices: [
            { name: "Overwrite", value: "overwrite" }, // value 值就是上面得到的 action
            { name: "Cancel", value: false },
          ],
        },
      ]);
      console.log(action)
      if (!action) {
        // 取消了
        return;
      } else if (action === "overwrite") {
        // 需要删除原目录，然后覆盖
        console.log("\r\nRemoving...");
        await fs.remove(targetDir);
      }
      console.log("action--", action);
    }
  }

  // 创建项目,指定项目名称和存放位置
  const creator = new Creator(projectName, targetDir);

  creator.create();
};
