/**
 * @author GCHQDeveloper581
 * @copyright Crown Copyright 2026
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import kbpgp from "kbpgp";
import { ASP, importPrivateKey } from "../lib/PGP.mjs";
import OperationError from "../errors/OperationError.mjs";
import * as es6promisify from "es6-promisify";
const promisify = es6promisify.default ? es6promisify.default.promisify : es6promisify.promisify;

/**
 * PGP Sign operation
 */
class PGPSign extends Operation {

    /**
     * PGPSign constructor
     */
    constructor() {
        super();

        this.name = "PGP Sign";
        this.module = "PGP";
        this.description = [
            "输入：您想要签名的消息。",
            "<br><br>",
            "参数：发送方的 ASCII 装甲 PGP 私钥。",
            "<br><br>",
            "Pretty Good Privacy 是一种加密标准（OpenPGP），用于加密、解密和签名消息。",
            "<br><br>",
            "此功能使用 Keybase 的 PGP 实现。",
        ].join("\n");
        this.infoURL = "https://wikipedia.org/wiki/Pretty_Good_Privacy"; // Usually a Wikipedia link. Remember to remove localisation (i.e. https://wikipedia.org/etc rather than https://en.wikipedia.org/etc)
        this.inputType = "string";
        this.outputType = "string";
        this.args = [
            {
                "name": "Private key of signer",
                "type": "text",
                "value": ""
            },
            {
                "name": "Private key passphrase (optional)",
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
     * @throws {OperationError} if failed private key import or failed encryption
     */
    async run(input, args) {
        const message = input,
            [privateKey, passphrase] = args;
        let signedMessage;

        if (!privateKey) throw new OperationError("Enter the private key of the signer.");
        const privKey = await importPrivateKey(privateKey, passphrase);

        try {
            signedMessage = await promisify(kbpgp.box)({
                "msg": message,
                "sign_with": privKey,
                "asp": ASP
            });
        } catch (err) {
            throw new OperationError(`Couldn't sign message: ${err}`);
        }

        return signedMessage;
    }

}

export default PGPSign;
