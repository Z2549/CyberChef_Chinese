/**
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2017
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import BigNumber from "bignumber.js";
import OperationError from "../errors/OperationError.mjs";

/**
 * UNIX Timestamp to Windows Filetime operation
 */
class UNIXTimestampToWindowsFiletime extends Operation {

    /**
     * UNIXTimestampToWindowsFiletime constructor
     */
    constructor() {
        super();

        this.name = "UNIX Timestamp to Windows Filetime";
        this.module = "Default";
        this.description =   "将 UNIX 时间戳转换为 Windows Filetime 值。<br><br>Windows Filetime 是一个 64 位值，代表自世界协调时 1601 年 1 月 1 日以来的 100 纳秒间隔数。<br><br>UNIX 时间戳是一个 32 位值，代表自 1970 年 1 月 1 日（世界协调时）起的秒数（UNIX 的纪元）。<br><br>该操作还支持以毫秒、微秒和纳秒为单位的 UNIX 时间戳。";
        this.infoURL = "https://msdn.microsoft.com/en-us/library/windows/desktop/ms724284(v=vs.85).aspx";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [
            {
                "name": "Input units",
                "type": "option",
                "value": ["Seconds (s)", "Milliseconds (ms)", "Microseconds (μs)", "Nanoseconds (ns)"]
            },
            {
                "name": "Output format",
                "type": "option",
                "value": ["Decimal", "Hex (big endian)", "Hex (little endian)"]
            }
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        const [units, format] = args;

        if (!input) return "";

        input = new BigNumber(input);

        if (units === "Seconds (s)") {
            input = input.multipliedBy(new BigNumber("10000000"));
        } else if (units === "Milliseconds (ms)") {
            input = input.multipliedBy(new BigNumber("10000"));
        } else if (units === "Microseconds (μs)") {
            input = input.multipliedBy(new BigNumber("10"));
        } else if (units === "Nanoseconds (ns)") {
            input = input.dividedBy(new BigNumber("100"));
        } else {
            throw new OperationError("Unrecognised unit");
        }

        input = input.plus(new BigNumber("116444736000000000"));

        let result;
        if (format.startsWith("Hex")) {
            result = input.toString(16);
        } else {
            result = input.toFixed();
        }

        if (format === "Hex (little endian)") {
            // Swap endianness
            let flipped = "";
            for (let i = result.length - 2; i >= 0; i -= 2) {
                flipped += result.charAt(i);
                flipped += result.charAt(i + 1);
            }
            if (result.length % 2 !== 0) {
                flipped += "0" + result.charAt(0);
            }
            result = flipped;
        }

        return result;
    }

}

export default UNIXTimestampToWindowsFiletime;
