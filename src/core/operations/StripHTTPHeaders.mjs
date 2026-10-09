/**
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";

/**
 * Strip HTTP headers operation
 */
class StripHTTPHeaders extends Operation {

    /**
     * StripHTTPHeaders constructor
     */
    constructor() {
        super();

        this.name = "Strip HTTP headers";
        this.module = "Default";
        this.description =   "通过查找双换行符的第一个实例，从请求或响应中删除http头。";
        this.infoURL = "https://wikipedia.org/wiki/Hypertext_Transfer_Protocol#Message_format";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [];
        this.checks = [
            {
                pattern:  "^HTTP(.|\\s)+?(\\r?\\n){2}",
                flags:  "",
                args:   []
            }
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        let headerEnd = input.indexOf("\r\n\r\n");
        headerEnd = (headerEnd < 0) ? input.indexOf("\n\n") + 2 : headerEnd + 4;

        return (headerEnd < 2) ? input : input.slice(headerEnd, input.length);
    }

}

export default StripHTTPHeaders;
