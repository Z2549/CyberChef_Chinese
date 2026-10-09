/**
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import {runHash} from "../lib/Hash.mjs";

/**
 * SHA2 operation
 */
class SHA2 extends Operation {

    /**
     * SHA2 constructor
     */
    constructor() {
        super();

        this.name = "SHA2";
        this.module = "Crypto";
        this.description =   "SHA-2（安全散列算法 2）系列散列函数由美国国家安全局（NSA）设计，相较其前身 SHA-1 有重大变化。SHA-2 家族包含摘要（散列值）长度为 224、256、384 或 512 位的散列函数：SHA224、SHA256、SHA384、SHA512。<br><br><ul><li>SHA-512 以 64 位字为单位运算。</li><li>SHA-256 以 32 位字为单位运算。</li><li>SHA-384 与 SHA-512 基本相同，但截断至 384 位。</li><li>SHA-224 与 SHA-256 基本相同，但截断至 224 位。</li><li>SHA-512/224 与 SHA-512/256 是 SHA-512 的截断版本，但初始值按联邦信息处理标准（FIPS）PUB 180-4 中描述的方法生成。</li></ul>SHA256 系列的消息摘要算法默认执行 64 轮，SHA512 系列默认执行 160 轮。";
        this.infoURL = "https://wikipedia.org/wiki/SHA-2";
        this.inputType = "ArrayBuffer";
        this.outputType = "string";
        this.args = [
            {
                name: "Size",
                type: "argSelector",
                value: [
                    {
                        name: "512",
                        on: [2],
                        off: [1]
                    },
                    {
                        name: "384",
                        on: [2],
                        off: [1]
                    },
                    {
                        name: "256",
                        on: [1],
                        off: [2]
                    },
                    {
                        name: "224",
                        on: [1],
                        off: [2]
                    },
                    {
                        name: "512/256",
                        on: [2],
                        off: [1]
                    },
                    {
                        name: "512/224",
                        on: [2],
                        off: [1]
                    }
                ]
            },
            {
                name: "Rounds", // For SHA256 variants
                type: "number",
                value: 64,
                min: 16
            },
            {
                name: "Rounds", // For SHA512 variants
                type: "number",
                value: 160,
                min: 32
            }
        ];
    }

    /**
     * @param {ArrayBuffer} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        const size = args[0];
        const rounds = (size === "256" || size === "224") ? args[1] : args[2];
        return runHash("sha" + size, input, {rounds: rounds});
    }

}

export default SHA2;
