/**
 * @author 0xThiebaut [thiebaut.dev]
 * @copyright Crown Copyright 2023
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import {decompress} from "../lib/LZNT1.mjs";

/**
 * LZNT1 Decompress operation
 */
class LZNT1Decompress extends Operation {

    /**
     * LZNT1 Decompress constructor
     */
    constructor() {
        super();

        this.name = "LZNT1 Decompress";
        this.module = "Compression";
        this.description =  "使用 LZNT1 算法解压数据。<br><br>与 Windows API <code>RtlDecompressBuffer</code> 类似。";
        this.infoURL = "https://learn.microsoft.com/en-us/openspecs/windows_protocols/ms-xca/5655f4a3-6ba4-489b-959f-e1f407c52f15";
        this.inputType = "byteArray";
        this.outputType = "byteArray";
        this.args = [];
    }

    /**
     * @param {byteArray} input
     * @param {Object[]} args
     * @returns {byteArray}
     */
    run(input, args) {
        return decompress(input);
    }

}

export default LZNT1Decompress;
