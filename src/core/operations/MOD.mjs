/**
 * @license Apache-2.0
 */

import BigNumber from "bignumber.js";
import Operation from "../Operation.mjs";
import OperationError from "../errors/OperationError.mjs";
import { createNumArray } from "../lib/Arithmetic.mjs";
import { ARITHMETIC_DELIM_OPTIONS } from "../lib/Delim.mjs";


/**
 * MOD operation
 */
class MOD extends Operation {

    /**
     * MOD constructor
     */
    constructor() {
        super();

        this.name = "MOD";
        this.module = "Default";
        this.description =  "用给定的模数计算列表中每个数的余数。数字按分隔符从输入中提取，非数值会被忽略。<br><br>例：<code>15 4 7</code> 在模数 <code>3</code> 下变为 <code>0 1 1</code>";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [
            {
                "name": "Modulus",
                "type": "number",
                "value": 2
            },
            {
                "name": "Delimiter",
                "type": "option",
                "value": ARITHMETIC_DELIM_OPTIONS,
            }
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        const modulus = new BigNumber(args[0]);
        const delimiter = args[1];

        if (modulus.isZero()) {
            throw new OperationError("Modulus cannot be zero");
        }

        const numbers = createNumArray(input, delimiter);
        const results = numbers.map(num => num.mod(modulus));

        return results.join(" ");
    }

}

export default MOD;
