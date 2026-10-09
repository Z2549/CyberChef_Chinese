/**
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import {runHash} from "../lib/Hash.mjs";

/**
 * SHA0 operation
 */
class SHA0 extends Operation {

    /**
     * SHA0 constructor
     */
    constructor() {
        super();

        this.name = "SHA0";
        this.module = "Crypto";
        this.description =   "SHA-0 是对 1993 年发布的 160 位散列函数原始版本的重写，当时的名称是 'SHA'. 由于未公开的原因，该书在出版后不久即被撤回。'significant flaw' 并被稍作修改的 SHA-1 所取代。默认情况下，消息摘要算法由 80 轮组成。";
        this.infoURL = "https://wikipedia.org/wiki/SHA-1#SHA-0";
        this.inputType = "ArrayBuffer";
        this.outputType = "string";
        this.args = [
            {
                name: "Rounds",
                type: "number",
                value: 80,
                min: 16
            }
        ];
    }

    /**
     * @param {ArrayBuffer} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        return runHash("sha0", input, {rounds: args[0]});
    }

}

export default SHA0;
