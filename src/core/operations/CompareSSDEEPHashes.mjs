/**
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import Utils from "../Utils.mjs";
import {HASH_DELIM_OPTIONS} from "../lib/Delim.mjs";
import ssdeepjs from "ssdeep.js";
import OperationError from "../errors/OperationError.mjs";

/**
 * Compare SSDEEP hashes operation
 */
class CompareSSDEEPHashes extends Operation {

    /**
     * CompareSSDEEPHashes constructor
     */
    constructor() {
        super();

        this.name = "Compare SSDEEP hashes";
        this.module = "Crypto";
        this.description =   "比较两个 SSDEEP 模糊哈希值，以确定它们之间的相似度（0 到 100）。";
        this.infoURL = "https://forensics.wiki/ssdeep/";
        this.inputType = "string";
        this.outputType = "Number";
        this.args = [
            {
                "name": "Delimiter",
                "type": "option",
                "value": HASH_DELIM_OPTIONS
            }
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {Number}
     */
    run(input, args) {
        const samples = input.split(Utils.charRep(args[0]));
        if (samples.length !== 2) throw new OperationError("Incorrect number of samples.");
        return ssdeepjs.similarity(samples[0], samples[1]);
    }

}

export default CompareSSDEEPHashes;
