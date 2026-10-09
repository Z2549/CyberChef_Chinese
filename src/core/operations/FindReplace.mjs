/**
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2018
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import Utils from "../Utils.mjs";
import XRegExp from "xregexp";

/**
 * Find / Replace operation
 */
class FindReplace extends Operation {

    /**
     * FindReplace constructor
     */
    constructor() {
        super();

        this.name = "Find / Replace";
        this.module = "Regex";
        this.description =  "将所有出现的第一个字符串替换为第二个字符串。<br><br>支持正则表达式（regex）、普通字符串和扩展字符串（支持 \\n、\\r、\\t、\\b、\\f 以及使用 \\x 记法的转义十六进制字节，例如 \\x00 表示空字节）。";
        this.infoURL = "https://wikipedia.org/wiki/Regular_expression";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [
            {
                "name": "Find",
                "type": "toggleString",
                "value": "",
                "toggleValues": ["Regex", "Extended (\\n, \\t, \\x...)", "Simple string"]
            },
            {
                "name": "Replace",
                "type": "binaryString",
                "value": ""
            },
            {
                "name": "Global match",
                "type": "boolean",
                "value": true
            },
            {
                "name": "Case insensitive",
                "type": "boolean",
                "value": false
            },
            {
                "name": "Multiline matching",
                "type": "boolean",
                "value": true
            },
            {
                "name": "Dot matches all",
                "type": "boolean",
                "value": false
            }
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        const [{option: type}, replace, g, i, m, s] = args;
        let find = args[0].string,
            modifiers = "";

        if (g) modifiers += "g";
        if (i) modifiers += "i";
        if (m) modifiers += "m";
        if (s) modifiers += "s";

        if (type === "Regex") {
            find = new XRegExp(find, modifiers);
            return input.replace(find, replace);
        }

        if (type.indexOf("Extended") === 0) {
            find = Utils.parseEscapedChars(find);
        }

        find = new XRegExp(Utils.escapeRegex(find), modifiers);

        return input.replace(find, replace);
    }

}

export default FindReplace;
