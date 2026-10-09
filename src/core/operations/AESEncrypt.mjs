/**
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import Utils from "../Utils.mjs";
import forge from "node-forge";
import OperationError from "../errors/OperationError.mjs";
import { toHexFast } from "../lib/Hex.mjs";

/**
 * AES Encrypt operation
 */
class AESEncrypt extends Operation {

    /**
     * AESEncrypt constructor
     */
    constructor() {
        super();

        this.name = "AES Encrypt";
        this.module = "Ciphers";
        this.description =   "高级加密标准（AES）是美国联邦信息处理标准（FIPS）。经过 5 年时间，对 15 种竞争设计进行了评估，最终选定了该标准。<br><br><b>Key:</b> 将根据密钥的大小使用以下算法:<ul><li>16 bytes = AES-128</li><li>24 bytes = AES-192</li><li>32 bytes = AES-256</li></ul>您可以使用K D F操作之一生成基于密码的密钥。<br><br><b>IV:</b> 初始化向量应该是16字节长。如果不输入，则默认为16个空字节。<br><br><b>填充:</b> 在 CBC 和 ECB 模式下，将使用 PKCS#7 填充。";
        this.infoURL = "https://wikipedia.org/wiki/Advanced_Encryption_Standard";
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
                "type": "argSelector",
                "value": [
                    {
                        name: "CBC",
                        off: [5]
                    },
                    {
                        name: "CFB",
                        off: [5]
                    },
                    {
                        name: "OFB",
                        off: [5]
                    },
                    {
                        name: "CTR",
                        off: [5]
                    },
                    {
                        name: "GCM",
                        on: [5]
                    },
                    {
                        name: "ECB",
                        off: [5]
                    },
                    {
                        name: "CBC/NoPadding",
                        off: [5]
                    },
                    {
                        name: "ECB/NoPadding",
                        off: [5]
                    }
                ]
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
            },
            {
                "name": "Additional Authenticated Data",
                "type": "toggleString",
                "value": "",
                "toggleValues": ["Hex", "UTF8", "Latin1", "Base64"]
            },
            {
                "name": "Include IV in output",
                "type": "option",
                "value": ["Off", "Prepend", "Append"]
            }
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     *
     * @throws {OperationError} if invalid key length
     */
    run(input, args) {
        const key = Utils.convertToByteString(args[0].string, args[0].option),
            iv = Utils.convertToByteString(args[1].string, args[1].option),
            mode = args[2].split("/")[0],
            noPadding = args[2].endsWith("NoPadding"),
            inputType = args[3],
            outputType = args[4],
            aad = Utils.convertToByteString(args[5].string, args[5].option),
            includeIV = args[6];

        if ([16, 24, 32].indexOf(key.length) < 0) {
            throw new OperationError(`Invalid key length: ${key.length} bytes

The following algorithms will be used based on the size of the key:
  16 bytes = AES-128
  24 bytes = AES-192
  32 bytes = AES-256`);
        }

        input = Utils.convertToByteString(input, inputType);

        // Handle NoPadding modes
        if (noPadding && input.length % 16 !== 0) {
            throw new OperationError("Input length must be a multiple of 16 bytes for NoPadding modes.");
        }
        const cipher = forge.cipher.createCipher("AES-" + mode, key);
        cipher.start({
            iv: iv,
            additionalData: mode === "GCM" ? aad : undefined
        });
        if (noPadding) {
            cipher.mode.pad = function (output, options) {
                return true;
            };
        }
        cipher.update(forge.util.createBuffer(input));
        cipher.finish();

        let output = cipher.output.getBytes();

        if (includeIV === "Prepend") {
            output = iv + output;
        } else if (includeIV === "Append") {
            output = output + iv;
        }

        if (outputType === "Hex") {
            output = toHexFast(Utils.strToByteArray(output));

            if (mode === "GCM") {
                return output + "\n\n" +
                    "Tag: " + cipher.mode.tag.toHex();
            }
        } else if (mode === "GCM") {
            return output + "\n\n" +
                "Tag: " + cipher.mode.tag.getBytes();
        }

        return output;
    }

}

export default AESEncrypt;
