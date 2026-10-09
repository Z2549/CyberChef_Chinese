/**
 * @author Medjedtxm
 * @copyright Crown Copyright 2026
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import Utils from "../Utils.mjs";
import OperationError from "../errors/OperationError.mjs";
import { toHex } from "../lib/Hex.mjs";
import { decryptRC6, getBlockSize, getDefaultRounds } from "../lib/RC6.mjs";

/**
 * RC6 Decrypt operation
 */
class RC6Decrypt extends Operation {

    /**
     * RC6Decrypt constructor
     */
    constructor() {
        super();

        this.name = "RC6 Decrypt";
        this.module = "Ciphers";
        this.description =  "RC6 是一种由 RC5 派生的对称密钥分组密码。它由 Ron Rivest、Matt Robshaw、Ray Sidney 和 Yiqun Lisa Yin 设计，为满足 AES 竞赛的要求而提出，并进入五强决赛。<br><br>RC6 的参数形式为 RC6-w/r/b，其中 w 为以比特为单位的字长（8–256 之间任意 8 的倍数），r 为轮数（1–255），b 为以字节为单位的密钥长度。AES 标准提交版本使用 w=32、r=20。常见字长：8、16、32（标准）、64、128。<br><br><b>IV：</b>初始化向量应为 4*w/8 字节（例如 w=32 时为 16 字节）。未填写时默认使用空字节。<br><br><b>填充：</b>在 CBC 和 ECB 模式下，采用 PKCS#7 填充方案。";
        this.infoURL = "https://wikipedia.org/wiki/RC6";
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
                "name": "Word Size",
                "type": "number",
                "value": 32,
                "min": 8,
                "max": 256,
                "step": 8
            },
            {
                "name": "Rounds",
                "type": "number",
                "value": 20,
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
            [,, mode, inputType, outputType, padding, wordSize, rounds] = args;

        // Validate word size
        if (!Number.isInteger(wordSize) || wordSize < 8 || wordSize > 256 || wordSize % 8 !== 0)
            throw new OperationError(`Invalid word size: ${wordSize}. Must be a multiple of 8 between 8 and 256.`);

        const blockSize = getBlockSize(wordSize);
        const defaultRounds = getDefaultRounds(wordSize);

        if (iv.length !== blockSize && iv.length !== 0 && mode !== "ECB")
            throw new OperationError(`Invalid IV length: ${iv.length} bytes

RC6-${wordSize} uses an IV length of ${blockSize} bytes (${blockSize * 8} bits).
Make sure you have specified the type correctly (e.g. Hex vs UTF8).`);

        if (!Number.isInteger(rounds) || rounds < 1 || rounds > 255)
            throw new OperationError(`Invalid number of rounds: ${rounds}

Rounds must be an integer between 1 and 255. Standard for w=${wordSize} is ${defaultRounds}.`);

        // Default IV to null bytes if empty (like AES)
        const actualIv = iv.length === 0 ? new Array(blockSize).fill(0) : iv;

        input = Utils.convertToByteArray(input, inputType);
        const output = decryptRC6(input, key, actualIv, mode, padding, rounds, wordSize);
        return outputType === "Hex" ? toHex(output, "") : Utils.byteArrayToUtf8(output);
    }

}

export default RC6Decrypt;
