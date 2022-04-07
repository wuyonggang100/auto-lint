let fs = require("fs");
const { resolve } = require("path");
let stat = fs.stat;

let copy = function (src, dst, fn) {
  // return new Promise((resolve, reject) => {
  //读取目录
  fs.readdir(src, function (err, paths) {
    // console.log(paths);
    if (err) {
      throw err;
    }
    paths.forEach(function (path, index) {
      let _src = src + "/" + path;
      let _dst = dst + "/" + path;
      let readable;
      let writable;
      stat(_src, function (err, st) {
        if (err) {
          throw err;
        }

        if (st.isFile()) {
          readable = fs.createReadStream(_src); //创建读取流
          writable = fs.createWriteStream(_dst); //创建写入流
          readable.pipe(writable);
          writable.on("close", () => {
            if (index === paths.length - 1) {
              setTimeout(() => {
                fn && fn();
              }, 1000);
            }
          });
        } else if (st.isDirectory()) {
          exists(_src, _dst, copy);
        }
      });
    });
  });
  // });
};

let exists = function (src, dst, callback, fn) {
  //测试某个路径下文件是否存在
  fs.exists(dst, function (exists) {
    if (exists) {
      //不存在
      callback(src, dst, fn);
    } else {
      //存在
      fs.mkdir(dst, function () {
        //创建目录
        callback(src, dst, fn);
      });
    }
  });
};

// 将指定目录的文件复制到另一个目录
module.exports = {
  copyDir: (src, dist, fn) => {
    exists(src, dist, copy, fn);
  },
};
