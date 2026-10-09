/**
 * @author Medjedtxm
 * @copyright Crown Copyright 2025
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import OperationError from "../errors/OperationError.mjs";
import Utils from "../Utils.mjs";
import { toHexFast } from "../lib/Hex.mjs";
import JsAscon from "js-ascon";

/**
 * Ascon Encrypt operation
 */
class AsconEncrypt extends Operation {

    /**
     * AsconEncrypt constructor
     */
    constructor() {
        super();

        this.name = "Ascon Encrypt";
        this.module = "Ciphers";
        this.description =  "Ascon-AEAD128 认证加密，符合 NIST SP 800-232 标准。Ascon 是一族轻量级认证加密算法，专为 IoT 传感器、嵌入式系统等资源受限设备设计。<br><br><b>密钥：</b>必须恰好为 16 字节（128 位）。<br><br><b>Nonce：</b>必须恰好为 16 字节（128 位），每次使用同一密钥加密时都应唯一。切勿在同一密钥下重复使用 Nonce。<br><br><b>关联数据：</b>可选附加数据，会被认证但不加密，适合携带头部、时间戳等元数据。<br><br>输出同时包含密文和一个 128 位认证标签。";
        this.infoURL = "https://wikipedia.org/wiki/Ascon_(cipher)";
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
                "name": "Nonce",
                "type": "toggleString",
                "value": "",
                "toggleValues": ["Hex", "UTF8", "Latin1", "Base64"]
            },
            {
                "name": "Associated Data",
                "type": "toggleString",
                "value": "",
                "toggleValues": ["Hex", "UTF8", "Latin1", "Base64"]
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
     * @throws {OperationError} if invalid key or nonce length
     */
    run(input, args) {
        const key = Utils.convertToByteArray(args[0].string, args[0].option),
            nonce = Utils.convertToByteArray(args[1].string, args[1].option),
            ad = Utils.convertToByteArray(args[2].string, args[2].option),
            inputType = args[3],
            outputType = args[4];

        if (key.length !== 16) {
            throw new OperationError(`Invalid key length: ${key.length} bytes.

Ascon-AEAD128 requires a key of exactly 16 bytes (128 bits).`);
        }

        if (nonce.length !== 16) {
            throw new OperationError(`Invalid nonce length: ${nonce.length} bytes.

Ascon-AEAD128 requires a nonce of exactly 16 bytes (128 bits).`);
        }

        // Convert input to byte array
        const inputData = Utils.convertToByteArray(input, inputType);

        const keyUint8 = new Uint8Array(key);
        const nonceUint8 = new Uint8Array(nonce);
        const adUint8 = new Uint8Array(ad);
        const inputUint8 = new Uint8Array(inputData);

        // Encrypt (returns Uint8Array containing ciphertext + tag)
        const ciphertext = JsAscon.encrypt(keyUint8, nonceUint8, adUint8, inputUint8);

        // Return in requested format
        if (outputType === "Hex") {
            return toHexFast(ciphertext);
        } else {
            return Utils.arrayBufferToStr(Uint8Array.from(ciphertext).buffer);
        }
    }

}

export default AsconEncrypt;
