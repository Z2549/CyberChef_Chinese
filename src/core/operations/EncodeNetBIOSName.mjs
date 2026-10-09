/**
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2017
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";

/**
 * Encode NetBIOS Name operation
 */
class EncodeNetBIOSName extends Operation {

    /**
     * EncodeNetBIOSName constructor
     */
    constructor() {
        super();

        this.name = "Encode NetBIOS Name";
        this.module = "Default";
        this.description =   "在 NetBIOS 客户端接口上看到的 NetBIOS 名称长度正好是 16 个字节。在 NetBIOS-over-TCP 协议中，使用的是更长的表示法。<br><br>编码分为两级。第一级编码将 NetBIOS 名称映射为域系统名称。  第二级编码将域系统名映射为 'compressed' 与域名系统交互所需的表示法。<br><br>该操作执行第一级编码。详见 RFC 1001。";
        this.infoURL = "https://wikipedia.org/wiki/NetBIOS";
        this.inputType = "byteArray";
        this.outputType = "byteArray";
        this.args = [
            {
                "name": "Offset",
                "type": "number",
                "value": 65
            }
        ];
    }

    /**
     * @param {byteArray} input
     * @param {Object[]} args
     * @returns {byteArray}
     */
    run(input, args) {
        const output = [],
            offset = args[0];

        if (input.length <= 16) {
            const len = input.length;
            input.length = 16;
            input.fill(32, len, 16);
            for (let i = 0; i < input.length; i++) {
                output.push((input[i] >> 4) + offset);
                output.push((input[i] & 0xf) + offset);
            }
        }

        return output;

    }

}

export default EncodeNetBIOSName;
