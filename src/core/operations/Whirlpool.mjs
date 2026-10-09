/**
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import {runHash} from "../lib/Hash.mjs";

/**
 * Whirlpool operation
 */
class Whirlpool extends Operation {

    /**
     * Whirlpool constructor
     */
    constructor() {
        super();

        this.name = "Whirlpool";
        this.module = "Crypto";
        this.description =   "Whirlpool 是一种加密散列函数，由 Vincent Rijmen（AES 的共同创建者之一）和 Paulo S. L. M. Barreto 设计，他们于 2000 年首次对其进行了描述。<br><br>有几种变体：<ul><li>Whirlpool-0 是 2000 年发布的原始版本.</li><li>Whirlpool-T 是 2001 年发布的第一个修订版，改进了 s-box 的世代。</li><li>Whirlpool 是 2003 年发布的最新版本，修正了扩散矩阵中的一个缺陷。</li></ul>";
        this.infoURL = "https://wikipedia.org/wiki/Whirlpool_(cryptography)";
        this.inputType = "ArrayBuffer";
        this.outputType = "string";
        this.args = [
            {
                name: "Variant",
                type: "option",
                value: ["Whirlpool", "Whirlpool-T", "Whirlpool-0"]
            },
            {
                name: "Rounds",
                type: "number",
                value: 10,
                min: 1,
                max: 10
            }
        ];
    }

    /**
     * @param {ArrayBuffer} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        const variant = args[0].toLowerCase();
        return runHash(variant, input, {rounds: args[1]});
    }

}

export default Whirlpool;
