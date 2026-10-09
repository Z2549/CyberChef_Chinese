/**
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import JSSHA3 from "js-sha3";
import OperationError from "../errors/OperationError.mjs";

/**
 * Keccak operation
 */
class Keccak extends Operation {

    /**
     * Keccak constructor
     */
    constructor() {
        super();

        this.name = "Keccak";
        this.module = "Crypto";
        this.description =   "Keccak哈希算法是由Guido Bertoni, Joan Daemen, Michaël Peeters和Gilles Van Assche在Radio Gatún的基础上设计的。它被选为shs3设计比赛的获胜者。<br><br>这个版本的算法是Keccak[c=2d]，与s3规范不同。";
        this.infoURL = "https://wikipedia.org/wiki/SHA-3";
        this.inputType = "ArrayBuffer";
        this.outputType = "string";
        this.args = [
            {
                "name": "Size",
                "type": "option",
                "value": ["512", "384", "256", "224"]
            }
        ];
    }

    /**
     * @param {ArrayBuffer} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        const size = parseInt(args[0], 10);
        let algo;

        switch (size) {
            case 224:
                algo = JSSHA3.keccak224;
                break;
            case 384:
                algo = JSSHA3.keccak384;
                break;
            case 256:
                algo = JSSHA3.keccak256;
                break;
            case 512:
                algo = JSSHA3.keccak512;
                break;
            default:
                throw new OperationError("Invalid size");
        }

        return algo(input);
    }

}

export default Keccak;
