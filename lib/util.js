const ora = require("ora");
async function wrapLoading(fn, msg, ...args) {
  const spinner = ora(msg);
  spinner.start();
  try {
    let repos = await fn(...args);
    spinner.succeed();
    return repos;
  } catch (e) {
    spinner.fail("request fail, refetch...");
    await sleep(1000);
    return wrapLoading(fn, msg, ...args);
  }
}

async function sleep(delay) {
  return new Promise((resolve, reject) => setTimeout(resolve, delay));
}

module.exports = {
  sleep,
  wrapLoading,
};
