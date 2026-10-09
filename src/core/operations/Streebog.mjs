/**
 * @author mshwed [m@ttshwed.com]
 * @copyright Crown Copyright 2019
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import OperationError from "../errors/OperationError.mjs";
import GostDigest from "../vendor/gost/gostDigest.mjs";
import {toHexFast} from "../lib/Hex.mjs";

/**
 * Streebog operation
 */
class Streebog extends Operation {

    /**
     * Streebog constructor
     */
    constructor() {
        super();

        this.name = "Streebog";
        this.module = "Hashing";
        this.description =   "Streebog是俄罗斯国家标准G O S T R 34.11 2012中定义的加密哈希函数<i>信息技术。密码信息安全。哈希函数</i>. 它的诞生是为了取代旧标准 GOST R 34.11-94 中定义的过时的 GOST 哈希函数，并作为对美国国家标准与技术研究院举办的 SHA-3 竞赛的非对称回应。";
        this.infoURL = "https://wikipedia.org/wiki/Streebog";
        this.inputType = "ArrayBuffer";
        this.outputType = "string";
        this.args = [
            {
                "name": "Digest length",
                "type": "option",
                "value": ["256", "512"]
            }
        ];
    }

    /**
     * @param {ArrayBuffer} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        const [length] = args;

        const algorithm = {
            version: 2012,
            mode: "HASH",
            length: parseInt(length, 10)
        };

        try {
            const gostDigest = new GostDigest(algorithm);

            return toHexFast(gostDigest.digest(input));
        } catch (err) {
            throw new OperationError(err);
        }
    }

}

export default Streebog;
