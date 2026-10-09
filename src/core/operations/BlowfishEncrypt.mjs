/**
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import Utils from "../Utils.mjs";
import forge from "node-forge";
import OperationError from "../errors/OperationError.mjs";
import { Blowfish } from "../lib/Blowfish.mjs";

/**
 * Blowfish Encrypt operation
 */
class BlowfishEncrypt extends Operation {

    /**
     * BlowfishEncrypt constructor
     */
    constructor() {
        super();

        this.name = "Blowfish Encrypt";
        this.module = "Ciphers";
        this.description =   "Blowfish 是布鲁斯-施奈尔（Bruce Schneier）于 1993 年设计的一种对称密钥区块密码，被大量密码套件和加密产品所采用。AES 现在受到更多关注。<br><br><b>IV:</b> 初始化向量应该是8字节长。如果不输入，则默认为8个空字节。";
        this.infoURL = "https://wikipedia.org/wiki/Blowfish_(cipher)";
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
                "value": ["CBC", "CFB", "OFB", "CTR", "ECB"]
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
        const key = Utils.convertToByteString(args[0].string, args[0].option),
            iv = Utils.convertToByteString(args[1].string, args[1].option),
            mode = args[2],
            inputType = args[3],
            outputType = args[4];

        if (key.length < 4 || key.length > 56) {
            throw new OperationError(`Invalid key length: ${key.length} bytes

Blowfish's key length needs to be between 4 and 56 bytes (32-448 bits).`);
        }

        if (mode !== "ECB" && iv.length !== 8) {
            throw new OperationError(`Invalid IV length: ${iv.length} bytes. Expected 8 bytes.`);
        }

        input = Utils.convertToByteString(input, inputType);

        const cipher = Blowfish.createCipher(key, mode);
        cipher.start({iv: iv});
        cipher.update(forge.util.createBuffer(input));
        cipher.finish();

        if (outputType === "Hex") {
            return cipher.output.toHex();
        } else {
            return cipher.output.getBytes();
        }
    }

}

export default BlowfishEncrypt;
