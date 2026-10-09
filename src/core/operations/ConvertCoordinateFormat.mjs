/**
 * @author j433866 [j433866@gmail.com]
 * @copyright Crown Copyright 2019
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import {FORMATS, convertCoordinates} from "../lib/ConvertCoordinates.mjs";

/**
 * Convert co-ordinate format operation
 */
class ConvertCoordinateFormat extends Operation {

    /**
     * ConvertCoordinateFormat constructor
     */
    constructor() {
        super();

        this.name = "Convert co-ordinate format";
        this.module = "Hashing";
        this.description =   "在不同格式之间转换地理坐标。<br><br>支持的格式:<ul><li>度分秒 (DMS)</li><li>十进制分 (DDM)</li><li>十进制度 (DD)</li><li>地理哈希</li><li>军用网格参考系统 (MGRS)</li><li>国家地形测量网 (OSNG)</li><li>通用横向墨卡托 (UTM)</li></ul><br>该操作可以尝试自动检测输入坐标格式和分隔符，但这可能并不总是正确工作。";
        this.infoURL = "https://wikipedia.org/wiki/Geographic_coordinate_conversion";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [
            {
                "name": "Input Format",
                "type": "option",
                "value": ["Auto"].concat(FORMATS)
            },
            {
                "name": "Input Delimiter",
                "type": "option",
                "value": [
                    "Auto",
                    "Direction Preceding",
                    "Direction Following",
                    "\\n",
                    "Comma",
                    "Semi-colon",
                    "Colon"
                ]
            },
            {
                "name": "Output Format",
                "type": "option",
                "value": FORMATS
            },
            {
                "name": "Output Delimiter",
                "type": "option",
                "value": [
                    "Space",
                    "\\n",
                    "Comma",
                    "Semi-colon",
                    "Colon"
                ]
            },
            {
                "name": "Include Compass Directions",
                "type": "option",
                "value": [
                    "None",
                    "Before",
                    "After"
                ]
            },
            {
                "name": "Precision",
                "type": "number",
                "value": 3
            }
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        if (input.replace(/[\s+]/g, "") !== "") {
            const [inFormat, inDelim, outFormat, outDelim, incDirection, precision] = args;
            const result = convertCoordinates(input, inFormat, inDelim, outFormat, outDelim, incDirection, precision);
            return result;
        } else {
            return input;
        }
    }
}

export default ConvertCoordinateFormat;
