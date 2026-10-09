/**
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2019
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import OperationError from "../errors/OperationError.mjs";
import GostDigest from "../vendor/gost/gostDigest.mjs";
import { toHexFast } from "../lib/Hex.mjs";

/**
 * GOST hash operation
 */
class GOSTHash extends Operation {

    /**
     * GOSTHash constructor
     */
    constructor() {
        super();

        this.name = "GOST Hash";
        this.module = "Hashing";
        this.description =   "标准 GOST R 34.11-94 和 GOST 34.311-95 中定义的 GOST 哈希函数是一种 256 位加密哈希函数。它最初是在俄罗斯国家标准 GOST R 34.11-94 中定义的<i>信息技术 - 密码信息安全 - 哈希函数</i>. 独联体其他成员国使用的同等标准是 GOST 34.311-95.<br><br>该函数不能与新修订的 GOST R 34.11-2012 标准中定义的另一种 Streebog 哈希函数相混淆。<br><br>GOST 哈希函数以 GOST 区块密码为基础。";
        this.infoURL = "https://wikipedia.org/wiki/GOST_(hash_function)";
        this.inputType = "ArrayBuffer";
        this.outputType = "string";
        this.args = [
            {
                name: "Algorithm",
                type: "argSelector",
                value: [
                    {
                        name: "GOST 28147 (1994)",
                        off: [1],
                        on: [2]
                    },
                    {
                        name: "GOST R 34.11 (Streebog, 2012)",
                        on: [1],
                        off: [2]
                    }
                ]
            },
            {
                name: "Digest length",
                type: "option",
                value: ["256", "512"]
            },
            {
                name: "sBox",
                type: "option",
                value: ["E-TEST", "E-A", "E-B", "E-C", "E-D", "E-SC", "E-Z", "D-TEST", "D-A", "D-SC"]
            }
        ];
    }

    /**
     * @param {ArrayBuffer} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        const [version, length, sBox] = args;

        const versionNum = version === "GOST 28147 (1994)" ? 1994 : 2012;
        const algorithm = {
            name: versionNum === 1994 ? "GOST 28147" : "GOST R 34.10",
            version: versionNum,
            mode: "HASH"
        };

        if (versionNum === 1994) {
            algorithm.sBox = sBox;
        } else {
            algorithm.length = parseInt(length, 10);
        }

        try {
            const gostDigest = new GostDigest(algorithm);

            return toHexFast(gostDigest.digest(input));
        } catch (err) {
            throw new OperationError(err);
        }
    }

}

export default GOSTHash;
