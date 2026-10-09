/**
 * Emulation of the Bombe machine.
 *
 * Tested against the Bombe Rebuild at Bletchley Park's TNMOC
 * using a variety of inputs and settings to confirm correctness.
 *
 * @author s2224834
 * @copyright Crown Copyright 2019
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import OperationError from "../errors/OperationError.mjs";
import { isWorkerEnvironment } from "../Utils.mjs";
import { BombeMachine } from "../lib/Bombe.mjs";
import { ROTORS, ROTORS_FOURTH, REFLECTORS, Reflector } from "../lib/Enigma.mjs";

/**
 * Bombe operation
 */
class Bombe extends Operation {
    /**
     * Bombe constructor
     */
    constructor() {
        super();

        this.name = "Bombe";
        this.module = "Bletchley";
        this.description =   "模拟布莱切利公园用来攻击谜机的炸弹机，基于波兰和英国密码分析家的工作。<br><br>要运行这个，你需要一个 'crib', 这是一些已知的明文块的目标密文，并知道转子使用。(见 'Bombe (multiple runs)' 如果你不知道转子是什么操作。) 机器会给出谜机的可能配置。每个建议都有转子启动位置(从左到右)和已知的插板对。<br><br>选择婴儿床: 首先，需要注意的是，Enigma无法对写给自己的信进行加密，这就允许你排除一些可能存在漏洞的位置。其次，炸弹机不模拟英格玛的中间转子步进。你的婴儿床越长，越有可能发生的步骤，这将阻止攻击工作。然而，除此之外，更长的婴儿床通常更好。攻击产生了一个 'menu' 哪些将密文字母映射为明文，目标是生成 'loops': 例如，对于密文A B C和密码C A B，我们有映射 A&lt;-&gt;C, B&lt;-&gt;A, 和 C&lt;-&gt;B, 产生 A-B-C-A 循环。循环越多，婴儿床越好。操作会输出这样的结果：如果您的菜单循环太少或太短，通常会产生大量错误的输出。请尝试不同的 Crib。如果菜单看起来不错，但没有产生正确的答案，则可能是您的 Crib 出错了，或者是您的中间转子步进重叠了--请尝试不同的 Crib。<br><br>输出不足以完全解密数据。您必须通过检查恢复其余的配线板设置。并且没有考虑到环的位置:这影响了中间转子的步进。如果你的输出是正确的一点，然后出了问题，调整环和开始的位置在右手转子一起，直到输出改善。如有必要，对中间转子重复上述步骤。<br><br>默认情况下，此操作运行检查机，这是一个手动过程，用于验证Bombe停止的质量，在每次停止时，丢弃失败的停止。如果您想查看硬件为给定输入实际停止了多少次，请禁用检查机。<br><br>对谜机、泰克斯和炸弹机操作的更详细的描述 <a href='https://github.com/gchq/CyberChef/wiki/Enigma,-the-Bombe,-and-Typex'>可以在这里找到</a>.";
        this.infoURL = "https://wikipedia.org/wiki/Bombe";
        this.inputType = "string";
        this.outputType = "JSON";
        this.presentType = "html";
        this.args = [
            {
                name: "Model",
                type: "argSelector",
                value: [
                    {
                        name: "3-rotor",
                        off: [1]
                    },
                    {
                        name: "4-rotor",
                        on: [1]
                    }
                ]
            },
            {
                name: "Left-most (4th) rotor",
                type: "editableOption",
                value: ROTORS_FOURTH,
                defaultIndex: 0
            },
            {
                name: "Left-hand rotor",
                type: "editableOption",
                value: ROTORS,
                defaultIndex: 0
            },
            {
                name: "Middle rotor",
                type: "editableOption",
                value: ROTORS,
                defaultIndex: 1
            },
            {
                name: "Right-hand rotor",
                type: "editableOption",
                value: ROTORS,
                defaultIndex: 2
            },
            {
                name: "Reflector",
                type: "editableOption",
                value: REFLECTORS
            },
            {
                name: "Crib",
                type: "string",
                value: ""
            },
            {
                name: "Crib offset",
                type: "number",
                value: 0
            },
            {
                name: "Use checking machine",
                type: "boolean",
                value: true
            }
        ];
    }

    /**
     * Format and send a status update message.
     * @param {number} nLoops - Number of loops in the menu
     * @param {number} nStops - How many stops so far
     * @param {number} progress - Progress (as a float in the range 0..1)
     */
    updateStatus(nLoops, nStops, progress) {
        const msg = `Bombe run with ${nLoops} loop${nLoops === 1 ? "" : "s"} in menu (2+ desirable): ${nStops} stops, ${Math.floor(100 * progress)}% done`;
        self.sendStatusMessage(msg);
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        const model = args[0];
        const reflectorstr = args[5];
        let crib = args[6];
        const offset = args[7];
        const check = args[8];
        const rotors = [];
        for (let i=0; i<4; i++) {
            if (i === 0 && model === "3-rotor") {
                // No fourth rotor
                continue;
            }
            let rstr = args[i + 1];
            // The Bombe doesn't take stepping into account so we'll just ignore it here
            if (rstr.includes("<")) {
                rstr = rstr.split("<", 2)[0];
            }
            rotors.push(rstr);
        }
        // Rotors are handled in reverse
        rotors.reverse();
        if (crib.length === 0) {
            throw new OperationError("Crib cannot be empty");
        }
        if (offset < 0) {
            throw new OperationError("Offset cannot be negative");
        }
        // For symmetry with the Enigma op, for the input we'll just remove all invalid characters
        input = input.replace(/[^A-Za-z]/g, "").toUpperCase();
        crib = crib.replace(/[^A-Za-z]/g, "").toUpperCase();
        const ciphertext = input.slice(offset);
        const reflector = new Reflector(reflectorstr);
        let update;
        if (isWorkerEnvironment()) {
            update = this.updateStatus;
        } else {
            update = undefined;
        }
        const bombe = new BombeMachine(rotors, reflector, ciphertext, crib, check, update);
        const result = bombe.run();
        return {
            nLoops: bombe.nLoops,
            result: result
        };
    }


    /**
     * Displays the Bombe results in an HTML table
     *
     * @param {Object} output
     * @param {number} output.nLoops
     * @param {Array[]} output.result
     * @returns {html}
     */
    present(output) {
        let html = `Bombe run on menu with ${output.nLoops} loop${output.nLoops === 1 ? "" : "s"} (2+ desirable). Note: Rotor positions are listed left to right and start at the beginning of the crib, and ignore stepping and the ring setting. Some plugboard settings are determined. A decryption preview starting at the beginning of the crib and ignoring stepping is also provided.\n\n`;
        html += "<table class='table table-hover table-sm table-bordered table-nonfluid'><tr><th>Rotor stops</th>  <th>Partial plugboard</th>  <th>Decryption preview</th></tr>\n";
        for (const [setting, stecker, decrypt] of output.result) {
            html += `<tr><td>${setting}</td>  <td>${stecker}</td>  <td>${decrypt}</td></tr>\n`;
        }
        html += "</table>";
        return html;
    }
}

export default Bombe;
