/**
 * @author Medjedtxm
 * @copyright Crown Copyright 2025
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import { encode } from "../lib/Bech32.mjs";
import { fromHex } from "../lib/Hex.mjs";

/**
 * To Bech32 operation
 */
class ToBech32 extends Operation {

    /**
     * ToBech32 constructor
     */
    constructor() {
        super();

        this.name = "To Bech32";
        this.module = "Default";
        this.description =  "Bech32 是一种主要用于比特币 SegWit 地址（BIP-0173）的编码方案。它使用 32 个字符的字母表，排除了易混淆字符（1、b、i、o），并包含用于错误检测的校验和。<br><br>Bech32m（BIP-0350）是一个更新版本，修复了原 Bech32 校验和的一个弱点，用于比特币 Taproot 地址。<br><br>人类可读部分（HRP）标识网络或用途（例如 'bc' 表示比特币主网，'tb' 表示测试网，'age' 表示 AGE 加密密钥）。<br><br>按规范，最大输出长度为 90 个字符。";
        this.infoURL = "https://wikipedia.org/wiki/Bech32";
        this.inputType = "ArrayBuffer";
        this.outputType = "string";
        this.args = [
            {
                "name": "Human-Readable Part (HRP)",
                "type": "string",
                "value": "bc"
            },
            {
                "name": "Encoding",
                "type": "option",
                "value": ["Bech32", "Bech32m"]
            },
            {
                "name": "Input Format",
                "type": "option",
                "value": ["Raw bytes", "Hex"]
            },
            {
                "name": "Mode",
                "type": "option",
                "value": ["Generic", "Bitcoin SegWit"]
            },
            {
                "name": "Witness Version",
                "type": "number",
                "value": 0,
                "hint": "SegWit witness version (0-16). Only used in Bitcoin SegWit mode."
            }
        ];
    }

    /**
     * @param {ArrayBuffer} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        const hrp = args[0];
        const encoding = args[1];
        const inputFormat = args[2];
        const mode = args[3];
        const witnessVersion = args[4];

        let inputArray;
        if (inputFormat === "Hex") {
            // Convert hex string to bytes
            const hexStr = new TextDecoder().decode(new Uint8Array(input)).replace(/\s/g, "");
            inputArray = fromHex(hexStr);
        } else {
            inputArray = new Uint8Array(input);
        }

        if (mode === "Bitcoin SegWit") {
            // Prepend witness version to the input data
            const withVersion = new Uint8Array(inputArray.length + 1);
            withVersion[0] = witnessVersion;
            withVersion.set(inputArray, 1);
            return encode(hrp, withVersion, encoding, true);
        }

        return encode(hrp, inputArray, encoding, false);
    }

}

export default ToBech32;
