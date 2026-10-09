/**
 * @author sg5506844 [sg5506844@gmail.com]
 * @copyright Crown Copyright 2021
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import OperationError from "../errors/OperationError.mjs";
import rison from "rison";

/**
 * Rison Decode operation
 */
class RisonDecode extends Operation {

    /**
     * RisonDecode constructor
     */
    constructor() {
        super();

        this.name = "Rison Decode";
        this.module = "Encodings";
        this.description =  "Rison 是一种为 URI 中紧凑性而优化的数据序列化格式。Rison 是 JSON 的轻微变体，经过 URI 编码后表现明显更优。Rison 表达的数据结构集合与 JSON 完全相同，因此数据可以无损、确定地相互转换。";
        this.infoURL = "https://github.com/Nanonid/rison";
        this.inputType = "string";
        this.outputType = "Object";
        this.args = [
            {
                name: "Decode Option",
                type: "editableOption",
                value: ["Decode", "Decode Object", "Decode Array"]
            },
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {Object}
     */
    run(input, args) {
        const [decodeOption] = args;
        switch (decodeOption) {
            case "Decode":
                return rison.decode(input);
            case "Decode Object":
                return rison.decode_object(input);
            case "Decode Array":
                return rison.decode_array(input);
            default:
                throw new OperationError("Invalid Decode option");
        }
    }
}

export default RisonDecode;
