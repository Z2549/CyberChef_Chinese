/**
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import bcrypt from "bcryptjs";
import { isWorkerEnvironment } from "../Utils.mjs";

/**
 * Bcrypt operation
 */
class Bcrypt extends Operation {

    /**
     * Bcrypt constructor
     */
    constructor() {
        super();

        this.name = "Bcrypt";
        this.module = "Crypto";
        this.description =   "bcrypt 是一种密码散列函数，由 Niels Provos 和 David Mazières 设计，基于 Blowfish 密码，并于 1999 年在 USENIX 上发布。除了加入盐以抵御彩虹表攻击外，bcrypt 还是一个自适应函数：随着时间的推移，迭代次数（轮数）可以增加，使其速度变慢，因此即使计算能力不断提高，它仍能抵御暴力搜索攻击。<br><br>在输入框中输入密码，生成密码的哈希值。";
        this.infoURL = "https://wikipedia.org/wiki/Bcrypt";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [
            {
                "name": "Rounds",
                "type": "number",
                "value": 10
            }
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    async run(input, args) {
        const rounds = args[0];
        const salt = await bcrypt.genSalt(rounds);

        return await bcrypt.hash(input, salt, undefined, p => {
            // Progress callback
            if (isWorkerEnvironment())
                self.sendStatusMessage(`Progress: ${(p * 100).toFixed(0)}%`);
        });

    }

}

export default Bcrypt;
