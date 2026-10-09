/**
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import punycode from "punycode.js";

/**
 * To Punycode operation
 */
class ToPunycode extends Operation {

    /**
     * ToPunycode constructor
     */
    constructor() {
        super();

        this.name = "To Punycode";
        this.module = "Encodings";
        this.description =   "Punycode 是一种用域名系统支持的有限 ASCII 字符子集表示 Unicode 的方法。<br><br>例： <code>münchen</code> 编码为 <code>mnchen-3ya</code>";
        this.infoURL = "https://wikipedia.org/wiki/Punycode";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [
            {
                "name": "Internationalised domain name",
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
        const idn = args[0];

        if (idn) {
            return punycode.toASCII(input);
        } else {
            return punycode.encode(input);
        }
    }

}

export default ToPunycode;
