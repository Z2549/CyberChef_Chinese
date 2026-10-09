/**
 * @author j83305 [awz22@protonmail.com]
 * @copyright Crown Copyright 2020
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import { calculateParityBit, decodeParityBit } from "../lib/ParityBit.mjs";

/**
 * Parity Bit operation
 */
class ParityBit extends Operation {

    /**
     * ParityBit constructor
     */
    constructor() {
        super();

        this.name = "Parity Bit";
        this.module = "Default";
        this.description =  "奇偶校验位（parity bit，又称校验位）是最简单的错误检测形式。它是添加到一串比特中的一位，表示该二进制串中 1 的个数是偶数还是奇数。<br><br>若指定了分隔符，则会对输入数据的每个“块”分别计算校验位，块通过在分隔符字符每次出现处切分输入来得到";
        this.infoURL = "https://wikipedia.org/wiki/Parity_bit";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [
            {
                name: "Mode",
                type: "option",
                value: [
                    "Even Parity",
                    "Odd Parity"
                ]
            },
            {
                name: "Postion",
                type: "option",
                value: [
                    "Start",
                    "End"
                ]
            },
            {
                name: "Encode or Decode",
                type: "option",
                value: [
                    "Encode",
                    "Decode"
                ]
            },
            {
                name: "Delimiter",
                type: "shortString",
                value: ""
            }
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        if (input.length === 0) {
            return input;
        }
        /**
         * determines weather to use the encode or decode method based off args[2]
         * @param input input to be encoded or decoded
         * @param args array
         */
        const method = (input, args) => args[2] === "Encode" ? calculateParityBit(input, args) : decodeParityBit(input, args);
        if (args[3].length > 0) {
            const byteStrings = input.split(args[3]);
            for (let byteStringsArrayIndex = 0; byteStringsArrayIndex < byteStrings.length; byteStringsArrayIndex++) {
                byteStrings[byteStringsArrayIndex] = method(byteStrings[byteStringsArrayIndex], args);
            }
            return byteStrings.join(args[3]);
        }
        return method(input, args);
    }

    /**
     * Highlight Parity Bit
     *
     * @param {Object[]} pos
     * @param {number} pos[].start
     * @param {number} pos[].end
     * @param {Object[]} args
     * @returns {Object[]} pos
     */
    highlight(pos, args) {
        if (args[3].length === 0) {
            if (args[1] === "Prepend") {
                pos[0].start += 1;
                pos[0].end += 1;
            }
            return pos;
        }
        // need to be able to read input to do the highlighting when there is a delimiter
    }

    /**
     * Highlight Parity Bit in reverse
     *
     * @param {Object[]} pos
     * @param {number} pos[].start
     * @param {number} pos[].end
     * @param {Object[]} args
     * @returns {Object[]} pos
     */
    highlightReverse(pos, args) {
        if (args[3].length === 0) {
            if (args[1] === "Prepend") {
                if (pos[0].start > 0) {
                    pos[0].start -= 1;
                }
                pos[0].end -= 1;
            }
            return pos;
        }
    }

}

export default ParityBit;
