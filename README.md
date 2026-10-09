# CyberChef 中文汉化版

[![](https://github.com/gchq/CyberChef/workflows/Master%20Build,%20Test%20&%20Deploy/badge.svg)](https://github.com/gchq/CyberChef/actions?query=workflow%3A%22Master+Build%2C+Test+%26+Deploy%22)
[![](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](https://github.com/gchq/CyberChef/blob/master/LICENSE)
[![](https://img.shields.io/badge/upstream-v11.5.0-orange.svg)](https://github.com/gchq/CyberChef/releases/tag/v11.5.0)

#### *网络瑞士军刀 —— 简体中文汉化版*

本项目是 [gchq/CyberChef](https://github.com/gchq/CyberChef) 的**简体中文汉化分支**，
在上游 **v11.5.0** 完整源码的基础上，仅对**面向用户的文案**做本地化，
不修改任何算法实现。

> 英文原版说明见 [README_UPSTREAM.md](README_UPSTREAM.md)。

---

## 汉化完成度

| 汉化层面 | 覆盖情况 | 说明 |
| --- | --- | --- |
| 操作说明（description） | **505 / 505** | 含变量插值的说明已单独还原，避免破坏模板求值 |
| 参数名（args[].name） | **1061 / 1294（82.0%）** | 其余为刻意保留英文的技术标识符 |
| 分类名（Categories） | **17 / 17** | 界面显示中文，DOM id 保持英文（渲染层查表） |
| 界面文案（index.html） | **259 / 260** | 菜单、按钮、提示、帮助、设置项等 |
| 运行期生成的界面文案 | 已覆盖 | 快捷键表（`#keybList`）、帮助弹窗标题、输入 / 输出状态栏（长度、行数、光标偏移、字符编码、行尾序列、烘焙耗时） |

**刻意保留英文的内容**（不汉化，属设计选择）：

- **操作名称**（如 `To Base64`、`AES Decrypt`）—— 它是配方（Recipe）的标识符，
  汉化会导致链接、配方导入导出、`.chef` 文件全部失效。
- **参数取值**（如 `CBC`、`ECB`、`Hex`、`UTF8`）—— 同属功能值，不可翻译。
- **密码学标识符**（`Key`、`IV`、`Salt`、`Nonce`、`sBox`、`MAC`、`GCM Tag` 等）
  —— 与上游习惯保持一致，便于对照英文资料。
- **真实字符集名**（`UTF-8`、`Windows-1251 Cyrillic`、`Simplified Chinese GBK` …）
  —— 是 IANA 字符集标识，且被 UI 测试用 `link text` 选择器定位。
- **行尾代码**（`LF` / `CR` / `CRLF` / `LS` / `PS` …）—— 写进 URL 参数（`ieol=` / `oeol=`）
  与状态栏 `.eol-value`，UI 测试直接断言其文本。
- **快捷键的键位标识**（`Alt` / `Opt` / `Win` / `Cmd`、`Ctrl+Alt+f`、`RightArrow` …）
  —— 与 `parseInput()` 的 `switch (e.code)` 分支一一对应，改了就对不上真实按键。
- **提示条 / 弹窗文案**（`app.alert(...)`）—— 见下文「刻意不汉化的部分」。

---

## 与官方版本的差异

汉化通过**直接改写源码中的字符串字面量 + 一层渲染期查表**实现，差异收敛在以下范围：

```
src/core/operations/*.mjs          # 505 个操作的说明（description）
src/web/ArgNameZh.mjs              # 参数名中文显示词典（575 条，渲染层查表）
src/web/ArgHintZh.mjs              # 参数提示中文显示词典（14 条，渲染层查表）
src/web/CategoryZh.mjs             # 分类名中文显示词典（17 条，渲染层查表）
src/web/HTMLIngredient.mjs         # 参数名：this.name（中文显示）+ this.argName（英文原名）
src/web/HTMLCategory.mjs           # 分类：this.name（中文显示）+ this.catId（英文原名，用于 DOM id）
src/web/html/index.html            # 界面文案 + <html lang="zh-cmn-Hans">
src/web/App.mjs                    # 左侧栏「收藏」分类的帮助文案
src/web/waiters/BindingsWaiter.mjs # 快捷键表（#keybList，整表由 JS 模板生成）+ 帮助弹窗标题
src/web/utils/statusBar.mjs        # 输入 / 输出状态栏全部文案（渲染层查表，见下表）
```

> **参数名与分类名都不在源码层翻译**，只在界面渲染时查表显示中文。
> 它们同时是 Node.js API 的传参键、报错信息的一部分、DOM id 与样式选择器的来源、
> 以及上游测试的断言依据——在源码层改动会连带破坏这四处契约。

**状态栏的 `Input` / `Output` 也不在源码层翻译**，原因同上：
`statusBar.mjs` 有两处**功能判断**依赖它
（`updateTiming()` 的 `if (this.label === "Output" && this.timing)`、
`constructRHS()` 的 `if (this.label === "Input")`），
因此新增 `labelZh` 只用于拼渲染文案，`label` 本身保持英文。
行尾序列名另建 `EOL_NAME_ZH` 而非改 `editorUtils.mjs` 的 `eolCodeToName`，
因为后者被 `InputWaiter` / `OutputWaiter` 的英文提示条复用。

另含 **2 处 Windows 平台构建兼容性修复**（`webpack.config.js`）：
上游的正则使用了只匹配正斜杠的写法，在 Windows 的反斜杠路径下会失配，
导致构建报错。已改为字符类写法 `[\\/]` 以同时兼容两个平台。

### 上游文件改动说明

| 文件 | 改动原因 |
| --- | --- |
| `tests/node/tests/nodeApi.mjs` | 3 个 `chef.help` 断言硬编码英文说明原文，汉化后必然失败。已改为**语言无关 / 中文等效**断言，被测逻辑与断言强度均未降低。 |
| `tests/browser/browserUtils.js` | 烘焙按钮文本断言由 `"BAKE!"` 同步为「烘焙！」。 |
| `tests/browser/01_io.js` | 7 处 `.chr-enc-value` 断言由 `"Raw Bytes"` 同步为「原始字节」。下拉列表中真实字符集名（`UTF-8` 等）未动，其 link text 仍是 `setChrEnc()` 的定位依据。 |
| `src/web/waiters/ControlsWaiter.mjs` | ① 烘焙按钮文案汉化；② `bakeClick()` 原本用**按钮文案**判断该烘焙还是取消，汉化后两个分支都失配、点击失效，改用与语言无关的 `dataset.bakeFunc` 状态标识。 |

### 刻意不汉化的部分

- **操作名称、参数取值、密码学标识符** —— 见上文「刻意保留英文的内容」。
- **真实字符集名、行尾代码、快捷键键位** —— 见上文「刻意保留英文的内容」；
  其中字符集名与行尾代码同时是 URL 参数与 UI 测试断言的目标。
- **提示条 / 弹窗文案**（`app.alert(...)`）—— 官方 UI 测试直接断言这些字符串
  （如 `"Output character encoding has been detected and changed to UTF-8"`），
  改动会破坏测试契约。因此 `eolCodeToName`（`Line Feed`、`Carriage Return` …）
  也保持英文——它被 `InputWaiter` / `OutputWaiter` 的提示条复用；
  状态栏里另外用一张局部的中文名表 `EOL_NAME_ZH` 显示中文。

---

## 快速开始

### 方式一：直接下载（推荐）

前往 [Releases](https://github.com/Z2549/CyberChef_Chinese/releases) 下载
`CyberChef_v11.5.2_Chinese.zip`，解压后直接用浏览器打开 `index.html` 即可离线使用，
无需任何安装。

<details>
<summary>校验和</summary>

```
文件大小  83,203,457 字节
SHA-256   f7e6cd922dc4b24fee2c27087ffb09306696331f4abc47279b4e1a8ee674434c
```

</details>

### 方式二：Docker

```bash
docker build --tag cyberchef-zh --ulimit nofile=10000 .
docker run -it -p 8080:8080 cyberchef-zh
```

### 方式三：从源码构建

需要 Node.js（建议 22 LTS 及以上）。

```bash
npm install --legacy-peer-deps
npm run build          # 等价于 npx grunt prod
```

产物位于 `build/prod/`：

- `index.html` —— 可直接双击打开的单页应用
- `CyberChef_v11.5.2.zip` —— 完整离线包（Release 中重命名为 `CyberChef_v11.5.2_Chinese.zip`）
- `assets/`、`modules/`、`images/`

本地开发调试：

```bash
npm start              # npx grunt dev，默认 http://localhost:8080
```

---

## 功能验证

汉化仅改动文案，为确认未引入任何功能回归，执行了上游自带的完整测试套件：

| 测试套件 | 结果 |
| --- | --- |
| 操作测试 `tests/operations` | **2309 / 2309 通过** |
| Node API 测试 `tests/node` | **279 / 279 通过** |
| 浏览器 UI 测试 `tests/browser` | **2060 / 2062 通过**（见下方说明） |
| Node 消费方测试 `npm run testnodeconsumer` | 通过（CJS / ESM 按参数名传参均正常） |

```bash
# 复现方式（--openssl-legacy-provider 用于兼容 OpenSSL 3 下的 MD4/MD5）
node --no-warnings --no-deprecation --openssl-legacy-provider tests/operations/index.mjs

# 浏览器 UI 测试（需先构建 prod，并让 http://localhost:8000 指向 build/prod）
python -m http.server 8000 --directory build/prod
node node_modules/nightwatch/bin/nightwatch --env prod
```

> 说明 1：`Generate all hashes`、`LM Hash` 等用例依赖 MD4/MD5 等旧算法，
> 在 OpenSSL 3 环境下必须加 `--openssl-legacy-provider` 才能运行，
> 这是上游 `npm test` 脚本本身就带的参数，与本汉化无关。
>
> 说明 2：UI 测试失败的 2 条（`01_io.js:323` 与 `01_io.js:371`）依赖操作系统的
> 剪贴板键盘复制（`Ctrl+Ins` / `Shift+Ins`），在非系统前台窗口的自动化环境下
> 剪贴板内容拿不到，属环境性问题，与汉化无关。

---

## 许可与致谢

- 原始项目：[gchq/CyberChef](https://github.com/gchq/CyberChef)，作者
  [GCHQ](https://www.gchq.gov.uk/) 及众多贡献者。
- 本项目遵循上游的 **Apache License 2.0**，详见 [LICENSE](LICENSE)。
  原项目版权归原作者所有，本仓库仅提供简体中文文案的本地化改动。
- 若本汉化对您有帮助，欢迎 Star；发现翻译问题请提交 Issue。
