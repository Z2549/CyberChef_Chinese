/**
 * @author j433866 [j433866@gmail.com]
 * @copyright Crown Copyright 2019
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import OperationError from "../errors/OperationError.mjs";
import { isImage } from "../lib/FileType.mjs";
import { toBase64 } from "../lib/Base64.mjs";
import { isWorkerEnvironment } from "../Utils.mjs";
import { Jimp, JimpMime } from "jimp";

/**
 * Crop Image operation
 */
class CropImage extends Operation {
    /**
     * CropImage constructor
     */
    constructor() {
        super();

        this.name = "Crop Image";
        this.module = "Image";
        this.description =
              "将图像裁剪到指定区域，或自动裁剪边缘。<br><br><b><u>自动裁剪</u></b><br>自动从图像中裁剪相同颜色的边框。<br><br><u>自动裁切宽容</u><br>像素间色差容忍度的百分比值。<br><br><u>只有自动裁剪框架</u><br>只裁剪真实帧(所有边必须有相同的边框)<br><br><u>对称自动裁切</u><br>强制自动裁剪为对称(上/下和左/右裁剪相同的量)<br><br><u>自动裁剪边框</u><br>要在图像周围留下的边框像素数。";
        this.infoURL = "https://wikipedia.org/wiki/Cropping_(image)";
        this.inputType = "ArrayBuffer";
        this.outputType = "ArrayBuffer";
        this.presentType = "html";
        this.args = [
            {
                name: "X Position",
                type: "number",
                value: 0,
                min: 0,
            },
            {
                name: "Y Position",
                type: "number",
                value: 0,
                min: 0,
            },
            {
                name: "Width",
                type: "number",
                value: 10,
                min: 1,
            },
            {
                name: "Height",
                type: "number",
                value: 10,
                min: 1,
            },
            {
                name: "Autocrop",
                type: "boolean",
                value: false,
            },
            {
                name: "Autocrop tolerance (%)",
                type: "number",
                value: 0.02,
                min: 0,
                max: 100,
                step: 0.01,
            },
            {
                name: "Only autocrop frames",
                type: "boolean",
                value: true,
            },
            {
                name: "Symmetric autocrop",
                type: "boolean",
                value: false,
            },
            {
                name: "Autocrop keep border (px)",
                type: "number",
                value: 0,
                min: 0,
            },
        ];
    }

    /**
     * @param {ArrayBuffer} input
     * @param {Object[]} args
     * @returns {byteArray}
     */
    async run(input, args) {
        const [
            xPos,
            yPos,
            width,
            height,
            autocrop,
            autoTolerance,
            autoFrames,
            autoSymmetric,
            autoBorder,
        ] = args;
        if (!isImage(input)) {
            throw new OperationError("Invalid file type.");
        }

        let image;
        try {
            image = await Jimp.read(input);
        } catch (err) {
            throw new OperationError(`Error loading image. (${err})`);
        }
        try {
            if (isWorkerEnvironment())
                self.sendStatusMessage("Cropping image...");
            if (autocrop) {
                image.autocrop({
                    tolerance: autoTolerance / 100,
                    cropOnlyFrames: autoFrames,
                    cropSymmetric: autoSymmetric,
                    leaveBorder: autoBorder,
                });
            } else {
                image.crop({
                    x: xPos,
                    y: yPos,
                    w: width,
                    h: height,
                });
            }

            let imageBuffer;
            if (image.mime === "image/gif") {
                imageBuffer = await image.getBuffer(JimpMime.png);
            } else {
                imageBuffer = await image.getBuffer(image.mime);
            }
            return imageBuffer.buffer;
        } catch (err) {
            throw new OperationError(`Error cropping image. (${err})`);
        }
    }

    /**
     * Displays the cropped image using HTML for web apps
     * @param {ArrayBuffer} data
     * @returns {html}
     */
    present(data) {
        if (!data.byteLength) return "";
        const dataArray = new Uint8Array(data);

        const type = isImage(dataArray);
        if (!type) {
            throw new OperationError("Invalid file type.");
        }

        return `<img src="data:${type};base64,${toBase64(dataArray)}">`;
    }
}

export default CropImage;
