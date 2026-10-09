/**
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";

/**
 * Bit shift right operation
 */
class BitShiftRight extends Operation {

    /**
     * BitShiftRight constructor
     */
    constructor() {
        super();

        this.name = "Bit shift right";
        this.module = "Default";
        this.description =   "将每个字节中的位向右移动指定的量。<br><br><i>逻辑的转变</i> 将最左边的位替换为零。<br><i>算术的转变</i> 保留原始字节的最有效位（MSB），保持符号不变（正或负）。";
        this.infoURL = "https://wikipedia.org/wiki/Bitwise_operation#Bit_shifts";
        this.inputType = "ArrayBuffer";
        this.outputType = "ArrayBuffer";
        this.args = [
            {
                "name": "Amount",
                "type": "number",
                "value": 1
            },
            {
                "name": "Type",
                "type": "option",
                "value": ["Logical shift", "Arithmetic shift"]
            }
        ];
    }

    /**
     * @param {ArrayBuffer} input
     * @param {Object[]} args
     * @returns {ArrayBuffer}
     */
    run(input, args) {
        const amount = args[0],
            type = args[1],
            mask = type === "Logical shift" ? 0 : 0x80;
        input = new Uint8Array(input);

        return input.map(b => {
            return (b >>> amount) ^ (b & mask);
        }).buffer;
    }

    /**
     * Highlight Bit shift right
     *
     * @param {Object[]} pos
     * @param {number} pos[].start
     * @param {number} pos[].end
     * @param {Object[]} args
     * @returns {Object[]} pos
     */
    highlight(pos, args) {
        return pos;
    }

    /**
     * Highlight Bit shift right in reverse
     *
     * @param {Object[]} pos
     * @param {number} pos[].start
     * @param {number} pos[].end
     * @param {Object[]} args
     * @returns {Object[]} pos
     */
    highlightReverse(pos, args) {
        return pos;
    }

}

export default BitShiftRight;
