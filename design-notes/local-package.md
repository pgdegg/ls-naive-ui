# HIS 本地构建与安装包

在仓库根目录运行：

```sh
pnpm build
```

命令先执行现有 `build:package:vapor`，生成 ESM、CommonJS、UMD、声明和组件提示文件，完成构建自带的 UMD/ESM 冒烟测试及产物检查；仅成功后才执行 `scripts/pack-his.ts`。

默认产物为：

```text
D:/his-dependence/naive-ui-<SHA256前16位>.tgz
```

包名继续使用 `naive-ui`，保留原有导入方式及依赖解析。文件名按完整安装包内容计算哈希，不覆盖旧版本。打包在临时目录进行，包中只保留运行文件、类型、组件提示和包元数据，移除开发依赖、开发脚本和包管理器配置；不会修改仓库 package.json 来临时打包。

## 其它项目安装

在目标项目中执行构建日志给出的命令，例如：

```sh
pnpm add "file:D:/his-dependence/naive-ui-0123456789abcdef.tgz"
```

以上文件名仅为格式示例，请使用实际生成路径。`pnpm add` 会更新目标项目的 package.json 和锁文件，不会向 npm 发布。依赖包仍由目标项目正常安装；离线安装需已有依赖缓存。

```ts
import { NColorPickerPanel, NInputNumber, NText } from 'naive-ui'
```

构建后源代码又有修改时，需要重新运行 `pnpm build`。请勿仅重新打包旧的 es/lib 文件。

## 只打包已有产物

```sh
pnpm pack:his
pnpm pack:his D:/my-packages
```

第一个参数是输出目录。缺少完整构建产物时会报错；打包本身不代替构建或验证源代码。

## 可选：同步已有依赖路径

```sh
pnpm pack:his D:/his-dependence D:/HIS/your-project/package.json
```

第二个参数为目标项目 package.json。目标必须已在 dependencies、devDependencies 或 optionalDependencies 中唯一声明 naive-ui。脚本只替换该依赖值，保留其它内容及格式，然后在目标项目执行：

```sh
pnpm install
```

默认不修改任何消费项目，也不自动运行安装。若目标文件在打包期间被编辑，脚本会停止同步，保留已生成的安装包及用户修改。

## 与其它命令的关系

- `pnpm build`：当前定制版本的完整构建和本地打包入口。
- `pnpm build:package:vapor`：保留现有包构建流程，不额外打包 tgz。
- `pnpm build:package`：保留上游传统构建入口。
- `pnpm build:site`：文档站点构建，不是本地组件安装包。
- `pnpm release:package`：发布入口，本地打包不会调用它。
