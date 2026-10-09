/**
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2018
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import { serialize } from "bson";
import OperationError from "../errors/OperationError.mjs";

/**
 * BSON serialise operation
 */
class BSONSerialise extends Operation {

    /**
     * BSONSerialise constructor
     */
    constructor() {
        super();

        this.name = "BSON serialise";
        this.module = "Serialise";
        this.description =  "BSON 是一种计算机数据交换格式，主要用作 MongoDB 数据库的数据存储与网络传输格式。它以二进制形式表示简单数据结构、关联数组（在 MongoDB 中称为对象或文档）以及 MongoDB 关注的各种数据类型。名称 'BSON' 源自 JSON，代表 'Binary JSON'。<br><br>输入数据应为合法的 JSON。";
        this.infoURL = "https://wikipedia.org/wiki/BSON";
        this.inputType = "string";
        this.outputType = "ArrayBuffer";
        this.args = [];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {ArrayBuffer}
     */
    run(input, args) {
        if (!input) return new ArrayBuffer();

        try {
            const data = JSON.parse(input);
            const result = serialize(data);
            return result.buffer.slice(result.byteOffset, result.byteOffset + result.byteLength);
        } catch (err) {
            throw new OperationError(err.toString());
        }
    }

}

export default BSONSerialise;
