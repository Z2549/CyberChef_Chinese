/**
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import Utils from "../Utils.mjs";
import {INPUT_DELIM_OPTIONS} from "../lib/Delim.mjs";

/**
 * Tail operation
 */
class Tail extends Operation {

    /**
     * Tail constructor
     */
    constructor() {
        super();

        this.name = "Tail";
        this.module = "Default";
        this.description =   "就像unix尾部效用。<br>获取最后n行。<br>也可以通过输入n的负值来选择第n行之后的所有行。<br>可以更改分隔符，以选择字段（即逗号）代替行。";
        this.infoURL = "https://wikipedia.org/wiki/Tail_(Unix)";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [
            {
                "name": "Delimiter",
                "type": "option",
                "value": INPUT_DELIM_OPTIONS
            },
            {
                "name": "Number",
                "type": "number",
                "value": 10
            }
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        let delimiter = args[0];
        const number = args[1];

        delimiter = Utils.charRep(delimiter);
        const splitInput = input.split(delimiter);

        return splitInput
            .filter((line, lineIndex) => {
                lineIndex += 1;

                if (number < 0) {
                    return lineIndex > -number;
                } else {
                    return lineIndex > splitInput.length - number;
                }
            })
            .join(delimiter);

    }

}

export default Tail;
