/**
 * @author tlwr [toby@toby.codes]
 * @copyright Crown Copyright 2017
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import Utils from "../Utils.mjs";
import OperationError from "../errors/OperationError.mjs";
import {ALPHABET_OPTIONS} from "../lib/Base58.mjs";

/**
 * To Base58 operation
 */
class ToBase58 extends Operation {

    /**
     * ToBase58 constructor
     */
    constructor() {
        super();

        this.name = "To Base58";
        this.module = "Default";
        this.description =   "Base58（类似于 Base64）是一种对任意字节数据进行编码的符号。与 Base64 不同的是，它删除了容易误读的字符（如 l、I、0 和 O），以提高人类的可读性。<br><br>该操作将数据编码为 ASCII 字符串（包括预设的字母）。<br><br>例： <code>hello world</code> 变成 <code>StV1DL6CwTryKyV</code><br><br>Base58 常用于加密货币（比特币、瑞波币等）。";
        this.infoURL = "https://wikipedia.org/wiki/Base58";
        this.inputType = "ArrayBuffer";
        this.outputType = "string";
        this.args = [
            {
                "name": "Alphabet",
                "type": "editableOption",
                "value": ALPHABET_OPTIONS
            }
        ];
    }

    /**
     * @param {ArrayBuffer} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        input = new Uint8Array(input);
        let alphabet = args[0] || ALPHABET_OPTIONS[0].value,
            result = [];

        alphabet = Utils.expandAlphRange(alphabet).join("");

        if (alphabet.length !== 58 ||
            [].unique.call(alphabet).length !== 58) {
            throw new OperationError("Error: alphabet must be of length 58");
        }

        if (input.length === 0) return "";

        let zeroPrefix = 0;
        for (let i = 0; i < input.length && input[i] === 0; i++) {
            zeroPrefix++;
        }

        input.forEach(function(b) {
            let carry = b;

            for (let i = 0; i < result.length; i++) {
                carry += result[i] << 8;
                result[i] = carry % 58;
                carry = (carry / 58) | 0;
            }

            while (carry > 0) {
                result.push(carry % 58);
                carry = (carry / 58) | 0;
            }
        });

        result = result.map(function(b) {
            return alphabet[b];
        }).reverse().join("");

        while (zeroPrefix--) {
            result = alphabet[0] + result;
        }

        return result;
    }

}

export default ToBase58;
