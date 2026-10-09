/**
 * @author tcode2k16 [tcode2k16@gmail.com]
 * @copyright Crown Copyright 2018
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import BigNumber from "bignumber.js";
import Utils from "../Utils.mjs";
import {toHexFast} from "../lib/Hex.mjs";

/**
 * To Base62 operation
 */
class ToBase62 extends Operation {

    /**
     * ToBase62 constructor
     */
    constructor() {
        super();

        this.name = "To Base62";
        this.module = "Default";
        this.description =   "Base62是一种使用一组有限的符号对任意字节数据进行编码的表示法，这些符号可以方便地由人类使用并由计算机处理。高基数会导致比十进制或十六进制系统更短的字符串。";
        this.infoURL = "https://wikipedia.org/wiki/List_of_numeral_systems";
        this.inputType = "ArrayBuffer";
        this.outputType = "string";
        this.args = [
            {
                name: "Alphabet",
                type: "string",
                value: "0-9A-Za-z"
            }
        ];
    }

    /**
     * @param {ArrayBuffer} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        input = new Uint8Array(input);
        if (input.length < 1) return "";

        const alphabet = Utils.expandAlphRange(args[0]).join("");
        const BN62 = BigNumber.clone({ ALPHABET: alphabet });

        input = toHexFast(input).toUpperCase();

        // Read number in as hex using normal alphabet
        const normalized = new BigNumber(input, 16);
        // Copy to BigNumber clone that uses the specified Base62 alphabet
        const number = new BN62(normalized);

        return number.toString(62);
    }

}

export default ToBase62;
