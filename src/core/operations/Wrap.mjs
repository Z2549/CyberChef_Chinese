/**
 * @author 0xff1ce [github.com/0xff1ce]
 * @copyright Crown Copyright 2024
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";

const MAX_LINE_WIDTH = 65536;

/**
 * Wrap operation
 */
class Wrap extends Operation {

    /**
     * Wrap constructor
     */
    constructor() {
        super();

        this.name = "Wrap";
        this.module = "Default";
        this.description =  "按每行指定字符数对输入文本换行。";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [
            {
                "name": "Line Width",
                "type": "number",
                "value": 64,
                "min": 1,
                "max": MAX_LINE_WIDTH,
                "integer": true,
            },
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        if (!input) return "";  // Handle empty input
        const lineWidth = args[0];
        const regex = new RegExp(`.{1,${lineWidth}}`, "g");
        return input.match(regex).join("\n");
    }
}

export default Wrap;
