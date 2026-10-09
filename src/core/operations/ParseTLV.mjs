/**
 * @author gchq77703 []
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2018
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import TLVParser from "../lib/TLVParser.mjs";
import OperationError from "../errors/OperationError.mjs";

/**
 * Parse TLV operation
 */
class ParseTLV extends Operation {

    /**
     * ParseTLV constructor
     */
    constructor() {
        super();

        this.name = "Parse TLV";
        this.module = "Default";
        this.description =   "将类型长度值(tlv)编码的字符串转换为json对象。可以选择包括 <code>Key</code> / <code>Type</code> 条目. <br><br>Tags: Key-Length-Value, KLV, Length-Value, LV";
        this.infoURL = "https://wikipedia.org/wiki/Type-length-value";
        this.inputType = "ArrayBuffer";
        this.outputType = "JSON";
        this.args = [
            {
                name: "Type/Key size",
                type: "number",
                value: 1
            },
            {
                name: "Length size",
                type: "number",
                value: 1
            },
            {
                name: "Use BER",
                type: "boolean",
                value: false
            }
        ];
    }

    /**
     * @param {ArrayBuffer} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        const [bytesInKey, bytesInLength, basicEncodingRules] = args;
        input = new Uint8Array(input);

        if (bytesInKey <= 0 && bytesInLength <= 0)
            throw new OperationError("Type or Length size must be greater than 0");

        const tlv = new TLVParser(input, { bytesInLength, basicEncodingRules });

        const data = [];

        while (!tlv.atEnd()) {
            const key = bytesInKey ? tlv.getValue(bytesInKey) : undefined;
            const length = tlv.getLength();
            const value = tlv.getValue(length);

            data.push({ key, length, value });
        }

        return data;
    }

}

export default ParseTLV;
