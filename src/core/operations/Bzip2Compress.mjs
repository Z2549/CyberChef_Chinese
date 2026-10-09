/**
 * @author Matt C [me@mitt.dev]
 * @copyright Crown Copyright 2019
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import OperationError from "../errors/OperationError.mjs";
import Bzip2 from "libbzip2-wasm";
import { isWorkerEnvironment } from "../Utils.mjs";

/**
 * Bzip2 Compress operation
 */
class Bzip2Compress extends Operation {

    /**
     * Bzip2Compress constructor
     */
    constructor() {
        super();

        this.name = "Bzip2 Compress";
        this.module = "Compression";
        this.description =  "Bzip2 是 Julian Seward（GHC 的作者）开发的压缩库，采用 Burrows-Wheeler 算法。它只支持压缩单个文件，压缩速度较慢，但比 Deflate（.gz 与 .zip）更高效。";
        this.infoURL = "https://wikipedia.org/wiki/Bzip2";
        this.inputType = "ArrayBuffer";
        this.outputType = "ArrayBuffer";
        this.args = [
            {
                name: "Block size (100s of kb)",
                type: "number",
                value: 9,
                min: 1,
                max: 9
            },
            {
                name: "Work factor",
                type: "number",
                value: 30
            }
        ];
    }

    /**
     * @param {ArrayBuffer} input
     * @param {Object[]} args
     * @returns {File}
     */
    async run(input, args) {
        const [blockSize, workFactor] = args;
        if (input.byteLength <= 0) {
            throw new OperationError("Please provide an input.");
        }
        if (isWorkerEnvironment()) self.sendStatusMessage("Loading Bzip2...");
        return new Promise((resolve, reject) => {
            Bzip2().then(bzip2 => {
                if (isWorkerEnvironment()) self.sendStatusMessage("Compressing data...");
                const inpArray = new Uint8Array(input);
                const bzip2cc = bzip2.compressBZ2(inpArray, blockSize, workFactor);
                if (bzip2cc.error !== 0) {
                    reject(new OperationError(bzip2cc.error_msg));
                } else {
                    const output = bzip2cc.output;
                    resolve(output.buffer.slice(output.byteOffset, output.byteLength + output.byteOffset));
                }
            });
        });
    }

}

export default Bzip2Compress;
