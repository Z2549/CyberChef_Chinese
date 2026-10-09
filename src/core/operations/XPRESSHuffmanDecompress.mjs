/**
 * @author MP Gowtham [gowthamrockerzzz@gmail.com]
 * @copyright Crown Copyright 2026
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import {decompressHuffman} from "../lib/XPRESS.mjs";

/**
 * XPRESS LZ77+Huffman Decompress operation
 */
class XPRESSHuffmanDecompress extends Operation {

    /**
     * XPRESS LZ77+Huffman Decompress constructor
     */
    constructor() {
        super();

        this.name = "XPRESS LZ77+Huffman Decompress";
        this.module = "Compression";
        this.description =  "使用 XPRESS LZ77+Huffman 算法解压数据（MS-XCA 第 2.2 节）。<br><br>必须先知道未压缩大小（来自 WOF 块表或 WIM 头），因此将其作为参数传入。";
        this.infoURL = "https://learn.microsoft.com/en-us/openspecs/windows_protocols/ms-xca/5655f4a3-6ba4-489b-959f-e1f407c52f15";
        this.inputType = "byteArray";
        this.outputType = "byteArray";
        this.args = [
            {
                "name": "Decompressed size",
                "type": "number",
                "value": 4096
            }
        ];
    }

    /**
     * @param {byteArray} input
     * @param {Object[]} args
     * @returns {byteArray}
     */
    run(input, args) {
        const size = args[0];
        return decompressHuffman(input, size);
    }

}

export default XPRESSHuffmanDecompress;
