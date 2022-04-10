## install
1. install global
```sh
yarn add global auto-git-lint #yarn
npm install auto-git-lint -g #npm
```

2. install in your project
```sh
yarn add auto-git-lint -D #yarn
npm install add auto-git-lint -D #npm
```

## use in your project
```sh
auto-lint
```





- eslint：ESLint的核心代码库；
- @typescript-eslint/parser：解析器，让ESLint拥有规范TypeScript代码的能力；

- @typescript-eslint/eslint-plugin：插件，包含一系列TypeScript的ESint规则。

  

- prettier：Prettier的核心代码库；

- eslint-config-prettier：用于禁用与Prettier有冲突的ESLint规则；

- eslint-plugin-prettier：将Prettier作为ESLint的规则来运行。这样就可以通过ESLint的`--fix`来自动修复代码了

  
  

 