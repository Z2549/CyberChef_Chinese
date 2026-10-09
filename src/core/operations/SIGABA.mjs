/**
 * Emulation of the SIGABA machine.
 *
 * @author hettysymes
 * @copyright hettysymes 2020
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import {LETTERS} from "../lib/Enigma.mjs";
import {NUMBERS, CR_ROTORS, I_ROTORS, SigabaMachine, CRRotor, IRotor} from "../lib/SIGABA.mjs";

/**
 * Sigaba operation
 */
class Sigaba extends Operation {

    /**
     * Sigaba constructor
     */
    constructor() {
        super();

        this.name = "SIGABA";
        this.module = "Bletchley";
        this.description =   "E使用二战时期的 SIGABA 机器进行破译/解密。 <br><br>SIGABA 又称 ECM Mark II，在第二次世界大战期间直至 20 世纪 50 年代一直被美国用于信息加密。它于 20 世纪 30 年代由美国陆军和海军研制成功，至今从未被破解过。由 15 个转子组成：SIGABA 的转子步进比当时的其他转子机（如 Enigma）要复杂得多。所有转子线路示例均为随机示例集。<br><br>要配置转子线路，请为密码转子和控制转子输入一串从 A 到 Z 的字母，为索引转子输入一串从 0 到 9 的数字。请注意，加密与解密不同，因此首先要选择所需的模式。<br><br>注：虽然已针对其他软件模拟器进行了测试，但尚未针对硬件进行测试。";
        this.infoURL = "https://wikipedia.org/wiki/SIGABA";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [
            {
                name: "1st (left-hand) cipher rotor",
                type: "editableOption",
                value: CR_ROTORS,
                defaultIndex: 0
            },
            {
                name: "1st cipher rotor reversed",
                type: "boolean",
                value: false
            },
            {
                name: "1st cipher rotor initial value",
                type: "option",
                value: LETTERS
            },
            {
                name: "2nd cipher rotor",
                type: "editableOption",
                value: CR_ROTORS,
                defaultIndex: 0
            },
            {
                name: "2nd cipher rotor reversed",
                type: "boolean",
                value: false
            },
            {
                name: "2nd cipher rotor initial value",
                type: "option",
                value: LETTERS
            },
            {
                name: "3rd (middle) cipher rotor",
                type: "editableOption",
                value: CR_ROTORS,
                defaultIndex: 0
            },
            {
                name: "3rd cipher rotor reversed",
                type: "boolean",
                value: false
            },
            {
                name: "3rd cipher rotor initial value",
                type: "option",
                value: LETTERS
            },
            {
                name: "4th cipher rotor",
                type: "editableOption",
                value: CR_ROTORS,
                defaultIndex: 0
            },
            {
                name: "4th cipher rotor reversed",
                type: "boolean",
                value: false
            },
            {
                name: "4th cipher rotor initial value",
                type: "option",
                value: LETTERS
            },
            {
                name: "5th (right-hand) cipher rotor",
                type: "editableOption",
                value: CR_ROTORS,
                defaultIndex: 0
            },
            {
                name: "5th cipher rotor reversed",
                type: "boolean",
                value: false
            },
            {
                name: "5th cipher rotor initial value",
                type: "option",
                value: LETTERS
            },
            {
                name: "1st (left-hand) control rotor",
                type: "editableOption",
                value: CR_ROTORS,
                defaultIndex: 0
            },
            {
                name: "1st control rotor reversed",
                type: "boolean",
                value: false
            },
            {
                name: "1st control rotor initial value",
                type: "option",
                value: LETTERS
            },
            {
                name: "2nd control rotor",
                type: "editableOption",
                value: CR_ROTORS,
                defaultIndex: 0
            },
            {
                name: "2nd control rotor reversed",
                type: "boolean",
                value: false
            },
            {
                name: "2nd control rotor initial value",
                type: "option",
                value: LETTERS
            },
            {
                name: "3rd (middle) control rotor",
                type: "editableOption",
                value: CR_ROTORS,
                defaultIndex: 0
            },
            {
                name: "3rd control rotor reversed",
                type: "boolean",
                value: false
            },
            {
                name: "3rd control rotor initial value",
                type: "option",
                value: LETTERS
            },
            {
                name: "4th control rotor",
                type: "editableOption",
                value: CR_ROTORS,
                defaultIndex: 0
            },
            {
                name: "4th control rotor reversed",
                type: "boolean",
                value: false
            },
            {
                name: "4th control rotor initial value",
                type: "option",
                value: LETTERS
            },
            {
                name: "5th (right-hand) control rotor",
                type: "editableOption",
                value: CR_ROTORS,
                defaultIndex: 0
            },
            {
                name: "5th control rotor reversed",
                type: "boolean",
                value: false
            },
            {
                name: "5th control rotor initial value",
                type: "option",
                value: LETTERS
            },
            {
                name: "1st (left-hand) index rotor",
                type: "editableOption",
                value: I_ROTORS,
                defaultIndex: 0
            },
            {
                name: "1st index rotor initial value",
                type: "option",
                value: NUMBERS
            },
            {
                name: "2nd index rotor",
                type: "editableOption",
                value: I_ROTORS,
                defaultIndex: 0
            },
            {
                name: "2nd index rotor initial value",
                type: "option",
                value: NUMBERS
            },
            {
                name: "3rd (middle) index rotor",
                type: "editableOption",
                value: I_ROTORS,
                defaultIndex: 0
            },
            {
                name: "3rd index rotor initial value",
                type: "option",
                value: NUMBERS
            },
            {
                name: "4th index rotor",
                type: "editableOption",
                value: I_ROTORS,
                defaultIndex: 0
            },
            {
                name: "4th index rotor initial value",
                type: "option",
                value: NUMBERS
            },
            {
                name: "5th (right-hand) index rotor",
                type: "editableOption",
                value: I_ROTORS,
                defaultIndex: 0
            },
            {
                name: "5th index rotor initial value",
                type: "option",
                value: NUMBERS
            },
            {
                name: "SIGABA mode",
                type: "option",
                value: ["Encrypt", "Decrypt"]
            }
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        const sigabaSwitch = args[40];
        const cipherRotors = [];
        const controlRotors = [];
        const indexRotors = [];
        for (let i=0; i<5; i++) {
            const rotorWiring = args[i*3];
            cipherRotors.push(new CRRotor(rotorWiring, args[i*3+2], args[i*3+1]));
        }
        for (let i=5; i<10; i++) {
            const rotorWiring = args[i*3];
            controlRotors.push(new CRRotor(rotorWiring, args[i*3+2], args[i*3+1]));
        }
        for (let i=15; i<20; i++) {
            const rotorWiring = args[i*2];
            indexRotors.push(new IRotor(rotorWiring, args[i*2+1]));
        }
        const sigaba = new SigabaMachine(cipherRotors, controlRotors, indexRotors);
        let result;
        if (sigabaSwitch === "Encrypt") {
            result = sigaba.encrypt(input);
        } else if (sigabaSwitch === "Decrypt") {
            result = sigaba.decrypt(input);
        }
        return result;
    }

}
export default Sigaba;
