/**
 * @author tlwr [toby@toby.codes]
 * @copyright Crown Copyright 2017
 * @license Apache-2.0
 */

import camelCase from "lodash/camelCase.js";
import Operation from "../Operation.mjs";
import { replaceVariableNames } from "../lib/Code.mjs";

/**
 * To Camel case operation
 */
class ToCamelCase extends Operation {

    /**
     * ToCamelCase constructor
     */
    constructor() {
        super();

        this.name = "To Camel case";
        this.module = "Code";
        this.description =   "将输入字符串转换为驼峰大小写。\\n<br><br>\\n驼峰式大小写都是小写，除了单词边界后面的字母是大写的。\\n<br><br>\\n例： thisIsCamelCase\\n<br><br>\\n'Attempt to be context aware' 将使操作尝试很好地转换变量和函数名。";
        this.infoURL = "https://wikipedia.org/wiki/Camel_case";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [
            {
                "name": "Attempt to be context aware",
                "type": "boolean",
                "value": false
            }
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        const smart = args[0];

        if (smart) {
            return replaceVariableNames(input, camelCase);
        } else {
            return camelCase(input);
        }
    }

}

export default ToCamelCase;
