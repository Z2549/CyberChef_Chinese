/**
 * @author brun0ne [brunonblok@gmail.com]
 * @copyright Crown Copyright 2022
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import {runHash} from "../lib/Hash.mjs";

/**
 * NT Hash operation
 */
class NTHash extends Operation {

    /**
     * NTHash constructor
     */
    constructor() {
        super();

        this.name = "NT Hash";
        this.module = "Crypto";
        this.description =   "NT 哈希（有时也称为 NTLM 哈希）是一种在 Windows 系统上存储密码的方法。它的工作原理是在 UTF-16LE 编码输入上运行 MD4。NTLM 哈希值被认为很弱，因为使用现代硬件很容易被暴力破解。";
        this.infoURL = "https://wikipedia.org/wiki/NT_LAN_Manager";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        // Convert to UTF-16LE
        const buf = new ArrayBuffer(input.length * 2);
        const bufView = new Uint16Array(buf);
        for (let i = 0; i < input.length; i++) {
            bufView[i] = input.charCodeAt(i);
        }

        const hashed = runHash("md4", buf);
        return hashed.toUpperCase();
    }
}

export default NTHash;
