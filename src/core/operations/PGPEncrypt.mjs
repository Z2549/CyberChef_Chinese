/**
 * @author tlwr [toby@toby.codes]
 * @copyright Crown Copyright 2017
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import kbpgp from "kbpgp";
import { ASP, importPublicKey } from "../lib/PGP.mjs";
import OperationError from "../errors/OperationError.mjs";
import * as es6promisify from "es6-promisify";
const promisify = es6promisify.default ? es6promisify.default.promisify : es6promisify.promisify;

/**
 * PGP Encrypt operation
 */
class PGPEncrypt extends Operation {

    /**
     * PGPEncrypt constructor
     */
    constructor() {
        super();

        this.name = "PGP Encrypt";
        this.module = "PGP";
        this.description =   "输入：要签名的明文。\\n<br><br>\\n参数：签名者的 ASCII 码私人密钥（必要时加上私人密钥密码）\\n和收件人的 ASCII 码 PGP 公钥。\\n<br><br>\\n此操作使用 PGP 生成加密数字签名。\\n<br><br>\\nPretty Good Privacy 是一种加密标准（OpenPGP），用于加密、解密和签署信息。\\n<br><br>\\n该函数使用 PGP 的 Keybase 实现。";
        this.infoURL = "https://wikipedia.org/wiki/Pretty_Good_Privacy";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [
            {
                "name": "Public key of recipient",
                "type": "text",
                "value": ""
            }
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     *
     * @throws {OperationError} if failed private key import or failed encryption
     */
    async run(input, args) {
        const plaintextMessage = input,
            plainPubKey = args[0];
        let encryptedMessage;

        if (!plainPubKey) throw new OperationError("Enter the public key of the recipient.");

        const key = await importPublicKey(plainPubKey);

        try {
            encryptedMessage = await promisify(kbpgp.box)({
                "msg": plaintextMessage,
                "encrypt_for": key,
                "asp": ASP
            });
        } catch (err) {
            throw new OperationError(`Couldn't encrypt message with provided public key: ${err}`);
        }

        return encryptedMessage.toString();
    }

}

export default PGPEncrypt;
