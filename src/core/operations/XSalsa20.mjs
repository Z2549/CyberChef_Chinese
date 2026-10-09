/**
 * @author joostrijneveld [joost@joostrijneveld.nl]
 * @copyright Crown Copyright 2024
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import OperationError from "../errors/OperationError.mjs";
import Utils from "../Utils.mjs";
import { toHex } from "../lib/Hex.mjs";
import { salsa20Block, hsalsa20 } from "../lib/Salsa20.mjs";

/**
 * XSalsa20 operation
 */
class XSalsa20 extends Operation {

    /**
     * XSalsa20 constructor
     */
    constructor() {
        super();

        this.name = "XSalsa20";
        this.module = "Ciphers";
        this.description =  "XSalsa20 是 Daniel J. Bernstein 设计的 Salsa20 流密码的变体；XSalsa 使用更长的 Nonce。<br><br><b>密钥：</b>XSalsa20 使用 16 或 32 字节（128 或 256 位）的密钥。<br><br><b>Nonce：</b>XSalsa20 使用 24 字节（192 位）的 Nonce。<br><br><b>计数器：</b>XSalsa 使用 8 字节（64 位）的计数器。计数器在密钥流开始时从零开始，每 64 字节递增一次。";
        this.infoURL = "https://en.wikipedia.org/wiki/Salsa20#XSalsa20_with_192-bit_nonce";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [
            {
                "name": "Key",
                "type": "toggleString",
                "value": "",
                "toggleValues": ["Hex", "UTF8", "Latin1", "Base64"]
            },
            {
                "name": "Nonce",
                "type": "toggleString",
                "value": "",
                "toggleValues": ["Hex", "UTF8", "Latin1", "Base64", "Integer"]
            },
            {
                "name": "Counter",
                "type": "number",
                "value": 0,
                "min": 0
            },
            {
                "name": "Rounds",
                "type": "option",
                "value": ["20", "12", "8"]
            },
            {
                "name": "Input",
                "type": "option",
                "value": ["Hex", "Raw"]
            },
            {
                "name": "Output",
                "type": "option",
                "value": ["Raw", "Hex"]
            }
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        const key = Utils.convertToByteArray(args[0].string, args[0].option),
            nonceType = args[1].option,
            rounds = parseInt(args[3], 10),
            inputType = args[4],
            outputType = args[5];

        if (key.length !== 16 && key.length !== 32) {
            throw new OperationError(`Invalid key length: ${key.length} bytes.

XSalsa20 uses a key of 16 or 32 bytes (128 or 256 bits).`);
        }

        let counter, nonce;
        if (nonceType === "Integer") {
            nonce = Utils.intToByteArray(parseInt(args[1].string, 10), 8, "little");
        } else {
            nonce = Utils.convertToByteArray(args[1].string, args[1].option);
            if (!(nonce.length === 24)) {
                throw new OperationError(`Invalid nonce length: ${nonce.length} bytes.

XSalsa20 uses a nonce of 24 bytes (192 bits).`);
            }
        }
        counter = Utils.intToByteArray(args[2], 8, "little");

        const xsalsaKey = hsalsa20(key, nonce.slice(0, 16), rounds);

        const output = [];
        input = Utils.convertToByteArray(input, inputType);

        let counterAsInt = Utils.byteArrayToInt(counter, "little");
        for (let i = 0; i < input.length; i += 64) {
            counter = Utils.intToByteArray(counterAsInt, 8, "little");
            const stream = salsa20Block(xsalsaKey, nonce.slice(16, 24), counter, rounds);
            for (let j = 0; j < 64 && i + j < input.length; j++) {
                output.push(input[i + j] ^ stream[j]);
            }
            counterAsInt++;
        }

        if (outputType === "Hex") {
            return toHex(output);
        } else {
            return Utils.arrayBufferToStr(Uint8Array.from(output).buffer);
        }
    }

    /**
     * Highlight XSalsa20
     *
     * @param {Object[]} pos
     * @param {number} pos[].start
     * @param {number} pos[].end
     * @param {Object[]} args
     * @returns {Object[]} pos
     */
    highlight(pos, args) {
        const inputType = args[4],
            outputType = args[5];
        if (inputType === "Raw" && outputType === "Raw") {
            return pos;
        }
    }

    /**
     * Highlight XSalsa20 in reverse
     *
     * @param {Object[]} pos
     * @param {number} pos[].start
     * @param {number} pos[].end
     * @param {Object[]} args
     * @returns {Object[]} pos
     */
    highlightReverse(pos, args) {
        const inputType = args[4],
            outputType = args[5];
        if (inputType === "Raw" && outputType === "Raw") {
            return pos;
        }
    }

}

export default XSalsa20;
