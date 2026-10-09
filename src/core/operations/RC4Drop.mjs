/**
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import { format } from "../lib/Ciphers.mjs";
import CryptoJS from "crypto-js";

/**
 * RC4 Drop operation
 */
class RC4Drop extends Operation {

    /**
     * RC4Drop constructor
     */
    constructor() {
        super();

        this.name = "RC4 Drop";
        this.module = "Ciphers";
        this.description =   "研究发现，RC4 密钥流的前几个字节具有很强的非随机性，会泄露密钥信息。我们可以通过丢弃密钥流的初始部分来抵御这种攻击。这种修改后的算法传统上称为 RC4-drop。";
        this.infoURL = "https://wikipedia.org/wiki/RC4#Fluhrer,_Mantin_and_Shamir_attack";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [
            {
                "name": "Passphrase",
                "type": "toggleString",
                "value": "",
                "toggleValues": ["UTF8", "UTF16", "UTF16LE", "UTF16BE", "Latin1", "Hex", "Base64"]
            },
            {
                "name": "Input format",
                "type": "option",
                "value": ["Latin1", "UTF8", "UTF16", "UTF16LE", "UTF16BE", "Hex", "Base64"]
            },
            {
                "name": "Output format",
                "type": "option",
                "value": ["Latin1", "UTF8", "UTF16", "UTF16LE", "UTF16BE", "Hex", "Base64"]
            },
            {
                "name": "Number of dwords to drop",
                "type": "number",
                "value": 192
            }
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        const message = format[args[1]].parse(input),
            passphrase = format[args[0].option].parse(args[0].string),
            drop = args[3],
            encrypted = CryptoJS.RC4Drop.encrypt(message, passphrase, { drop: drop });

        return encrypted.ciphertext.toString(format[args[2]]);
    }

    /**
     * Highlight RC4 Drop
     *
     * @param {Object[]} pos
     * @param {number} pos[].start
     * @param {number} pos[].end
     * @param {Object[]} args
     * @returns {Object[]} pos
     */
    highlight(pos, args) {
        return pos;
    }

    /**
     * Highlight RC4 Drop in reverse
     *
     * @param {Object[]} pos
     * @param {number} pos[].start
     * @param {number} pos[].end
     * @param {Object[]} args
     * @returns {Object[]} pos
     */
    highlightReverse(pos, args) {
        return pos;
    }

}

export default RC4Drop;
