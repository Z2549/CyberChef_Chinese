/**
 * @author n1073645 [n1073645@gmail.com]
 * @author k3ach [k3ach@proton.me]
 * @copyright Crown Copyright 2020
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import OperationError from "../errors/OperationError.mjs";

/**
 * Luhn Checksum operation
 */
class LuhnChecksum extends Operation {

    /**
     * LuhnChecksum constructor
     */
    constructor() {
        super();

        this.name = "Luhn Checksum";
        this.module = "Default";
        this.description =   "基于英文字母表的 Luhn mod N 算法。Luhn mod N 算法是 Luhn 算法（也称模 10 算法）的扩展，支持对任意偶数进制的数值序列进行计算。当需要用校验位验证由字母、字母与数字的组合，或任意 N 个字符（N 可被 2 整除）构成的标识字符串时，该算法非常实用。";
        this.infoURL = "https://en.wikipedia.org/wiki/Luhn_mod_N_algorithm";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [
            {
                "name": "Radix",
                "type": "number",
                "value": 10
            }
        ];
    }

    /**
     * Generates the Luhn checksum from the input.
     *
     * @param {string} inputStr
     * @returns {number}
     */
    checksum(inputStr, radix = 10) {
        let even = false;
        return inputStr.split("").reverse().reduce((acc, elem) => {
            // Convert element to an integer based on the provided radix.
            let temp = parseInt(elem, radix);

            // If element is not a valid number in the given radix.
            if (isNaN(temp)) {
                throw new OperationError("Character: " + elem + " is not valid in radix " + radix + ".");
            }

            // If element is in an even position
            if (even) {
                // Double the element and sum the quotient and remainder.
                temp = 2 * temp;
                temp = Math.floor(temp / radix) + (temp % radix);
            }

            even = !even;
            return acc + temp;
        }, 0) % radix; // Use radix as the modulus base
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        if (!input) return "";

        const radix = args[0];

        if (radix < 2 || radix > 36) {
            throw new OperationError("Error: Radix argument must be between 2 and 36");
        }

        if (radix % 2 !== 0) {
            throw new OperationError("Error: Radix argument must be divisible by 2");
        }

        const checkSum = this.checksum(input, radix).toString(radix);
        let checkDigit = this.checksum(input + "0", radix);
        checkDigit = checkDigit === 0 ? 0 : (radix - checkDigit);
        checkDigit = checkDigit.toString(radix);

        return `Checksum: ${checkSum}
Checkdigit: ${checkDigit}
Luhn Validated String: ${input + "" + checkDigit}`;
    }

}

export default LuhnChecksum;
