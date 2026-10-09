/**
 * @author Medjedtxm
 * @copyright Crown Copyright 2026
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import Utils from "../Utils.mjs";
import OperationError from "../errors/OperationError.mjs";
import { toHex } from "../lib/Hex.mjs";
import { decryptTEA, TEA_BLOCK_SIZE } from "../lib/TEA.mjs";

/**
 * TEA Decrypt operation
 */
class TEADecrypt extends Operation {

    /**
     * TEADecrypt constructor
     */
    constructor() {
        super();

        this.name = "TEA Decrypt";
        this.module = "Ciphers";
        this.description =  "TEA（微型加密算法）是由 David Wheeler 与 Roger Needham 于 1994 年设计的分组密码。它以 64 位分组为单位、使用 128 位密钥，执行 32 个周期（64 轮 Feistel 结构），DELTA 常量为 0x9E3779B9，取自黄金比例。<br><br>TEA 以其简洁与实现紧凑著称，因此在恶意软件分析与 CTF 题目中经常出现。尽管设计优雅，TEA 存在已知弱点，包括等价密钥与易受相关密钥攻击，因而衍生出后继的 XTEA 与 XXTEA。<br><br><b>密钥：</b>必须恰好为 16 字节（128 位）。<br><br><b>IV：</b>初始化向量应为 8 字节（64 位）。未填写时默认使用空字节。<br><br><b>填充：</b>在 CBC 和 ECB 模式下，采用 PKCS#5 填充方案。";
        this.infoURL = "https://wikipedia.org/wiki/Tiny_Encryption_Algorithm";
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
                "value": ["Hex", "Raw"]
            },
            {
                "name": "Output",
                "type": "option",
                "value": ["Raw", "Hex"]
            },
            {
                "name": "Padding",
                "type": "option",
                "value": ["PKCS5", "NO", "ZERO", "RANDOM", "BIT"]
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
            [,, mode, inputType, outputType, padding] = args;

        if (key.length !== 16)
            throw new OperationError(`Invalid key length: ${key.length} bytes

TEA requires a key length of 16 bytes (128 bits).
Make sure you have specified the type correctly (e.g. Hex vs UTF8).`);

        if (iv.length !== TEA_BLOCK_SIZE && iv.length !== 0 && mode !== "ECB")
            throw new OperationError(`Invalid IV length: ${iv.length} bytes

TEA uses an IV length of ${TEA_BLOCK_SIZE} bytes (${TEA_BLOCK_SIZE * 8} bits).
Make sure you have specified the type correctly (e.g. Hex vs UTF8).`);

        // Default IV to null bytes if empty (like AES)
        const actualIv = iv.length === 0 ? new Array(TEA_BLOCK_SIZE).fill(0) : iv;

        input = Utils.convertToByteArray(input, inputType);
        const output = decryptTEA(input, key, actualIv, mode, padding);
        return outputType === "Hex" ? toHex(output, "") : Utils.byteArrayToUtf8(output);
    }

}

export default TEADecrypt;
