/**
 * 操作参数提示（args[].hint）的中文显示词典。
 *
 * 与 ArgNameZh.mjs 同理：只在界面渲染时查表，不修改 args[].hint 本身，
 * 以保证上游测试与 API 行为完全不变。
 */

export default {
    "Bonus for adjacent matches": "相邻匹配的加分",
    "Bonus if match is uppercase and previous is lower": "匹配为大写、且前一个字符为小写时的加分",
    "Bonus if match occurs after a separator": "匹配出现在分隔符之后的加分",
    "Bonus if the first letter is matched": "匹配到首字母时的加分",
    "Drag and drop is enabled on this ingredient": "此参数支持拖放文件",
    "Hexadecimal, e.g. 0, 0x1000 or 1000h": "十六进制，例如 0、0x1000 或 1000h",
    "Hexadecimal, e.g. 16, 0xABC or ABCh": "十六进制，例如 16、0xABC 或 ABCh",
    "Maxiumum penalty for leading letters": "前导字母的最大惩罚值",
    "Penalty applied for every letter in the input before the first match": "首次匹配之前，对输入中每个字母所施加的惩罚",
    "Relevant for word and line": "对“单词”和“行”模式有效",
    "Remove non-alphabet letters and group output": "移除非字母字符，并按组输出",
    "SegWit witness version (0-16). Only used in Bitcoin SegWit mode.": "SegWit 见证版本（0-16），仅在比特币 SegWit 模式下使用。",
    "UUID namespace (UUID; valid for v3 and v5)": "UUID 命名空间（UUID；对 v3 与 v5 有效）",
    "UUID version": "UUID 版本"
};
