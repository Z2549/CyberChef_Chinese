/**
 * @author gchq77703 []
 * @copyright Crown Copyright 2018
 * @license Apache-2.0
 */
import Operation from "../Operation.mjs";
import jwt from "jsonwebtoken";
import OperationError from "../errors/OperationError.mjs";
import {JWT_ALGORITHMS} from "../lib/JWT.mjs";


/**
 * JWT Sign operation
 */
class JWTSign extends Operation {

    /**
     * JWTSign constructor
     */
    constructor() {
        super();

        this.name = "JWT Sign";
        this.module = "Crypto";
        this.description =   "使用提供的秘钥/私钥将 JSON 对象签署为 JSON Web 令牌。<br><br>密钥应是 HMAC 算法的密钥或 RSA 和 ECDSA 的 PEM 编码私钥。";
        this.infoURL = "https://wikipedia.org/wiki/JSON_Web_Token";
        this.inputType = "JSON";
        this.outputType = "string";
        this.args = [
            {
                name: "Private/Secret Key",
                type: "text",
                value: "secret"
            },
            {
                name: "Signing algorithm",
                type: "option",
                value: JWT_ALGORITHMS
            },
            {
                name: "Header",
                type: "text",
                value: "{}"
            }
        ];
    }

    /**
     * @param {JSON} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        const [key, algorithm, header] = args;

        try {
            return jwt.sign(input, key, {
                algorithm: algorithm === "None" ? "none" : algorithm,
                header: JSON.parse(header || "{}")
            });
        } catch (err) {
            throw new OperationError(`Error: Have you entered the key correctly? The key should be either the secret for HMAC algorithms or the PEM-encoded private key for RSA and ECDSA.

${err}`);
        }
    }

}

export default JWTSign;
