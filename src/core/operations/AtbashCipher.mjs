/**
 * @author Matt C [matt@artemisbot.uk]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import { affineEncode } from "../lib/Ciphers.mjs";

/**
 * Atbash Cipher operation
 */
class AtbashCipher extends Operation {

    /**
     * AtbashCipher constructor
     */
    constructor() {
        super();

        this.name = "Atbash Cipher";
        this.module = "Ciphers";
        this.description =   "Atbash是一种单字母替代密码，最初用于对希伯来字母进行编码。它在这里被修改为与拉丁字母一起使用。";
        this.infoURL = "https://wikipedia.org/wiki/Atbash";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        return affineEncode(input, [25, 25]);
    }

    /**
     * Highlight Atbash Cipher
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
     * Highlight Atbash Cipher in reverse
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

export default AtbashCipher;
