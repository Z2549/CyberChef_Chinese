/**
 * @author sg5506844 [sg5506844@gmail.com]
 * @copyright Crown Copyright 2021
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import OperationError from "../errors/OperationError.mjs";
import rison from "rison";

/**
 * Rison Encode operation
 */
class RisonEncode extends Operation {

    /**
     * RisonEncode constructor
     */
    constructor() {
        super();

        this.name = "Rison Encode";
        this.module = "Encodings";
        this.description =  "Rison 是一种为 URI 中紧凑性而优化的数据序列化格式。Rison 是 JSON 的轻微变体，经过 URI 编码后表现明显更优。Rison 表达的数据结构集合与 JSON 完全相同，因此数据可以无损、确定地相互转换。";
        this.infoURL = "https://github.com/Nanonid/rison";
        this.inputType = "Object";
        this.outputType = "string";
        this.args = [
            {
                name: "Encode Option",
                type: "option",
                value: ["Encode", "Encode Object", "Encode Array", "Encode URI"]
            },
        ];
    }

    /**
     * @param {Object} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        const [encodeOption] = args;
        switch (encodeOption) {
            case "Encode":
                return rison.encode(input);
            case "Encode Object":
                return rison.encode_object(input);
            case "Encode Array":
                return rison.encode_array(input);
            case "Encode URI":
                return rison.encode_uri(input);
            default:
                throw new OperationError("Invalid encode option");
        }
    }
}

export default RisonEncode;
