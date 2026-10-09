/**
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import Utils from "../Utils.mjs";
import OperationError from "../errors/OperationError.mjs";
import forge from "node-forge";

/**
 * DES Decrypt operation
 */
class DESDecrypt extends Operation {

    /**
     * DESDecrypt constructor
     */
    constructor() {
        super();

        this.name = "DES Decrypt";
        this.module = "Ciphers";
        this.description =   "DES 是过去主流的加密算法，曾作为美国联邦信息处理标准（FIPS）正式发布。由于密钥长度较短，现已被认为不安全。<br><br><b>密钥：</b>DES 的密钥长度为 8 字节（64 位）。<br><br><b>IV：</b>初始化向量应为 8 字节长，未填写时默认使用 8 个空字节。<br><br><b>填充：</b>在 CBC 和 ECB 模式下，默认使用 PKCS#7 填充。";
        this.infoURL = "https://wikipedia.org/wiki/Data_Encryption_Standard";
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
                "value": ["Hex", "Raw"]
            },
            {
                "name": "Output",
                "type": "option",
                "value": ["Raw", "Hex"]
            }
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        const key = Utils.convertToByteString(args[0].string, args[0].option),
            iv = Utils.convertToByteArray(args[1].string, args[1].option),
            mode = args[2].substring(0, 3),
            noPadding = args[2].endsWith("NoPadding"),
            [,,, inputType, outputType] = args;

        if (key.length !== 8) {
            throw new OperationError(`Invalid key length: ${key.length} bytes

DES uses a key length of 8 bytes (64 bits).`);
        }
        if (iv.length !== 8 && mode !== "ECB") {
            throw new OperationError(`Invalid IV length: ${iv.length} bytes

DES uses an IV length of 8 bytes (64 bits).
Make sure you have specified the type correctly (e.g. Hex vs UTF8).`);
        }

        input = Utils.convertToByteString(input, inputType);

        const decipher = forge.cipher.createDecipher("DES-" + mode, key);

        /* Allow for a "no padding" mode */
        if (noPadding) {
            decipher.mode.unpad = function(output, options) {
                return true;
            };
        }

        decipher.start({iv: iv});
        decipher.update(forge.util.createBuffer(input));
        const result = decipher.finish();

        if (result) {
            return outputType === "Hex" ? decipher.output.toHex() : decipher.output.getBytes();
        } else {
            throw new OperationError("Unable to decrypt input with these parameters.");
        }
    }

}

export default DESDecrypt;
