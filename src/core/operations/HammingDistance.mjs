/**
 * @author GCHQ Contributor [2]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import Utils from "../Utils.mjs";
import {fromHex} from "../lib/Hex.mjs";
import OperationError from "../errors/OperationError.mjs";

/**
 * Hamming Distance operation
 */
class HammingDistance extends Operation {

    /**
     * HammingDistance constructor
     */
    constructor() {
        super();

        this.name = "Hamming Distance";
        this.module = "Default";
        this.description =   "在信息论中，两个长度相等的字符串之间的汉明距离是对应符号不同的位置的数目。换句话说，它测量将一个字符串转换为另一个字符串所需的最小替换次数，或者可能将一个字符串转换为另一个字符串的最小错误次数。在更一般的上下文中，汉明距离是测量两个序列之间编辑距离的几个字符串度量之一。";
        this.infoURL = "https://wikipedia.org/wiki/Hamming_distance";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [
            {
                "name": "Delimiter",
                "type": "binaryShortString",
                "value": "\\n\\n"
            },
            {
                "name": "Unit",
                "type": "option",
                "value": ["Byte", "Bit"]
            },
            {
                "name": "Input type",
                "type": "option",
                "value": ["Raw string", "Hex"]
            }
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        const delim = args[0],
            byByte = args[1] === "Byte",
            inputType = args[2],
            samples = input.split(delim);

        if (samples.length !== 2) {
            throw new OperationError("Error: You can only calculate the edit distance between 2 strings. Please ensure exactly two inputs are provided, separated by the specified delimiter.");
        }

        if (samples[0].length !== samples[1].length) {
            throw new OperationError("Error: Both inputs must be of the same length.");
        }

        if (inputType === "Hex") {
            samples[0] = fromHex(samples[0]);
            samples[1] = fromHex(samples[1]);
        } else {
            samples[0] = new Uint8Array(Utils.strToArrayBuffer(samples[0]));
            samples[1] = new Uint8Array(Utils.strToArrayBuffer(samples[1]));
        }

        let dist = 0;

        for (let i = 0; i < samples[0].length; i++) {
            const lhs = samples[0][i],
                rhs = samples[1][i];

            if (byByte && lhs !== rhs) {
                dist++;
            } else if (!byByte) {
                let xord = lhs ^ rhs;

                while (xord) {
                    dist++;
                    xord &= xord - 1;
                }
            }
        }

        return dist.toString();
    }

}

export default HammingDistance;
