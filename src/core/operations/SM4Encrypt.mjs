/**
 * @author swesven
 * @copyright 2021
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import Utils from "../Utils.mjs";
import OperationError from "../errors/OperationError.mjs";
import { toHex } from "../lib/Hex.mjs";
import { encryptSM4 } from "../lib/SM4.mjs";

/**
 * SM4 Encrypt operation
 */
class SM4Encrypt extends Operation {

    /**
     * SM4Encrypt constructor
     */
    constructor() {
        super();

        this.name = "SM4 Encrypt";
        this.module = "Ciphers";
        this.description =   "SM4 是一种 128 位的区块密码，目前已被确立为中国国家标准（GB/T 32907-2016）。支持多种块密码模式。使用 CBC 或 ECB 模式时，使用 PKCS#7 填充方案。";
        this.infoURL = "https://wikipedia.org/wiki/SM4_(cipher)";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [
            {
                "name": "Key",
                "type": "toggleString",
                "value": "",
                "toggleValues": ["Hex", "UTF8", "Latin1", "Base64"]
            },
            {
                "name": "IV",
                "type": "toggleString",
                "value": "",
                "toggleValues": ["Hex", "UTF8", "Latin1", "Base64"]
            },
            {
                "name": "Mode",
                "type": "option",
                "value": ["CBC", "CFB", "OFB", "CTR", "ECB", "CBC/NoPadding", "ECB/NoPadding"]
            },
            {
                "name": "Input",
                "type": "option",
                "value": ["Raw", "Hex"]
            },
            {
                "name": "Output",
                "type": "option",
                "value": ["Hex", "Raw"]
            }
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        const key = Utils.convertToByteArray(args[0].string, args[0].option),
            iv = Utils.convertToByteArray(args[1].string, args[1].option),
            [,, mode, inputType, outputType] = args;

        if (key.length !== 16)
            throw new OperationError(`Invalid key length: ${key.length} bytes

SM4 uses a key length of 16 bytes (128 bits).`);
        if (iv.length !== 16 && !mode.startsWith("ECB"))
            throw new OperationError(`Invalid IV length: ${iv.length} bytes

SM4 uses an IV length of 16 bytes (128 bits).
Make sure you have specified the type correctly (e.g. Hex vs UTF8).`);

        input = Utils.convertToByteArray(input, inputType);
        const output = encryptSM4(input, key, iv, mode.substring(0, 3), mode.endsWith("NoPadding"));
        return outputType === "Hex" ? toHex(output) : Utils.byteArrayToUtf8(output);
    }

}

export default SM4Encrypt;
