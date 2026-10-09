/**
 * @author devcydo [devcydo@gmail.com]
 * @author Ma Bingyao [mabingyao@gmail.com]
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2024
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import Utils from "../Utils.mjs";
import {encrypt} from "../lib/XXTEA.mjs";

/**
 * XXTEA Encrypt operation
 */
class XXTEAEncrypt extends Operation {

    /**
     * XXTEAEncrypt constructor
     */
    constructor() {
        super();

        this.name = "XXTEA Encrypt";
        this.module = "Ciphers";
        this.description =  "校正块 TEA（通常称为 XXTEA）是为了修正原始块 TEA 的弱点而设计的分组密码。XXTEA 以可变长度分组运算，分组大小为 32 位的任意倍数（最小 64 位）。完整周期数取决于分组大小，但至少有六个（分组较小时可达 32）。原始块 TEA 对分组中每个字应用 XTEA 轮函数，并与最左侧的邻居做加法结合。解密过程扩散速度慢这一弱点很快被利用来破解该密码。校正块 TEA 使用了更复杂的轮函数，在处理每个字时同时利用左右两个相邻字。";
        this.infoURL = "https://wikipedia.org/wiki/XXTEA";
        this.inputType = "ArrayBuffer";
        this.outputType = "ArrayBuffer";
        this.args = [
            {
                "name": "Key",
                "type": "toggleString",
                "value": "",
                "toggleValues": ["Hex", "UTF8", "Latin1", "Base64"]
            },
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        const key = new Uint8Array(Utils.convertToByteArray(args[0].string, args[0].option));
        return encrypt(new Uint8Array(input), key).buffer;
    }

}

export default XXTEAEncrypt;
