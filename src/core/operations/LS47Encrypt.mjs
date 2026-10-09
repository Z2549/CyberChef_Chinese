/**
 * @author n1073645 [n1073645@gmail.com]
 * @copyright Crown Copyright 2020
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import * as LS47 from "../lib/LS47.mjs";

/**
 * LS47 Encrypt operation
 */
class LS47Encrypt extends Operation {

    /**
     * LS47Encrypt constructor
     */
    constructor() {
        super();

        this.name = "LS47 Encrypt";
        this.module = "Crypto";
        this.description =   "这是对艾伦·卡明斯基(Alan Kaminsky)所描述的Elsie Four密码的略微改进。我们使用7x7字符而不是原来的6x6字符，以便能够加密一些结构化信息。我们还描述了一个简单的密钥扩展算法，因为记住密码很流行。和埃尔西四号一样的安全考虑。<br>Tls47字母表由下列字符组成: <code>_abcdefghijklmnopqrstuvwxyz.0123456789,-+*/:?!'()</code><br>ls47密钥是字母表的一种排列，然后用用于加密或解密的7x7网格表示。";
        this.infoURL = "https://github.com/exaexa/ls47";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [
            {
                name: "Password",
                type: "string",
                value: ""
            },
            {
                name: "Padding",
                type: "number",
                value: 10
            },
            {
                name: "Signature",
                type: "string",
                value: ""
            }
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        this.paddingSize = parseInt(args[1], 10);

        LS47.initTiles();

        const key = LS47.deriveKey(args[0]);
        return LS47.encryptPad(key, input, args[2], this.paddingSize);
    }

}

export default LS47Encrypt;
