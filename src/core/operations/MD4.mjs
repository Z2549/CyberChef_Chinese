/**
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import {runHash} from "../lib/Hash.mjs";

/**
 * MD4 operation
 */
class MD4 extends Operation {

    /**
     * MD4 constructor
     */
    constructor() {
        super();

        this.name = "MD4";
        this.module = "Crypto";
        this.description =   "MD4（Message-Digest 4）算法是 Ronald Rivest 于 1990 年开发的一种加密散列函数。摘要长度为 128 位。该算法影响了后来的设计，如 MD5、SHA-1 和 RIPEMD 算法。<br><br>MD4 的安全性已严重受损。";
        this.infoURL = "https://wikipedia.org/wiki/MD4";
        this.inputType = "ArrayBuffer";
        this.outputType = "string";
        this.args = [];
    }

    /**
     * @param {ArrayBuffer} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        return runHash("md4", input);
    }

}

export default MD4;
