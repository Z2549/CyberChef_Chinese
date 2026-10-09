/**
 * Emulation of the Typex machine.
 *
 * Tested against a genuine Typex machine using a variety of inputs
 * and settings to confirm correctness.
 *
 * @author s2224834
 * @copyright Crown Copyright 2019
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import OperationError from "../errors/OperationError.mjs";
import {LETTERS, Reflector} from "../lib/Enigma.mjs";
import {ROTORS, REFLECTORS, TypexMachine, Plugboard, Rotor} from "../lib/Typex.mjs";

/**
 * Typex operation
 */
class Typex extends Operation {
    /**
     * Typex constructor
     */
    constructor() {
        super();

        this.name = "Typex";
        this.module = "Bletchley";
        this.description =   "使用二战时期的 Typex 机器进行密码/解密。<br><br>Typex 最初由英国皇家空军在二战前制造，以英格玛机器为基础进行了一些改进，包括使用具有更多步进点的五个转子和可互换的线芯。它被英国和英联邦国家军队广泛使用。后来又生产了许多变体；这里我们模拟的是二战时期的 Mark 22 Typex，带有反射器和输入插板。Typex 转子定期更换，没有公开的：我们提供了一组随机示例。<br><br>要配置反射器插件板，请在反射器框中输入一串相连的字母对, 例： <code>AB CD EF</code> 将 A 连接到 B，C 连接到 D，E 连接到 F（您需要连接每个字母）。还有一个输入插板: 与Enigma的配线板不同，它不限于对，所以它像转子一样输入(没有步进)。要创建自己的转子，输入转子映射A到Z的字母，按顺序，可选地跟着 <code>&lt;</code> 然后是一个步进点的列表。<br><br>对谜机、泰克斯和炸弹机操作的更详细的描述 <a href='https://github.com/gchq/CyberChef/wiki/Enigma,-the-Bombe,-and-Typex'>可以在这里找到</a>.";
        this.infoURL = "https://wikipedia.org/wiki/Typex";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [
            {
                name: "1st (left-hand) rotor",
                type: "editableOption",
                value: ROTORS,
                defaultIndex: 0
            },
            {
                name: "1st rotor reversed",
                type: "boolean",
                value: false
            },
            {
                name: "1st rotor ring setting",
                type: "option",
                value: LETTERS
            },
            {
                name: "1st rotor initial value",
                type: "option",
                value: LETTERS
            },
            {
                name: "2nd rotor",
                type: "editableOption",
                value: ROTORS,
                defaultIndex: 1
            },
            {
                name: "2nd rotor reversed",
                type: "boolean",
                value: false
            },
            {
                name: "2nd rotor ring setting",
                type: "option",
                value: LETTERS
            },
            {
                name: "2nd rotor initial value",
                type: "option",
                value: LETTERS
            },
            {
                name: "3rd (middle) rotor",
                type: "editableOption",
                value: ROTORS,
                defaultIndex: 2
            },
            {
                name: "3rd rotor reversed",
                type: "boolean",
                value: false
            },
            {
                name: "3rd rotor ring setting",
                type: "option",
                value: LETTERS
            },
            {
                name: "3rd rotor initial value",
                type: "option",
                value: LETTERS
            },
            {
                name: "4th (static) rotor",
                type: "editableOption",
                value: ROTORS,
                defaultIndex: 3
            },
            {
                name: "4th rotor reversed",
                type: "boolean",
                value: false
            },
            {
                name: "4th rotor ring setting",
                type: "option",
                value: LETTERS
            },
            {
                name: "4th rotor initial value",
                type: "option",
                value: LETTERS
            },
            {
                name: "5th (right-hand, static) rotor",
                type: "editableOption",
                value: ROTORS,
                defaultIndex: 4
            },
            {
                name: "5th rotor reversed",
                type: "boolean",
                value: false
            },
            {
                name: "5th rotor ring setting",
                type: "option",
                value: LETTERS
            },
            {
                name: "5th rotor initial value",
                type: "option",
                value: LETTERS
            },
            {
                name: "Reflector",
                type: "editableOption",
                value: REFLECTORS
            },
            {
                name: "Plugboard",
                type: "string",
                value: ""
            },
            {
                name: "Typex keyboard emulation",
                type: "option",
                value: ["None", "Encrypt", "Decrypt"]
            },
            {
                name: "Strict output",
                hint: "Remove non-alphabet letters and group output",
                type: "boolean",
                value: true
            },
        ];
    }

    /**
     * Helper - for ease of use rotors are specified as a single string; this
     * method breaks the spec string into wiring and steps parts.
     *
     * @param {string} rotor - Rotor specification string.
     * @param {number} i - For error messages, the number of this rotor.
     * @returns {string[]}
     */
    parseRotorStr(rotor, i) {
        if (rotor === "") {
            throw new OperationError(`Rotor ${i} must be provided.`);
        }
        if (!rotor.includes("<")) {
            return [rotor, ""];
        }
        return rotor.split("<", 2);
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        const reflectorstr = args[20];
        const plugboardstr = args[21];
        const typexKeyboard = args[22];
        const removeOther = args[23];
        const rotors = [];
        for (let i=0; i<5; i++) {
            const [rotorwiring, rotorsteps] = this.parseRotorStr(args[i*4]);
            rotors.push(new Rotor(rotorwiring, rotorsteps, args[i*4 + 1], args[i*4+2], args[i*4+3]));
        }
        // Rotors are handled in reverse
        rotors.reverse();
        const reflector = new Reflector(reflectorstr);
        let plugboardstrMod = plugboardstr;
        if (plugboardstrMod === "") {
            plugboardstrMod = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        }
        const plugboard = new Plugboard(plugboardstrMod);
        if (removeOther) {
            if (typexKeyboard === "Encrypt") {
                input = input.replace(/[^A-Za-z0-9 /%£()',.-]/g, "");
            } else {
                input = input.replace(/[^A-Za-z]/g, "");
            }
        }
        const typex = new TypexMachine(rotors, reflector, plugboard, typexKeyboard);
        let result = typex.crypt(input);
        if (removeOther && typexKeyboard !== "Decrypt") {
            // Five character cipher groups is traditional
            result = result.replace(/([A-Z]{5})(?!$)/g, "$1 ");
        }
        return result;
    }

    /**
     * Highlight Typex
     * This is only possible if we're passing through non-alphabet characters.
     *
     * @param {Object[]} pos
     * @param {number} pos[].start
     * @param {number} pos[].end
     * @param {Object[]} args
     * @returns {Object[]} pos
     */
    highlight(pos, args) {
        if (args[18] === false) {
            return pos;
        }
    }

    /**
     * Highlight Typex in reverse
     *
     * @param {Object[]} pos
     * @param {number} pos[].start
     * @param {number} pos[].end
     * @param {Object[]} args
     * @returns {Object[]} pos
     */
    highlightReverse(pos, args) {
        if (args[18] === false) {
            return pos;
        }
    }

}

export default Typex;
