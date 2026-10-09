/**
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import {runHash} from "../lib/Hash.mjs";

/**
 * Snefru operation
 */
class Snefru extends Operation {

    /**
     * Snefru constructor
     */
    constructor() {
        super();

        this.name = "Snefru";
        this.module = "Crypto";
        this.description =   "Snefru 是拉尔夫-默克尔 1990 年在施乐 PARC 工作时发明的一种加密哈希函数。该函数支持 128 位和 256 位输出。它以埃及法老 Sneferu 命名，延续了 Khufu 和 Khafre 块密码的传统。<br><br>Snefru 最初的设计被 Eli Biham 和 Adi Shamir 证明是不安全的，他们利用差分密码分析找到了哈希碰撞。随后，他们对设计进行了修改，将算法主通道的迭代次数从两次增加到八次。";
        this.infoURL = "https://wikipedia.org/wiki/Snefru";
        this.inputType = "ArrayBuffer";
        this.outputType = "string";
        this.args = [
            {
                name: "Size",
                type: "number",
                value: 128,
                min: 32,
                max: 480,
                step: 32
            },
            {
                name: "Rounds",
                type: "option",
                value: ["8", "4", "2"]
            }
        ];
    }

    /**
     * @param {ArrayBuffer} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        return runHash("snefru", input, {
            length: args[0],
            rounds: args[1]
        });
    }

}

export default Snefru;
