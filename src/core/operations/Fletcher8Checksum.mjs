/**
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import Utils from "../Utils.mjs";

/**
 * Fletcher-8 Checksum operation
 */
class Fletcher8Checksum extends Operation {

    /**
     * Fletcher8Checksum constructor
     */
    constructor() {
        super();

        this.name = "Fletcher-8 Checksum";
        this.module = "Crypto";
        this.description =   "弗莱彻校验和是一种计算位置相关校验和的算法，由劳伦斯利弗莫尔实验室的约翰·古尔德·弗莱彻在20世纪70年代末设计。<br><br>Fletcher校验和的目标是提供接近循环冗余校验的错误检测特性，但与求和技术相关的计算量较低。";
        this.infoURL = "https://wikipedia.org/wiki/Fletcher%27s_checksum";
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
        let a = 0,
            b = 0;
        input = new Uint8Array(input);

        for (let i = 0; i < input.length; i++) {
            a = (a + input[i]) % 0xf;
            b = (b + a) % 0xf;
        }

        return Utils.hex(((b << 4) | a) >>> 0, 2);
    }

}

export default Fletcher8Checksum;
