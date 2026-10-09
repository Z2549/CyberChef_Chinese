/**
 * @author kendallgoto [k@kgo.to]
 * @copyright Crown Copyright 2025
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import OperationError from "../errors/OperationError.mjs";
import Handlebars from "handlebars";

/**
 * Template operation
 */
class Template extends Operation {

    /**
     * Template constructor
     */
    constructor() {
        super();

        this.name = "Template";
        this.module = "Handlebars";
        this.description =  "使用 Handlebars/Mustache 渲染模板，并通过 JSON 输入替换变量。模板只会渲染为纯文本，以防止 XSS。";
        this.infoURL = "https://handlebarsjs.com/";
        this.inputType = "JSON";
        this.outputType = "string";
        this.args = [
            {
                name: "Template definition (.handlebars)",
                type: "text",
                value: ""
            }
        ];
    }

    /**
     * @param {JSON} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        const [templateStr] = args;
        try {
            const template = Handlebars.compile(templateStr);
            return template(input);
        } catch (e) {
            throw new OperationError(e);
        }
    }
}

export default Template;
