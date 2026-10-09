/**
 * @author GCHQ Contributor [3]
 * @copyright Crown Copyright 2019
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import OperationError from "../errors/OperationError.mjs";
import Protobuf from "../lib/Protobuf.mjs";

/**
 * Protobuf Decode operation
 */
class ProtobufDecode extends Operation {

    /**
     * ProtobufDecode constructor
     */
    constructor() {
        super();

        this.name = "Protobuf Decode";
        this.module = "Protobuf";
        this.description =   "使用字段编号作为字段键，将任何 Protobuf 编码数据解码为数据的 JSON 表示形式。<br><br>如果定义了 .proto 模式，则将参照该模式对编码数据进行解码。只会解码一个报文实例。<br><br><u>显示未知字段</u><br>使用模式时，该选项会显示输入数据中存在但模式中未定义的字段。<br><br><u>显示类型</u><br>显示字段名称旁边的字段类型。对于未定义的字段，将显示wiretype和示例类型。";
        this.infoURL = "https://wikipedia.org/wiki/Protocol_Buffers";
        this.inputType = "ArrayBuffer";
        this.outputType = "JSON";
        this.args = [
            {
                name: "Schema (.proto text)",
                type: "text",
                value: "",
                rows: 8,
                hint: "Drag and drop is enabled on this ingredient"
            },
            {
                name: "Show Unknown Fields",
                type: "boolean",
                value: false
            },
            {
                name: "Show Types",
                type: "boolean",
                value: false
            }
        ];
    }

    /**
     * @param {ArrayBuffer} input
     * @param {Object[]} args
     * @returns {JSON}
     */
    run(input, args) {
        input = new Uint8Array(input);
        try {
            return Protobuf.decode(input, args);
        } catch (err) {
            throw new OperationError(err);
        }
    }

}

export default ProtobufDecode;
