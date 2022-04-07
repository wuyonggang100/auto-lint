let path = require("path");
let child_process = require("child_process");
const copyDir = require("util").promisify(require("./copyDir").copyDir);

const os = require("os");
let zl_nodefs = require("zl-nodefs");
let {
  deleteFile, //删除文件夹/文件
  copycutFiledir, //复制或剪切文件/文件夹
  util,
} = zl_nodefs;

// deleteFile = require("util").promisify(deleteFile);

const download = require("download-git-repo");
let sysType = os.type();
let cli = "";

function downloadDir(param) {
  let {
    gitUrl,
    dirName,
    saveDir = path.resolve("."),
    delGit = true,
    isUseEndDir = true,
  } = param;

  // ------计算各种目录------
  // 如果saveDir目录不存在，那就递归创建此目录
  util.createDirsSync(saveDir);
  // 拉取下来的代码盛放的临时文件夹各目录
  let randDirName = "临时文件夹_" + new Date().getTime(); //获取时间戳作为随机目录名
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
  let saveDir_dirName = path.join(saveDir, dirName);
  let saveDir_git = path.join(saveDir, ".git");

  console.log(dirName + "项目内容获取中，请稍等......");
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
  //开始克隆远程postcss-in-gulp项目
  child_process.exec("mkdir " + dir_randDirName, function () {
    child_process.exec(
      cli,
      { cwd: dir_randDirName }, //在dir_randDirName目录下执行git拉取操作
      async function (error, des) {
        if (error !== null) {
          console.error("\n", error);
        } else {
          // 如果指定了要删除.git文件夹,那就直接删除
          if (delGit) {
            deleteFile({
              fileUrl: dir_randDirName_git,
              flag: true,
              showExeResult: false,
            });
          } else {
            copycutFiledir({
              inputFileUrl: dir_randDirName_git,
              outFileUrl: saveDir_git,
              copyOrCut: "copy",
              showExeResult: false,
              rewrite: false, //复制时对于已经有的直接跳过
            });
          }

          // 将实际内容移到外层(直接将里面的全部复制出来，复制时对于已经有的直接跳过)
          // copycutFiledir({
          //   inputFileUrl: dir_randDirName_dirName,
          //   outFileUrl: saveDir_dirName || process.pwd(),
          //   copyOrCut: "cut",
          //   showExeResult: false,
          //   rewrite: false, //复制时对于已经有的直接跳过
          // });

          // 复制到命令执行的目录下
          copyDir(dir_randDirName_dirName, process.cwd(), () => {
            //拉取成功后，执行删除临时文件夹
            deleteFile({
              fileUrl: dir_randDirName,
              flag: true,
              showExeResult: false,
            });
          });
        }
      }
    );
  });
}

module.exports = downloadDir;
