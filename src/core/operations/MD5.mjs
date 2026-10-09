/**
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import {runHash} from "../lib/Hash.mjs";

/**
 * MD5 operation
 */
class MD5 extends Operation {

    /**
     * MD5 constructor
     */
    constructor() {
        super();

        this.name = "MD5";
        this.module = "Crypto";
        this.description =   "MD5（Message-Digest 5）是一种广泛使用的散列函数。它被用于各种安全应用，也常用于检查文件的完整性。<br><br>但是，MD5 不具有抗碰撞性，因此不适合 SSL/TLS 证书或数字签名等依赖这一特性的应用。";
        this.infoURL = "https://wikipedia.org/wiki/MD5";
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
        return runHash("md5", input);
    }

}

export default MD5;
