/**
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2017
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import OperationError from "../errors/OperationError.mjs";
import * as OTPAuth from "otpauth";

/**
 * Generate HOTP operation
 */
class GenerateHOTP extends Operation {
    /**
     *
     */
    constructor() {
        super();

        this.name = "Generate HOTP";
        this.module = "Default";
        this.description =   "基于 HMAC 的一次性口令算法（HOTP）通过共享密钥和递增计数器计算一次性口令。它已被采纳为互联网工程任务组标准 RFC 4226，是开放身份验证倡议（OATH）的基石，并应用于众多双因素身份验证系统。<br><br>在输入框中填写共享密钥；留空将随机生成一个密钥。密钥必须是合法的 Base32 字符串（字符 A–Z 和 2–7）。";
        this.infoURL = "https://wikipedia.org/wiki/HMAC-based_One-time_Password_algorithm";
        this.inputType = "ArrayBuffer";
        this.outputType = "string";
        this.args = [
            {
                "name": "Name",
                "type": "string",
                "value": "Account",
                "allowEmpty": false
            },
            {
                "name": "Code length",
                "type": "number",
                "value": 6,
                "min": 6,
                "max": 8,
                "integer": true
            },
            {
                "name": "Counter",
                "type": "number",
                "value": 0,
                "min": 0,
                "integer": true
            }
        ];
    }

    /**
     *
     */
    run(input, args) {
        const secretStr = new TextDecoder("utf-8").decode(input).trim();

        let secret;
        try {
            secret = secretStr ?
                OTPAuth.Secret.fromBase32(secretStr.toUpperCase().replace(/\s+/g, "")) :
                new OTPAuth.Secret();
        } catch {
            throw new OperationError("Invalid secret. The input must be a valid base32 string (characters A–Z and 2–7).");
        }

        const hotp = new OTPAuth.HOTP({
            issuer: "",
            label: args[0],
            algorithm: "SHA1",
            digits: args[1],
            counter: args[2],
            secret
        });

        const uri = hotp.toString();
        const code = hotp.generate();

        return `URI: ${uri}\n\nPassword: ${code}`;
    }
}

export default GenerateHOTP;
