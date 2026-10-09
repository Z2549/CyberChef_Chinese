/**
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import {runHash} from "../lib/Hash.mjs";

/**
 * HAS-160 operation
 */
class HAS160 extends Operation {

    /**
     * HAS-160 constructor
     */
    constructor() {
        super();

        this.name = "HAS-160";
        this.module = "Crypto";
        this.description =   "HAS-160 是一种加密哈希函数，设计用于韩国 KCDSA 数字签名算法。它源于 SHA-1，并做了各种改动以提高其安全性。它的输出为 160 位。<br><br>HAS-160 的使用方法与 SHA-1 相同。首先，它将输入内容分成每个 512 比特的块，并填充最后一个块。摘要函数通过依次处理输入块来更新中间哈希值。<br><br>默认情况下，消息摘要算法包括 80 轮。";
        this.infoURL = "https://wikipedia.org/wiki/HAS-160";
        this.inputType = "ArrayBuffer";
        this.outputType = "string";
        this.args = [
            {
                name: "Rounds",
                type: "number",
                value: 80,
                min: 1,
                max: 80
            }
        ];
    }

    /**
     * @param {ArrayBuffer} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        return runHash("has160", input, {rounds: args[0]});
    }

}

export default HAS160;
