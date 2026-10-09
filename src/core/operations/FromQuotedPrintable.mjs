/**
 * Some parts taken from mimelib (http://github.com/andris9/mimelib)
 * @author Andris Reinman
 * @license MIT
 *
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";

/**
 * From Quoted Printable operation
 */
class FromQuotedPrintable extends Operation {

    /**
     * FromQuotedPrintable constructor
     */
    constructor() {
        super();

        this.name = "From Quoted Printable";
        this.module = "Default";
        this.description =   "将 QP（Quoted-Printable）编码的文本还原为标准文本。该格式是电子邮件中常见的内容传输编码。<br><br>例：QP 编码字符串 <code>hello=20world</code> 变为 <code>hello world</code>";
        this.infoURL = "https://wikipedia.org/wiki/Quoted-printable";
        this.inputType = "string";
        this.outputType = "byteArray";
        this.args = [];
        this.checks = [
            {
                pattern: "^[\\x21-\\x3d\\x3f-\\x7e \\t]{0,76}(?:=[\\da-f]{2}|=\\r?\\n)(?:[\\x21-\\x3d\\x3f-\\x7e \\t]|=[\\da-f]{2}|=\\r?\\n)*$",
                flags: "i",
                args: []
            },
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {byteArray}
     */
    run(input, args) {
        const str = input.replace(/=(?:\r?\n|$)/g, "");

        const encodedBytesCount = (str.match(/=[\da-fA-F]{2}/g) || []).length,
            bufferLength = str.length - encodedBytesCount * 2,
            buffer = new Array(bufferLength);
        let chr, hex,
            bufferPos = 0;

        for (let i = 0, len = str.length; i < len; i++) {
            chr = str.charAt(i);
            if (chr === "=" && (hex = str.substr(i + 1, 2)) && /[\da-fA-F]{2}/.test(hex)) {
                buffer[bufferPos++] = parseInt(hex, 16);
                i += 2;
                continue;
            }
            buffer[bufferPos++] = chr.charCodeAt(0);
        }

        return buffer;
    }

}

export default FromQuotedPrintable;
