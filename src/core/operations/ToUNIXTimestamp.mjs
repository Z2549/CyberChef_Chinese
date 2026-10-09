/**
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import moment from "moment-timezone";
import {UNITS} from "../lib/DateTime.mjs";
import OperationError from "../errors/OperationError.mjs";

/**
 * To UNIX Timestamp operation
 */
class ToUNIXTimestamp extends Operation {

    /**
     * ToUNIXTimestamp constructor
     */
    constructor() {
        super();

        this.name = "To UNIX Timestamp";
        this.module = "Default";
        this.description =   "解析以 UTC 表示的日期时间字符串，并返回相应的 UNIX 时间戳。<br><br>例： <code>Mon 1 January 2001 11:00:00</code> 变成 <code>978346800</code><br><br>UNIX 时间戳是一个 32 位值，代表自 1970 年 1 月 1 日（世界协调时）起的秒数（UNIX 的纪元）。";
        this.infoURL = "https://wikipedia.org/wiki/Unix_time";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [
            {
                "name": "Units",
                "type": "option",
                "value": UNITS
            },
            {
                "name": "Treat as UTC",
                "type": "boolean",
                "value": true
            },
            {
                "name": "Show parsed datetime",
                "type": "boolean",
                "value": true
            }
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     *
     * @throws {OperationError} if unit unrecognised
     */
    run(input, args) {
        const [units, treatAsUTC, showDateTime] = args,
            d = treatAsUTC ? moment.utc(input) : moment(input);

        let result = "";

        if (units === "Seconds (s)") {
            result = d.unix();
        } else if (units === "Milliseconds (ms)") {
            result = d.valueOf();
        } else if (units === "Microseconds (μs)") {
            result = d.valueOf() * 1000;
        } else if (units === "Nanoseconds (ns)") {
            result = d.valueOf() * 1000000;
        } else {
            throw new OperationError("Unrecognised unit");
        }

        return showDateTime ? `${result} (${d.tz("UTC").format("ddd D MMMM YYYY HH:mm:ss")} UTC)` : result.toString();
    }

}

export default ToUNIXTimestamp;
