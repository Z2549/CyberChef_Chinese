/**
 * @author Matt C [matt@artemisbot.uk]
 * @copyright Crown Copyright 2017
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import Utils from "../Utils.mjs";
import {DELIM_OPTIONS} from "../lib/Delim.mjs";


/**
 * To Octal operation
 */
class ToOctal extends Operation {

    /**
     * ToOctal constructor
     */
    constructor() {
        super();

        this.name = "To Octal";
        this.module = "Default";
        this.description =   "将输入字符串转换为用指定分隔符分隔的八进制字节。<br><br>例： UTF-8 编码字符串 <code>Γειά σου</code> 变成 <code>316 223 316 265 316 271 316 254 40 317 203 316 277 317 205</code>";
        this.infoURL = "https://wikipedia.org/wiki/Octal";
        this.inputType = "byteArray";
        this.outputType = "string";
        this.args = [
            {
                "name": "Delimiter",
                "type": "option",
                "value": DELIM_OPTIONS
            }
        ];
    }

    /**
     * @param {byteArray} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        const delim = Utils.charRep(args[0] || "Space");
        return input.map(val => val.toString(8)).join(delim);
    }

}

export default ToOctal;
