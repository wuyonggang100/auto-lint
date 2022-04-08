let path = require("path");
const os = require("os");
const fs = require("fs-extra");
const util = require("util")
// const copyDir = util.promisify(require("./copyDir").copyDir);
let exec = util.promisify(require("child_process").exec)
function downloadDir(param) {
  let {
    gitUrl,
    dirName,
    saveDir = path.resolve("."),
    delGit = true,
    isUseEndDir = true,
  } = param;

  // 如果saveDir目录不存在，就创建此目录
  if (!fs.existsSync(saveDir)) {
    fs.mkdirSync(saveDir)
  }
  // 拉取下来的代码盛放的临时文件夹各目录
  let randDirName = "temp_" + new Date().getTime(); //获取时间戳作为随机目录名
  let dir_randDirName = path.join(saveDir, randDirName);
  let dir_randDirName_dirName = path.join(dir_randDirName, dirName);
  let dir_randDirName_git = path.join(dir_randDirName, "/.git");
  // 需要保存到的位置目录(如果目录有多个层级，那么默认取最后一级)
  if (isUseEndDir) {
    let dirArr = dirName.split("/");
    dirArr = dirArr.filter((ele) => ele != "");
    if (dirArr.length > 1) {
      dirName = dirArr[dirArr.length - 1];
    }
  }

  console.log("template fetching ......");
  let sysType = os.type();
  let cli = "";
  if (sysType === "Windows_NT") {
    //windows
    cli = `git init & git remote add origin ${gitUrl} &  git config core.sparsecheckout true & echo ${dirName} >> .git/info/sparse-checkout & git pull origin master`;
  } else {
    //mac 和 linux
    cli = `
  git init 
  git remote add origin ${gitUrl} 
  git config core.sparsecheckout true 
  echo ${dirName} >> .git/info/sparse-checkout
  git pull origin master`;
  }

  console.log('dir_randDirName---', dir_randDirName)
  //开始克隆远程postcss-in-gulp项目
  fs.mkdirSync(dir_randDirName) // 创建临时目录

  exec(
    cli,
    { cwd: dir_randDirName }, //在dir_randDirName目录下执行git拉取操作
    async function (error, des) {
      if (error !== null) {
        console.error("\n", error);
      } else {
        // 要删除临时目录的.git文件夹,那就直接删除
        // console.log('---git---', dir_randDirName_git)
        fs.removeSync(dir_randDirName_git, function (err) {
          if (err) {
            console.log('-----git ', err)
          }
        });
        try {
          fs.copySync(dir_randDirName_dirName, process.cwd())
          console.log('success!')
        } catch (err) {
          console.error(err)
        }

        fs.remove(dir_randDirName, function (err) {
          if (err) {
            console.log('-----err ', err)
          }
        });
      }
    }
  );
}

module.exports = downloadDir;
