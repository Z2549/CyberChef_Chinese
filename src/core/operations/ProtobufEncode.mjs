/**
 * @author GCHQ Contributor [3]
 * @copyright Crown Copyright 2021
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import OperationError from "../errors/OperationError.mjs";
import Protobuf from "../lib/Protobuf.mjs";

/**
 * Protobuf Encode operation
 */
class ProtobufEncode extends Operation {

    /**
     * ProtobufEncode constructor
     */
    constructor() {
        super();

        this.name = "Protobuf Encode";
        this.module = "Protobuf";
        this.description =   "使用输入的 .proto 模式将有效的 JSON 对象编码为 protobuf 字节数组。";
        this.infoURL = "https://developers.google.com/protocol-buffers/docs/encoding";
        this.inputType = "JSON";
        this.outputType = "ArrayBuffer";
        this.args = [
            {
                name: "Schema (.proto text)",
                type: "text",
                value: "",
                rows: 8,
                hint: "Drag and drop is enabled on this ingredient"
            }
        ];
    }

    /**
     * @param {Object} input
     * @param {Object[]} args
     * @returns {ArrayBuffer}
     */
    run(input, args) {
        try {
            return Protobuf.encode(input, args);
        } catch (error) {
            throw new OperationError(error);
        }
    }

}

export default ProtobufEncode;
