/**
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";

/**
 * URL Encode operation
 */
class URLEncode extends Operation {

    /**
     * URLEncode constructor
     */
    constructor() {
        super();

        this.name = "URL Encode";
        this.module = "URL";
        this.description =   "将有问题的字符编码为百分比编码，这是一种由 URIs/URL 支持的格式。<br><br>例： <code>=</code> 变成 <code>%3d</code>";
        this.infoURL = "https://wikipedia.org/wiki/Percent-encoding";
        this.inputType = "byteArray";
        this.outputType = "string";
        this.args = [
            {
                "name": "Encode all special chars",
                "type": "boolean",
                "value": false
            }
        ];
    }

    /**
     * @param {byteArray} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        const encodeAll = args[0];
        return this.encodeBytes(input, encodeAll);
    }

    /**
     * Encode bytes in URL using percent encoding.
     *
     * @param {byteArray} bytes
     * @param {boolean} encodeAll
     * @returns {string}
     */
    encodeBytes(bytes, encodeAll) {
        const safeChars = encodeAll ?
            /^[A-Za-z0-9]$/ :
            /^[A-Za-z0-9:/?#[\]@!$&'()*+,;=%]$/;

        let output = "";

        for (const byte of bytes) {
            const char = String.fromCharCode(byte);

            output += safeChars.test(char) ?
                char :
                "%" + byte.toString(16).toUpperCase().padStart(2, "0");
        }

        return output;
    }

}


export default URLEncode;
