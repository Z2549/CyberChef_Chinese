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
| 分类名（Categories） | **17 / 17** | 同时同步修正了侧栏 DOM id 与样式表 |
| 界面文案（index.html） | **259 / 260** | 菜单、按钮、提示、帮助、设置项等 |

**刻意保留英文的内容**（不汉化，属设计选择）：

- **操作名称**（如 `To Base64`、`AES Decrypt`）—— 它是配方（Recipe）的标识符，
  汉化会导致链接、配方导入导出、`.chef` 文件全部失效。
- **参数取值**（如 `CBC`、`ECB`、`Hex`、`UTF8`）—— 同属功能值，不可翻译。
- **密码学标识符**（`Key`、`IV`、`Salt`、`Nonce`、`sBox`、`MAC`、`GCM Tag` 等）
  —— 与上游习惯保持一致，便于对照英文资料。

---

## 与官方版本的差异

汉化通过**直接改写源码中的字符串字面量**实现，因此完整差异收敛在两个目录内：

```
src/core/operations/*.mjs      # 505 个操作的说明 + 参数名
src/core/config/Categories.json # 17 个分类名
src/web/html/index.html        # 界面文案 + <html lang="zh-cmn-Hans">
```

另含 **2 处 Windows 平台构建兼容性修复**（`webpack.config.js`）：
上游的正则使用了只匹配正斜杠的写法，在 Windows 的反斜杠路径下会失配，
导致构建报错。已改为字符类写法 `[\\/]` 以同时兼容两个平台。

此外，`tests/node/tests/nodeApi.mjs` 中有 **3 个 `chef.help` 断言**原本硬编码了
英文说明原文，汉化后必然失败（CI 会因此变红）。已将其改为
**语言无关 / 中文等效**的断言——被测逻辑与断言强度均未降低，
仅去掉了对具体语言的依赖。

---

## 快速开始

### 方式一：直接下载（推荐）

前往 [Releases](https://github.com/Z2549/CyberChef_Chinese/releases) 下载
`CyberChef_v11.5.0_Chinese.zip`，解压后直接用浏览器打开 `index.html` 即可离线使用，
无需任何安装。

<details>
<summary>校验和</summary>

```
SHA-256  b2fe5e45c1174abfd1d2cc58829c66c7fc383f2334a83136a241c285978cf42f
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
- `CyberChef_v11.5.0.zip` —— 完整离线包（Release 中重命名为 `CyberChef_v11.5.0_Chinese.zip`）
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
| Node 消费方测试 `npm run testnodeconsumer` | 通过（CJS / ESM 按参数名传参均正常） |

```bash
# 复现方式（--openssl-legacy-provider 用于兼容 OpenSSL 3 下的 MD4/MD5）
node --no-warnings --no-deprecation --openssl-legacy-provider tests/operations/index.mjs
```

> 说明：`Generate all hashes`、`LM Hash` 等用例依赖 MD4/MD5 等旧算法，
> 在 OpenSSL 3 环境下必须加 `--openssl-legacy-provider` 才能运行，
> 这是上游 `npm test` 脚本本身就带的参数，与本汉化无关。

---

## 许可与致谢

- 原始项目：[gchq/CyberChef](https://github.com/gchq/CyberChef)，作者
  [GCHQ](https://www.gchq.gov.uk/) 及众多贡献者。
- 本项目遵循上游的 **Apache License 2.0**，详见 [LICENSE](LICENSE)。
  原项目版权归原作者所有，本仓库仅提供简体中文文案的本地化改动。
- 若本汉化对您有帮助，欢迎 Star；发现翻译问题请提交 Issue。
