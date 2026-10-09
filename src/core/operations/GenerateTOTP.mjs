/**
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2017
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import OperationError from "../errors/OperationError.mjs";
import * as OTPAuth from "otpauth";

/**
 * Generate TOTP operation
 */
class GenerateTOTP extends Operation {
    /**
     *
     */
    constructor() {
        super();
        this.name = "Generate TOTP";
        this.module = "Default";
        this.description =   "基于时间的一次性口令算法（TOTP）通过共享密钥和当前时间计算一次性口令。它已被采纳为互联网工程任务组标准 RFC 6238，是开放身份验证倡议（OATH）的基石，并应用于众多双因素身份验证系统。TOTP 是一种计数器为当前时间的 HOTP。<br><br>在输入框中填写共享密钥；留空将随机生成一个密钥。密钥必须是合法的 Base32 字符串（字符 A–Z 和 2–7）。T0 与 T1 的单位为秒。";
        this.infoURL = "https://wikipedia.org/wiki/Time-based_One-time_Password_algorithm";
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
                "name": "Epoch offset (T0)",
                "type": "number",
                "value": 0,
                "min": 0,
                "integer": true
            },
            {
                "name": "Interval (T1)",
                "type": "number",
                "value": 30,
                "min": 1,
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

        const totp = new OTPAuth.TOTP({
            issuer: "",
            label: args[0],
            algorithm: "SHA1",
            digits: args[1],
            period: args[3],
            epoch: args[2] * 1000, // Convert seconds to milliseconds
            secret
        });

        const uri = totp.toString();
        const code = totp.generate();

        return `URI: ${uri}\n\nPassword: ${code}`;
    }
}

export default GenerateTOTP;
