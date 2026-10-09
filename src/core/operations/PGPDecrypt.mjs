/**
 * @author tlwr [toby@toby.codes]
 * @copyright Crown Copyright 2017
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import kbpgp from "kbpgp";
import { ASP, importPrivateKey } from "../lib/PGP.mjs";
import OperationError from "../errors/OperationError.mjs";
import * as es6promisify from "es6-promisify";
const promisify = es6promisify.default ? es6promisify.default.promisify : es6promisify.promisify;

/**
 * PGP Decrypt operation
 */
class PGPDecrypt extends Operation {

    /**
     * PGPDecrypt constructor
     */
    constructor() {
        super();

        this.name = "PGP Decrypt";
        this.module = "PGP";
        this.description =   "输入：要验证的 ASCII 码加密 PGP 信息。\\n<br><br>\\n参数：签名者的 ASCII 码 PGP 公钥, \\n收件人的 ASCII 码私人密钥（必要时还有私人密钥密码）。\\n<br><br>\\n此操作使用 PGP 来解密和验证加密数字签名。\\n<br><br>\\nPretty Good Privacy 是一种加密标准（OpenPGP），用于加密、解密和签署信息。\\n<br><br>\\n该函数使用 PGP 的 Keybase 实现。";
        this.infoURL = "https://wikipedia.org/wiki/Pretty_Good_Privacy";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [
            {
                "name": "Private key of recipient",
                "type": "text",
                "value": ""
            },
            {
                "name": "Private key passphrase",
                "type": "string",
                "value": ""
            }
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     *
     * @throws {OperationError} if invalid private key
     */
    async run(input, args) {
        const encryptedMessage = input,
            [privateKey, passphrase] = args,
            keyring = new kbpgp.keyring.KeyRing();
        let plaintextMessage;

        if (!privateKey) throw new OperationError("Enter the private key of the recipient.");

        const key = await importPrivateKey(privateKey, passphrase);
        keyring.add_key_manager(key);

        try {
            plaintextMessage = await promisify(kbpgp.unbox)({
                armored: encryptedMessage,
                keyfetch: keyring,
                asp: ASP
            });
        } catch (err) {
            throw new OperationError(`Couldn't decrypt message with provided private key: ${err}`);
        }

        return plaintextMessage.toString();
    }

}

export default PGPDecrypt;
