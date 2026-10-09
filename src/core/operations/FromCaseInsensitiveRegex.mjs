/**
 * @author masq [github.cyberchef@masq.cc]
 * @copyright Crown Copyright 2018
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";

/**
 * From Case Insensitive Regex operation
 */
class FromCaseInsensitiveRegex extends Operation {

    /**
     * FromCaseInsensitiveRegex constructor
     */
    constructor() {
        super();

        this.name = "From Case Insensitive Regex";
        this.module = "Default";
        this.description =   "将不区分大小写的 regex 字符串转换为区分大小写的 regex 字符串（不保证是正确的原始大小写），以防 i 标志当时不可用而现在可用，或者需要重新区分大小写。<br><br>例： <code>[mM][oO][zZ][iI][lL][lL][aA]/[0-9].[0-9] .*</code> 变成 <code>Mozilla/[0-9].[0-9] .*</code>";
        this.infoURL = "https://wikipedia.org/wiki/Regular_expression";
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
        return input.replace(/\[[a-z]{2}\]/ig, m => m[1].toUpperCase() === m[2].toUpperCase() ? m[1] : m);
    }
}

export default FromCaseInsensitiveRegex;
