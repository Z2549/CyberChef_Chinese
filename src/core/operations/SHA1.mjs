/**
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import {runHash} from "../lib/Hash.mjs";

/**
 * SHA1 operation
 */
class SHA1 extends Operation {

    /**
     * SHA1 constructor
     */
    constructor() {
        super();

        this.name = "SHA1";
        this.module = "Crypto";
        this.description =   "SHA（安全散列算法）散列函数由美国国家安全局设计。SHA-1 是现有 SHA 散列函数中最成熟的一种，被广泛用于各种安全应用和协议中。<br><br>不过，随着新攻击的发现或改进，SHA-1/1 的抗碰撞能力也在减弱。默认情况下，消息摘要算法由 80 轮组成。";
        this.infoURL = "https://wikipedia.org/wiki/SHA-1";
        this.inputType = "ArrayBuffer";
        this.outputType = "string";
        this.args = [
            {
                name: "Rounds",
                type: "number",
                value: 80,
                min: 16
            }
        ];
    }

    /**
     * @param {ArrayBuffer} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        return runHash("sha1", input, {rounds: args[0]});
    }

}

export default SHA1;
