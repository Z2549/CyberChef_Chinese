/**
 * @author Ge0rg3 [georgeomnet+cyberchef@gmail.com]
 * @copyright Crown Copyright 2019
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import OperationError from "../errors/OperationError.mjs";
import { isImage } from "../lib/FileType.mjs";
import { Jimp } from "jimp";

import { RGBA_DELIM_OPTIONS } from "../lib/Delim.mjs";

/**
 * Extract RGBA operation
 */
class ExtractRGBA extends Operation {
    /**
     * ExtractRGBA constructor
     */
    constructor() {
        super();

        this.name = "Extract RGBA";
        this.module = "Image";
        this.description =
              "提取图像中每个像素的 RGBA 值。这种方法有时会用于隐写术，以隐藏文本或数据。";
        this.infoURL = "https://wikipedia.org/wiki/RGBA_color_space";
        this.inputType = "ArrayBuffer";
        this.outputType = "string";
        this.args = [
            {
                name: "Delimiter",
                type: "editableOption",
                value: RGBA_DELIM_OPTIONS,
            },
            {
                name: "Include Alpha",
                type: "boolean",
                value: true,
            },
        ];
    }

    /**
     * @param {ArrayBuffer} input
     * @param {Object[]} args
     * @returns {string}
     */
    async run(input, args) {
        if (!isImage(input))
            throw new OperationError("Please enter a valid image file.");

        const delimiter = args[0],
            includeAlpha = args[1],
            parsedImage = await Jimp.read(input);

        let bitmap = parsedImage.bitmap.data;
        bitmap = includeAlpha ?
            bitmap :
            bitmap.filter((val, idx) => idx % 4 !== 3);

        return bitmap.join(delimiter);
    }
}

export default ExtractRGBA;
