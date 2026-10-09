/**
 * @author Medjedtxm
 * @copyright Crown Copyright 2025
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import { toHexFast } from "../lib/Hex.mjs";
import JsAscon from "js-ascon";

/**
 * Ascon Hash operation
 */
class AsconHash extends Operation {

    /**
     * AsconHash constructor
     */
    constructor() {
        super();

        this.name = "Ascon Hash";
        this.module = "Crypto";
        this.description =  "Ascon-Hash256 生成固定的 256 位（32 字节）密码学散列值，符合 NIST SP 800-232 标准。Ascon 是一族轻量级认证加密与散列算法，专为 IoT 传感器、嵌入式系统等资源受限设备设计。<br><br>该算法在多年竞赛后，于 2023 年被 NIST 选为轻量级密码学的新标准。";
        this.infoURL = "https://wikipedia.org/wiki/Ascon_(cipher)";
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

        const inputUint8 = new Uint8Array(input);

        // Compute hash (returns Uint8Array)
        const hashResult = JsAscon.hash(inputUint8);

        // Convert to hex string
        return toHexFast(hashResult);
    }

}

export default AsconHash;
