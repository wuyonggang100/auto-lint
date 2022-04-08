module.exports = {
  env: {
    commonjs: true,
    es2021: true,
    node: true,
  },

  //  eslint-config-prettier: 禁用所有和 Prettier 产生冲突的规则
  //  eslint- plugin - prettier: 把 Prettier 应用到 Eslint，配合 rules "prettier/prettier": "error" 实现 Eslint 提醒。
  extends: ["eslint:recommended",
    //  'plugin:@typescript-eslint/recommended', 
    "plugin:prettier/recommended"],
  // parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module'
  },
  plugins: ["prettier"],

  // "off" or 0   - 关闭
  // "warn" or 1  - 开启，不遵守会报警，可以编译成功
  // "error" or 2 - 开启，不遵守会报错，无法编译成功
  rules: {
    "prettier/prettier": "error", // prettier 标记的地方会报错
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    quotes: [0, "single"], // 0 是使用双引号, 2 使用单引号  引号类型 `` "" ''
    semi: [0, "never"], // 语句强制分号结尾 等同于  [0, "never"]
    "no-var": "error", // 禁止使用 var
    "no-unused-vars": "warn", // 无用变量警告
    "no-alert": "error", // 禁止使用window 的alert confirm prompt
    "comma-dangle": [0, "never"], // 数组和对象键值对最后一个不能有逗号
    "space-before-function-paren": [0, "never"], // 函数名括号前的空格
    "no-promise-executor-return": "off",
    "no-unreachable-loop": "off",
    "no-unsafe-optional-chaining": "off",
    ident: ["off", 2],
  },
};
