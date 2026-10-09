/**
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

import r from "jsrsasign";
import Operation from "../Operation.mjs";

/**
 * Hex to PEM operation
 */
class HexToPEM extends Operation {

    /**
     * HexToPEM constructor
     */
    constructor() {
        super();

        this.name = "Hex to PEM";
        this.module = "PublicKey";
        this.description =   "将十六进制 DER（区分编码规则）字符串转换为 PEM（隐私增强邮件）格式。";
        this.infoURL = "https://wikipedia.org/wiki/Privacy-Enhanced_Mail";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [
            {
                "name": "Header string",
                "type": "string",
                "value": "CERTIFICATE"
            }
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        return r.KJUR.asn1.ASN1Util.getPEMStringFromHex(input.replace(/\s/g, ""), args[0]);
    }

}

export default HexToPEM;
