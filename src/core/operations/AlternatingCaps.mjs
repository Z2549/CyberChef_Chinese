/**
 * @author sw5678
 * @copyright Crown Copyright 2023
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";

/**
 * Alternating caps operation
 */
class AlternatingCaps extends Operation {

    /**
     * AlternatingCaps constructor
     */
    constructor() {
        super();

        this.name = "Alternating Caps";
        this.module = "Default";
        this.description =  "交替大小写（又称 studly caps、sticky caps 或 spongecase）是一种文本记法，其中字母的大小写按某种规律或任意变化。例如把 'alternative caps' 写成 'aLtErNaTiNg CaPs'。";
        this.infoURL = "https://en.wikipedia.org/wiki/Alternating_caps";
        this.inputType = "string";
        this.outputType = "string";
        this.args= [];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        let output = "";
        let previousCaps = true;
        for (let i = 0; i < input.length; i++) {
            // Check if the element is a letter
            if (!RegExp(/^\p{L}/, "u").test(input[i])) {
                output += input[i];
            } else if (previousCaps) {
                output += input[i].toLowerCase();
                previousCaps = false;
            } else {
                output += input[i].toUpperCase();
                previousCaps = true;
            }
        }
        return output;
    }
}

export default AlternatingCaps;
