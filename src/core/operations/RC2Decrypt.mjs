/**
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import Utils from "../Utils.mjs";
import forge from "node-forge";

/**
 * RC2 Decrypt operation
 */
class RC2Decrypt extends Operation {

    /**
     * RC2Decrypt constructor
     */
    constructor() {
        super();

        this.name = "RC2 Decrypt";
        this.module = "Ciphers";
        this.description =   "RC2（又称 ARC2）是罗恩-里维斯特于 1987 年设计的一种对称密钥块密码。 'RC' 代表 'Rivest Cipher'.<br><br><b>Key:</b> RC2 使用大小可变的密钥。<br><br><b>IV:</b> 要以 CBC 模式运行密码，初始化向量长度应为 8 字节。如果 IV 为空，密码将以 ECB 模式运行。<br><br><b>填充:</b> 在 CBC 和 ECB 模式下，都将使用 PKCS#7 填充。";
        this.infoURL = "https://wikipedia.org/wiki/RC2";
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
            iv = Utils.convertToByteString(args[1].string, args[1].option),
            [,, inputType, outputType] = args,
            decipher = forge.rc2.createDecryptionCipher(key);

        input = Utils.convertToByteString(input, inputType);

        decipher.start(iv || null);
        decipher.update(forge.util.createBuffer(input));
        decipher.finish();

        return outputType === "Hex" ? decipher.output.toHex() : decipher.output.getBytes();
    }

}

export default RC2Decrypt;
