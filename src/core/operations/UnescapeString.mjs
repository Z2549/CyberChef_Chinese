/**
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import Utils from "../Utils.mjs";

/**
 * Unescape string operation
 */
class UnescapeString extends Operation {

    /**
     * UnescapeString constructor
     */
    constructor() {
        super();

        this.name = "Unescape string";
        this.module = "Default";
        this.description =   "对字符串中已转义的字符进行反转义。例如, <code>Don\\\\'t stop me now</code> 变成 <code>Don't stop me now</code>.<br><br>支持以下转义序列:<ul><li><code>\\\\n</code> (Line feed/newline)</li><li><code>\\\\r</code> (Carriage return)</li><li><code>\\\\t</code> (Horizontal tab)</li><li><code>\\\\b</code> (Backspace)</li><li><code>\\\\f</code> (Form feed)</li><li><code>\\\\nnn</code> (Octal, where n is 0-7)</li><li><code>\\\\xnn</code> (Hex, where n is 0-f)</li><li><code>\\\\\\\\</code> (Backslash)</li><li><code>\\\\'</code> (Single quote)</li><li><code>\\\\&quot;</code> (Double quote)</li><li><code>\\\\unnnn</code> (Unicode character)</li><li><code>\\\\u{nnnnnn}</code> (Unicode code point)</li></ul>";
        this.infoURL = "https://wikipedia.org/wiki/Escape_sequence";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        return Utils.parseEscapedChars(input);
    }

}

export default UnescapeString;
