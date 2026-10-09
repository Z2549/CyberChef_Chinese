/**
 * @author Matt C [matt@artemisbot.uk]
 * @copyright Crown Copyright 2018
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import { affineEncode } from "../lib/Ciphers.mjs";

/**
 * Affine Cipher Encode operation
 */
class AffineCipherEncode extends Operation {

    /**
     * AffineCipherEncode constructor
     */
    constructor() {
        super();

        this.name = "Affine Cipher Encode";
        this.module = "Ciphers";
        this.description =   "Affine 密码是一种单字母替换密码，其中字母表中的每个字母都被映射为数字等价物，使用简单的数学函数进行加密, <code>(ax + b) % 26</code>, 并转换回字母。";
        this.infoURL = "https://wikipedia.org/wiki/Affine_cipher";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [
            {
                "name": "a",
                "type": "number",
                "value": 1
            },
            {
                "name": "b",
                "type": "number",
                "value": 0
            }
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        return affineEncode(input, args);
    }

    /**
     * Highlight Affine Cipher Encode
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
     * Highlight Affine Cipher Encode in reverse
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

export default AffineCipherEncode;
