/**
 * @author Danh4 [dan.h4@ncsc.gov.uk]
 * @copyright Crown Copyright 2020
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import { decode } from "cbor2";

/**
 * CBOR Decode operation
 */
class CBORDecode extends Operation {

    /**
     * CBORDecode constructor
     */
    constructor() {
        super();

        this.name = "CBOR Decode";
        this.module = "Serialise";
        this.description =  "简明二进制对象表示（CBOR）是一种松散基于 JSON 的二进制数据序列化格式。与 JSON 一样，它允许传输包含名称-值对的数据对象，但形式更简洁。这以牺牲人类可读性为代价，换取了更高的处理与传输速度。该格式定义于 IETF RFC 8949。";
        this.infoURL = "https://wikipedia.org/wiki/CBOR";
        this.inputType = "ArrayBuffer";
        this.outputType = "JSON";
        this.args = [];
    }

    /**
     * @param {ArrayBuffer} input
     * @param {Object[]} args
     * @returns {JSON}
     */
    run(input, args) {
        return decode(new Uint8Array(input));
    }

}

export default CBORDecode;
