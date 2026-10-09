/**
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

import r from "jsrsasign";
import Operation from "../Operation.mjs";

/**
 * Parse ASN.1 hex string operation
 */
class ParseASN1HexString extends Operation {

    /**
     * ParseASN1HexString constructor
     */
    constructor() {
        super();

        this.name = "Parse ASN.1 hex string";
        this.module = "PublicKey";
        this.description =   "抽象语法记法一（ASN.1）是一种标准和记法，描述了电信与计算机网络中数据的表示、编码、传输和解码的规则与结构。<br><br>本操作可解析任意 ASN.1 数据（需以十六进制字符串形式给出，必要时先用“To Hex”操作转换），并以树状结构展示解析结果。";
        this.infoURL = "https://wikipedia.org/wiki/Abstract_Syntax_Notation_One";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [
            {
                "name": "Starting index",
                "type": "number",
                "value": 0
            },
            {
                "name": "Truncate octet strings longer than",
                "type": "number",
                "value": 32
            }
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        const [index, truncateLen] = args;
        return r.ASN1HEX.dump(input.replace(/\s/g, "").toLowerCase(), {
            "ommit_long_octet": truncateLen
        }, index);
    }

}

export default ParseASN1HexString;
