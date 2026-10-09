/**
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import {runHash} from "../lib/Hash.mjs";

/**
 * MD2 operation
 */
class MD2 extends Operation {

    /**
     * MD2 constructor
     */
    constructor() {
        super();

        this.name = "MD2";
        this.module = "Crypto";
        this.description =   "md2(消息摘要2)算法是Ronald Rivest在1989年开发的加密散列函数。该算法针对8位计算机进行了优化。<br><br>尽管md2不再被认为是安全的，但即使在2014年，它仍然作为md2和rsa生成的证书的一部分在公钥基础设施中使用。缺省情况下，消息摘要算法由18轮组成。";
        this.infoURL = "https://wikipedia.org/wiki/MD2_(cryptography)";
        this.inputType = "ArrayBuffer";
        this.outputType = "string";
        this.args = [
            {
                name: "Rounds",
                type: "number",
                value: 18,
                min: 0
            }
        ];
    }

    /**
     * @param {ArrayBuffer} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        return runHash("md2", input, {rounds: args[0]});
    }

}

export default MD2;
