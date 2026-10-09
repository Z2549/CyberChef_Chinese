/**
 * @author tlwr [toby@toby.codes]
 * @copyright Crown Copyright 2017
 * @license Apache-2.0
 */

import ExifParser from "exif-parser";
import Operation from "../Operation.mjs";
import OperationError from "../errors/OperationError.mjs";

/**
 * Extract EXIF operation
 */
class ExtractEXIF extends Operation {

    /**
     * ExtractEXIF constructor
     */
    constructor() {
        super();

        this.name = "Extract EXIF";
        this.module = "Image";
        this.description =   "从图像中提取E X I F数据。\\n<br><br>\\nEXIF 数据是嵌入在图像（JPEG、JPG、TIFF）和音频文件中的元数据。\\n<br><br>\\n来自照片的EXIF数据通常包含有关图像文件本身以及用于创建它的设备的信息。";
        this.infoURL = "https://wikipedia.org/wiki/Exif";
        this.inputType = "ArrayBuffer";
        this.outputType = "string";
        this.args = [];
    }

    /**
     * @param {ArrayBuffer} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        try {
            const parser = ExifParser.create(input);
            const result = parser.parse();

            const lines = [];
            for (const tagName in result.tags) {
                const value = result.tags[tagName];
                lines.push(`${tagName}: ${value}`);
            }

            const numTags = lines.length;
            lines.unshift(`Found ${numTags} tags.\n`);
            return lines.join("\n");
        } catch (err) {
            throw new OperationError(`Could not extract EXIF data from image: ${err}`);
        }
    }

}

export default ExtractEXIF;
