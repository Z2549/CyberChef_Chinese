/**
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

import r from "jsrsasign";
import Operation from "../Operation.mjs";

/**
 * Object Identifier to Hex operation
 */
class ObjectIdentifierToHex extends Operation {

    /**
     * ObjectIdentifierToHex constructor
     */
    constructor() {
        super();

        this.name = "Object Identifier to Hex";
        this.module = "PublicKey";
        this.description =   "将对象标识符 (OID) 转换为十六进制字符串。";
        this.infoURL = "https://wikipedia.org/wiki/Object_identifier";
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
        return r.KJUR.asn1.ASN1Util.oidIntToHex(input);
    }

}

export default ObjectIdentifierToHex;
