/**
 * @author tlwr [toby@toby.codes]
 * @author Matt C [me@mitt.dev]
 * @copyright Crown Copyright 2019
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";

/**
 * HTML To Text operation
 */
class HTMLToText extends Operation {

    /**
     * HTMLToText constructor
     */
    constructor() {
        super();

        this.name = "HTML To Text";
        this.module = "Default";
        this.description =   "将操作的 HTML 输出转换为可读字符串，而不是在 DOM 中渲染。";
        this.infoURL = "";
        this.inputType = "html";
        this.outputType = "string";
        this.args = [];
    }

    /**
     * @param {html} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        return input;
    }

}

export default HTMLToText;
