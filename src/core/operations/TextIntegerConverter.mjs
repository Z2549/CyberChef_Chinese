/**
 * @author p-leriche [philip.leriche@cantab.net]
 * @copyright Crown Copyright 2025
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import OperationError from "../errors/OperationError.mjs";

/* ---------- helper functions ---------- */

/**
 * Convert text to BigInt (big-endian byte interpretation)
 */
function textToBigInt(text) {
    if (text.length === 0) return 0n;

    let result = 0n;
    for (let i = 0; i < text.length; i++) {
        const charCode = BigInt(text.charCodeAt(i));
        if (charCode > 255n) {
            throw new OperationError(
                `Character at position ${i} exceeds Latin-1 range (0-255).\n` +
                "Only ASCII and Latin-1 characters are supported.");
        }
        result = (result << 8n) | charCode;
    }
    return result;
}

/**
 * Convert BigInt to text (big-endian byte interpretation)
 */
function bigIntToText(value) {
    if (value === 0n) return "";

    const bytes = [];
    let num = value;

    while (num > 0n) {
        bytes.unshift(Number(num & 0xFFn));
        num >>= 8n;
    }

    return String.fromCharCode(...bytes);
}

/* ---------- operation class ---------- */

/**
 * Text/Integer Converter operation
 */
class TextIntegerConverter extends Operation {
    /**
     * TextIntegerConverter constructor
     */
    constructor() {
        super();

        this.description =
             "在文本字符串与大整数（十进制或十六进制）之间转换。<br><br>";
        this.infoURL = "https://wikipedia.org/wiki/Endianness";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [
            {
                name: "Output format",
                type: "option",
                value: ["String", "Decimal", "Hexadecimal"]
            }
        ];
        this.name = "Text-Integer Conversion";
        this.module = "Default";
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        const outputFormat = args[0];
        const trimmed = input.trim();

        let bigIntValue;

        if (!trimmed) {
            // Null input - treat as zero
            bigIntValue = 0;
        } else if (/^0x[0-9a-f]+$/i.test(trimmed) ||
            /^[+-]?[0-9]+$/.test(trimmed)) {
            // Hex or decimal integer
            bigIntValue = BigInt(trimmed);
        } else if (/^["'].*["']$/.test(trimmed)) {
            // Quoted string: Remove quotes and convert text to BigInt
            const text = trimmed.slice(1, -1);
            bigIntValue = textToBigInt(text);
        } else {
            // Assume it's unquoted text
            bigIntValue = textToBigInt(trimmed);
        }

        // Convert to output format
        if (outputFormat === "String") {
            return bigIntToText(bigIntValue);
        } else if (outputFormat === "Decimal") {
            return bigIntValue.toString();
        } else { // Hexadecimal
            return "0x" + bigIntValue.toString(16);
        }
    }
}

export default TextIntegerConverter;
