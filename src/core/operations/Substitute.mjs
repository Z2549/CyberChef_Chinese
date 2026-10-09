/**
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import Utils from "../Utils.mjs";

/**
 * Substitute operation
 */
class Substitute extends Operation {

    /**
     * Substitute constructor
     */
    constructor() {
        super();

        this.name = "Substitute";
        this.module = "Default";
        this.description =   "一种替换密码，允许您指定要用其他字节值替换的字节。这可以用于创建Caesar密码，但功能更强大，因为可以替换任何字节值，而不仅仅是字母，并且替换值不必按顺序排列。<br><br>在明文字段中输入要替换的字节，在密文字段中输入要替换的字节。<br><br>不可打印字节可以使用字符串转义符号指定。例如，换行字符可以写成<code>\\\\n</code> 或者 <code>\\\\x0a</code>.<br><br>可以使用连字符指定字节范围。例如，序列 <code>0123456789</code> 可以写成 <code>0-9</code>.<br><br>请注意，黑斜杠字符用于转义特殊字符，因此如果您想单独使用它们，则需要对它们进行转义 (例：<code>\\\\\\\\</code>).";
        this.infoURL = "https://wikipedia.org/wiki/Substitution_cipher";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [
            {
                "name": "Plaintext",
                "type": "binaryString",
                "value": "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
            },
            {
                "name": "Ciphertext",
                "type": "binaryString",
                "value": "XYZABCDEFGHIJKLMNOPQRSTUVW"
            },
            {
                "name": "Ignore case",
                "type": "boolean",
                "value": false
            }
        ];
    }

    /**
     * Convert a single character using the dictionary, if ignoreCase is true then
     * check in the dictionary for both upper and lower case versions of the character.
     * In output the input character case is preserved.
     * @param {string} char
     * @param {Object} dict
     * @param {boolean} ignoreCase
     * @returns {string}
     */
    cipherSingleChar(char, dict, ignoreCase) {
        if (!ignoreCase)
            return dict[char] || char;

        const isUpperCase = char === char.toUpperCase();

        // convert using the dictionary keeping the case of the input character

        if (dict[char] !== undefined) {
            // if the character is in the dictionary return the value with the input case
            return isUpperCase ? dict[char].toUpperCase() : dict[char].toLowerCase();
        }

        // check for the other case, if it is in the dictionary return the value with the right case
        if (isUpperCase) {
            if (dict[char.toLowerCase()] !== undefined)
                return dict[char.toLowerCase()].toUpperCase();
        } else {
            if (dict[char.toUpperCase()] !== undefined)
                return dict[char.toUpperCase()].toLowerCase();
        }

        return char;
    }


    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        const plaintext = Utils.expandAlphRange([...args[0]]),
            ciphertext = Utils.expandAlphRange([...args[1]]),
            ignoreCase = args[2];
        let output = "";

        if (plaintext.length !== ciphertext.length) {
            output = "Warning: Plaintext and Ciphertext lengths differ\n\n";
        }

        // create dictionary for conversion
        const dict = {};
        for (let i = 0; i < Math.min(ciphertext.length, plaintext.length); i++) {
            dict[plaintext[i]] = ciphertext[i];
        }

        // map every letter with the conversion function
        for (const character of input) {
            output += this.cipherSingleChar(character, dict, ignoreCase);
        }

        return output;
    }

}

export default Substitute;
