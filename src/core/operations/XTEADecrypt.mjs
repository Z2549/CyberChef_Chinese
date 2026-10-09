/**
 * @author Medjedtxm
 * @copyright Crown Copyright 2026
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import Utils from "../Utils.mjs";
import OperationError from "../errors/OperationError.mjs";
import { toHex } from "../lib/Hex.mjs";
import { decryptXTEA, TEA_BLOCK_SIZE } from "../lib/TEA.mjs";

/**
 * XTEA Decrypt operation
 */
class XTEADecrypt extends Operation {

    /**
     * XTEADecrypt constructor
     */
    constructor() {
        super();

        this.name = "XTEA Decrypt";
        this.module = "Ciphers";
        this.description =  "XTEA（扩展微型加密算法）是由 David Wheeler 与 Roger Needham 于 1997 年设计的、作为 TEA 后继的分组密码，修正了原算法中发现的若干弱点。它以 64 位分组为单位、使用 128 位密钥，并采用改进的密钥编排，通过依赖 sum 的密钥字选择来抵抗相关密钥攻击。<br><br>XTEA 保留了 TEA 的简洁与紧凑实现，同时显著提升了安全性。由于其实现直观，在恶意软件分析与 CTF 题目中经常出现。<br><br><b>密钥：</b>必须恰好为 16 字节（128 位）。<br><br><b>IV：</b>初始化向量应为 8 字节（64 位）。未填写时默认使用空字节。<br><br><b>轮数：</b>推荐轮数为 32（默认）。Wheeler 与 Needham 的参考实现接受可配置的轮数。<br><br><b>填充：</b>在 CBC 和 ECB 模式下，采用 PKCS#5 填充方案。";
        this.infoURL = "https://wikipedia.org/wiki/XTEA";
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
            },
            {
                "name": "Rounds",
                "type": "number",
                "value": 32,
                "min": 1,
                "max": 255
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
            [,, mode, inputType, outputType, padding, rounds] = args;

        if (key.length !== 16)
            throw new OperationError(`Invalid key length: ${key.length} bytes

XTEA requires a key length of 16 bytes (128 bits).
Make sure you have specified the type correctly (e.g. Hex vs UTF8).`);

        if (iv.length !== TEA_BLOCK_SIZE && iv.length !== 0 && mode !== "ECB")
            throw new OperationError(`Invalid IV length: ${iv.length} bytes

XTEA uses an IV length of ${TEA_BLOCK_SIZE} bytes (${TEA_BLOCK_SIZE * 8} bits).
Make sure you have specified the type correctly (e.g. Hex vs UTF8).`);

        if (!Number.isInteger(rounds) || rounds < 1 || rounds > 255)
            throw new OperationError(`Invalid number of rounds: ${rounds}

Rounds must be an integer between 1 and 255. Standard XTEA uses 32 rounds.`);

        // Default IV to null bytes if empty (like AES)
        const actualIv = iv.length === 0 ? new Array(TEA_BLOCK_SIZE).fill(0) : iv;

        input = Utils.convertToByteArray(input, inputType);
        const output = decryptXTEA(input, key, actualIv, mode, padding, rounds);
        return outputType === "Hex" ? toHex(output, "") : Utils.byteArrayToUtf8(output);
    }

}

export default XTEADecrypt;
