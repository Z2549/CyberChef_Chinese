/**
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2022
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import "reflect-metadata"; // Required as a shim for the amf library
import { AMF0, AMF3 } from "@astronautlabs/amf";

/**
 * AMF Decode operation
 */
class AMFDecode extends Operation {

    /**
     * AMFDecode constructor
     */
    constructor() {
        super();

        this.name = "AMF Decode";
        this.module = "Encodings";
        this.description =   "Action Message Format (AMF) 是一种二进制格式，用于序列化 ActionScript 对象和 XML 等对象图形，或在 Adobe Flash 客户端和远程服务（通常是 Flash 媒体服务器或第三方替代品）之间发送信息。";
        this.infoURL = "https://wikipedia.org/wiki/Action_Message_Format";
        this.inputType = "ArrayBuffer";
        this.outputType = "JSON";
        this.args = [
            {
                name: "Format",
                type: "option",
                value: ["AMF0", "AMF3"],
                defaultIndex: 1
            }
        ];
    }

    /**
     * @param {ArrayBuffer} input
     * @param {Object[]} args
     * @returns {JSON}
     */
    run(input, args) {
        const [format] = args;
        const handler = format === "AMF0" ? AMF0 : AMF3;
        const encoded = new Uint8Array(input);
        return handler.Value.deserialize(encoded);
    }

}

export default AMFDecode;
