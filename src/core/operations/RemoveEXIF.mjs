/**
 * @author tlwr [toby@toby.codes]
 * @copyright Crown Copyright 2017
 * @license Apache-2.0
 */

import { removeEXIF } from "../vendor/remove-exif.mjs";
import Operation from "../Operation.mjs";
import OperationError from "../errors/OperationError.mjs";

/**
 * Remove EXIF operation
 */
class RemoveEXIF extends Operation {

    /**
     * RemoveEXIF constructor
     */
    constructor() {
        super();

        this.name = "Remove EXIF";
        this.module = "Image";
        this.description =   "删除 JPEG 图像中的 EXIF 数据。\\n<br><br>\\n照片中嵌入的 EXIF 数据通常包含有关图像文件本身以及创建该文件所用设备的信息。";
        this.infoURL = "https://wikipedia.org/wiki/Exif";
        this.inputType = "ArrayBuffer";
        this.outputType = "byteArray";
        this.args = [];
    }

    /**
     * @param {ArrayBuffer} input
     * @param {Object[]} args
     * @returns {byteArray}
     */
    run(input, args) {
        input = new Uint8Array(input);
        // Do nothing if input is empty
        if (input.length === 0) return input;

        try {
            return removeEXIF(input);
        } catch (err) {
            // Simply return input if no EXIF data is found
            if (err === "Exif not found.") return input;
            throw new OperationError(`Could not remove EXIF data from image: ${err}`);
        }
    }

}

export default RemoveEXIF;
