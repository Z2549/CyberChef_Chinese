/**
 * @author HarelKatz [github.com/HarelKatz]
 * @copyright Crown Copyright 2026
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";

/**
 * Escape Smart Characters operation
 */
class EscapeSmartCharacters extends Operation {

    /**
     * EscapeSmartCharacters constructor
     */
    constructor() {
        super();

        this.name = "Escape Smart Characters";
        this.module = "Default";
        this.description =  "将智能（排版用）Unicode 字符——例如弯引号、em/en 破折号、省略号、©、®、™、箭头——转换为对应的普通 ASCII 字符。<br><br>没有 ASCII 映射的字符（如 <code>☣</code>）按“无法映射的字符”选项处理。<br><br>例：<code>“Hello” — world…</code> 变为 <code>\"Hello\" -- world...</code>";
        this.infoURL = "";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [
            {
                name: "Unmappable characters",
                type: "option",
                value: ["Include", "Remove", "Replace with '.'"]
            }
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        const [unmappable] = args;
        let result = "";
        for (const ch of input) {
            if (ch.codePointAt(0) < 128) {
                result += ch;
            } else if (Object.prototype.hasOwnProperty.call(SMART_MAP, ch)) {
                result += SMART_MAP[ch];
            } else {
                switch (unmappable) {
                    case "Remove":
                        break;
                    case "Replace with '.'":
                        result += ".";
                        break;
                    case "Include":
                    default:
                        result += ch;
                        break;
                }
            }
        }
        return result;
    }

}

const SMART_MAP = {
    // Smart double quotes
    "“": "\"",   // “ left double quotation mark
    "”": "\"",   // ” right double quotation mark
    "„": "\"",   // „ double low-9 quotation mark
    "‟": "\"",   // ‟ double high-reversed-9 quotation mark
    "″": "\"",   // ″ double prime

    // Smart single quotes / apostrophes
    "‘": "'",    // ‘ left single quotation mark
    "’": "'",    // ’ right single quotation mark / apostrophe
    "‚": "'",    // ‚ single low-9 quotation mark
    "‛": "'",    // ‛ single high-reversed-9 quotation mark
    "′": "'",    // ′ prime

    // Dashes & hyphens
    "‐": "-",    // ‐ hyphen
    "‑": "-",    // ‑ non-breaking hyphen
    "‒": "-",    // ‒ figure dash
    "–": "-",    // – en dash
    "—": "--",   // — em dash
    "―": "--",   // ― horizontal bar

    // Ellipsis
    "…": "...",  // …

    // Trademark / copyright symbols
    "©": "(c)",  // ©
    "®": "(r)",  // ®
    "™": "(tm)", // ™

    // Arrows
    "←": "<--",  // ←
    "→": "-->",  // →
    "↑": "^",    // ↑
    "↓": "v",    // ↓
    "↔": "<->",  // ↔
    "⇐": "<==",  // ⇐
    "⇒": "==>",  // ⇒
    "⇔": "<=>",  // ⇔

    // Guillemets
    "«": "<<",   // «
    "»": ">>",   // »
    "‹": "<",    // ‹
    "›": ">",    // ›

    // Math & misc symbols
    "×": "x",    // ×
    "÷": "/",    // ÷
    "±": "+/-",  // ±
    "•": "*",    // •
    "·": ".",    // ·

    // Non-ASCII spaces
    "\u00A0": " ",    // NBSP
    "\u2002": " ",    // en space
    "\u2003": " ",    // em space
    "\u2009": " ",    // thin space
    "\u200A": " "     // hair space
};

export default EscapeSmartCharacters;
