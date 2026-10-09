/**
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2023
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import OperationError from "../errors/OperationError.mjs";
import Utils from "../Utils.mjs";
import { toHexFast, fromHex } from "../lib/Hex.mjs";
import { CryptoGost, GostEngine } from "@wavesenterprise/crypto-gost-js/index.js";

/**
 * GOST Decrypt operation
 */
class GOSTDecrypt extends Operation {

    /**
     * GOSTDecrypt constructor
     */
    constructor() {
        super();

        this.name = "GOST Decrypt";
        this.module = "Ciphers";
        this.description =   "GOST 28147-89（RFC 5830）标准中定义的 GOST 区块密码（Magma）是一种苏联和俄罗斯政府标准的对称密钥区块密码，区块大小为 64 位。1989 年发布的原始标准没有为该密码命名，但该标准的最新修订版 GOST R 34.12-2015 （RFC 7801，RFC 8891）规定可将其称为 Magma。GOST 哈希函数基于该密码。新标准还规定了一种名为 Kuznyechik 的新 128 位块密码。<br><br>该标准制定于 20 世纪 70 年代，曾被标记为 'Top Secret' 然后降级为 'Secret' 于 1990 年出版。苏联解体后不久，该算法解密，并于 1994 年向公众公布。GOST 28147 是美国标准算法 DES 的苏联替代方案。因此，两者在结构上非常相似。";
        this.infoURL = "https://wikipedia.org/wiki/GOST_(block_cipher)";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [
            {
                name: "Key",
                type: "toggleString",
                value: "",
                toggleValues: ["Hex", "UTF8", "Latin1", "Base64"]
            },
            {
                name: "IV",
                type: "toggleString",
                value: "",
                toggleValues: ["Hex", "UTF8", "Latin1", "Base64"]
            },
            {
                name: "Input type",
                type: "option",
                value: ["Hex", "Raw"]
            },
            {
                name: "Output type",
                type: "option",
                value: ["Raw", "Hex"]
            },
            {
                name: "Algorithm",
                type: "argSelector",
                value: [
                    {
                        name: "GOST 28147 (1989)",
                        on: [5]
                    },
                    {
                        name: "GOST R 34.12 (Magma, 2015)",
                        off: [5]
                    },
                    {
                        name: "GOST R 34.12 (Kuznyechik, 2015)",
                        off: [5]
                    }
                ]
            },
            {
                name: "sBox",
                type: "option",
                value: ["E-TEST", "E-A", "E-B", "E-C", "E-D", "E-SC", "E-Z", "D-TEST", "D-A", "D-SC"]
            },
            {
                name: "Block mode",
                type: "option",
                value: ["ECB", "CFB", "OFB", "CTR", "CBC"]
            },
            {
                name: "Key meshing mode",
                type: "option",
                value: ["NO", "CP"]
            },
            {
                name: "Padding",
                type: "option",
                value: ["NO", "PKCS5", "ZERO", "RANDOM", "BIT"]
            }
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    async run(input, args) {
        const [keyObj, ivObj, inputType, outputType, version, sBox, blockMode, keyMeshing, padding] = args;

        const key = toHexFast(Utils.convertToByteArray(keyObj.string, keyObj.option));
        const iv = toHexFast(Utils.convertToByteArray(ivObj.string, ivObj.option));
        input = inputType === "Hex" ? input : toHexFast(Utils.strToArrayBuffer(input));

        let blockLength, versionNum;
        switch (version) {
            case "GOST 28147 (1989)":
                versionNum = 1989;
                blockLength = 64;
                break;
            case "GOST R 34.12 (Magma, 2015)":
                versionNum = 2015;
                blockLength = 64;
                break;
            case "GOST R 34.12 (Kuznyechik, 2015)":
                versionNum = 2015;
                blockLength = 128;
                break;
            default:
                throw new OperationError(`Unknown algorithm version: ${version}`);
        }

        const sBoxVal = versionNum === 1989 ? sBox : null;

        const algorithm = {
            version: versionNum,
            length: blockLength,
            mode: "ES",
            sBox: sBoxVal,
            block: blockMode,
            keyMeshing: keyMeshing,
            padding: padding
        };

        try {
            const Hex = CryptoGost.coding.Hex;
            if (iv) algorithm.iv = Hex.decode(iv);

            const cipher = GostEngine.getGostCipher(algorithm);
            const out = Hex.encode(cipher.decrypt(Hex.decode(key), Hex.decode(input)));

            return outputType === "Hex" ? out : Utils.byteArrayToChars(fromHex(out));
        } catch (err) {
            throw new OperationError(err);
        }
    }

}

export default GOSTDecrypt;
