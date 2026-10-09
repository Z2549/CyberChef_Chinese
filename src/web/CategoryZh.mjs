/**
 * 操作分类名的中文显示词典。
 *
 * 重要：本词典只用于「界面显示」，不修改 Categories.json 中的分类名。
 * 原因：分类名会被 HTMLCategory 拼成 DOM id（`cat` + 去掉空格/斜杠等符号的名字）：
 *   const catName = "cat" + this.name.replace(/[\s/\-:_]/g, "");
 * 该 id 属于稳定标识符，被以下位置依赖：
 *   1) src/web/html/index.html 的 data-help-proxy="a[data-target='#catFavourites']"
 *   2) src/web/stylesheets/components/_list.css 的 .category-title[href='#catFavourites']
 *   3) 上游 UI 测试 tests/browser/00_nightwatch.js（#catFavourites、#catOther）
 * 直接汉化分类名会让 id 变成中文，导致上述引用与 UI 测试全部失效，
 * 因此改为在渲染层做一层查表。
 */

export default {
    "Favourites": "收藏",
    "Data format": "数据格式",
    "Encryption / Encoding": "加密 / 编码",
    "Public Key": "公钥",
    "Arithmetic / Logic": "算术 / 逻辑",
    "Networking": "网络",
    "Language": "语言",
    "Utils": "实用工具",
    "Date / Time": "日期 / 时间",
    "Extractors": "提取器",
    "Compression": "压缩",
    "Hashing": "哈希",
    "Code tidy": "代码整理",
    "Forensics": "取证",
    "Multimedia": "多媒体",
    "Other": "其他",
    "Flow control": "流程控制"
};
