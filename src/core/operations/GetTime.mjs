/**
 * @author n1073645 [n1073645@gmail.com]
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2020
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import OperationError from "../errors/OperationError.mjs";
import {UNITS} from "../lib/DateTime.mjs";

/**
 * Get Time operation
 */
class GetTime extends Operation {

    /**
     * GetTime constructor
     */
    constructor() {
        super();

        this.name = "Get Time";
        this.module = "Default";
        this.description =   "生成一个时间戳，显示自 UNIX 纪元（1970-01-01 00:00:00 UTC）以来的时间。使用 W3C 高分辨率时间 API。";
        this.infoURL = "https://wikipedia.org/wiki/Unix_time";
        this.inputType = "string";
        this.outputType = "number";
        this.args = [
            {
                name: "Granularity",
                type: "option",
                value: UNITS
            }
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {number}
     */
    run(input, args) {
        const nowMs = (performance.timeOrigin + performance.now()),
            granularity = args[0];

        switch (granularity) {
            case "Nanoseconds (ns)":
                return Math.round(nowMs * 1000 * 1000);
            case "Microseconds (μs)":
                return Math.round(nowMs * 1000);
            case "Milliseconds (ms)":
                return Math.round(nowMs);
            case "Seconds (s)":
                return Math.round(nowMs / 1000);
            default:
                throw new OperationError("Unknown granularity value: " + granularity);
        }
    }

}

export default GetTime;
