const { fetchRepoList, fetchTagList } = require("./request");
const Inquirer = require("inquirer");
const ora = require("ora");
const downloadGitRepo = require("download-git-repo"); // 不支持 promise ，需要变成 promise
const util = require("util"); // node 自带的
const path = require("path");
let { exec } = require("child_process");
exec = util.promisify(exec);

const { wrapLoading } = require("./util");

class Creator {
  constructor(projectName, targetDir) {
    this.name = projectName;
    this.target = targetDir;
    this.downloadGitRepo = util.promisify(downloadGitRepo); // 变成 promise 方法
  }

  // 抓取模板
  async fetchRepo() {
    // 失败了重新获取，同时加个 loading 效果，使用 ora 来 loading
    let repos = await wrapLoading(fetchRepoList, "wait ...");
    if (!repos) return;
    repos = repos.map((v) => v.name); // 得到多个项目名组成的数组
    // 选择一个项目名
    let { repo } = await Inquirer.prompt({
      name: "repo",
      type: "list",
      choices: repos,
      message: "please choose a template to create project",
    });
    return repo;
  }

  async fetchTag(repo) {
    let tags = await wrapLoading(fetchTagList, "waiting fetch tag", repo);
    if (!tags) return;
    tags = tags.map((v) => v.name);
    console.log("tags----", tags);
    let { tag } = await Inquirer.prompt({
      name: "tag",
      type: "list",
      choices: tags,
      message: "please choose a tag",
    });
    return tag;
  }

  // 在指定的目录里执行命令, cwd 的值是指定的目录名
  async install() {
    await exec(`yarn install`, { cwd: this.name }, (err, stdout, stderr) => {
      if (err) {
        console.log(err);
        console.warn(new Date(), "安装失败");
      } else {
        console.log(stdout);
        console.warn(new Date(), "安装成功");
      }
    });
  }

  async download(repo, tag) {
    // 1. 拼接出一个完整资源路径
    // let requestUrl = `zhu-cli/${repo}${tag ? "#" + tag : ""}`;
    let requestUrl = `https://github.com/mikehall314/es6-promisify.git`;
    console.log("仓库地址----", requestUrl);
    // 2. 将资源下载到本地某个路径
    await wrapLoading(
      this.downloadGitRepo,
      "downloading ...",
      requestUrl,
      path.resolve(process.cwd(), this.name)
    );
  }

  async create() {
    // 1.采用远程拉取模板的方式,可以是 github , gitee 等
    // 2. 根据用户选择动态生成内容
    // 拉取模板
    let repo = await this.fetchRepo();
    // 获取版本号
    let tag = await this.fetchTag(repo);
    // 用repo 和 tag 拼接成一个完整地址，下载
    await this.download(repo, tag);
    // 安装依赖
    await wrapLoading(this.install, "installing...");
  }
}

module.exports = Creator;
