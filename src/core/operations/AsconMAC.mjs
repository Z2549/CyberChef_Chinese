/**
 * @author Medjedtxm
 * @copyright Crown Copyright 2025
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import OperationError from "../errors/OperationError.mjs";
import Utils from "../Utils.mjs";
import { toHexFast } from "../lib/Hex.mjs";
import AsconMac from "../vendor/ascon.mjs";

/**
 * Ascon MAC operation
 */
class AsconMAC extends Operation {

    /**
     * AsconMAC constructor
     */
    constructor() {
        super();

        this.name = "Ascon MAC";
        this.module = "Crypto";
        this.description =  "Ascon-Mac 生成 128 位（16 字节）的消息认证码，属于 NIST SP 800-232 标准化的 Ascon 家族。它使用密钥为消息提供认证，确保数据的完整性与真实性。<br><br>Ascon 面向 IoT 传感器、嵌入式系统等资源受限设备上的轻量级密码学。";
        this.infoURL = "https://wikipedia.org/wiki/Ascon_(cipher)";
        this.inputType = "ArrayBuffer";
        this.outputType = "string";
        this.args = [
            {
                "name": "Key",
                "type": "toggleString",
                "value": "",
                "toggleValues": ["Hex", "UTF8", "Latin1", "Base64"]
            }
        ];
    }

    /**
     * @param {ArrayBuffer} input
     * @param {Object[]} args
     * @returns {string}
     * @throws {OperationError} if invalid key length
     */
    run(input, args) {
        const keyArray = Utils.convertToByteArray(args[0].string, args[0].option);

        if (keyArray.length !== 16) {
            throw new OperationError(`Invalid key length: ${keyArray.length} bytes.

Ascon-Mac requires a key of exactly 16 bytes (128 bits).`);
        }

        // Convert to Uint8Array for vendor Ascon implementation
        const keyUint8 = new Uint8Array(keyArray);
        const inputUint8 = new Uint8Array(input);

        // Compute MAC (returns Uint8Array)
        const macResult = AsconMac.mac(keyUint8, inputUint8);

        // Convert to hex string
        return toHexFast(macResult);
    }

}

export default AsconMAC;
