/**
 * @author Matt C [matt@artemisbot.uk]
 * @copyright Crown Copyright 2019
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import OperationError from "../errors/OperationError.mjs";
import Yara from "libyara-wasm";
import { isWorkerEnvironment } from "../Utils.mjs";

/**
 * YARA Rules operation
 */
class YARARules extends Operation {

    /**
     * YARARules constructor
     */
    constructor() {
        super();

        this.name = "YARA Rules";
        this.module = "Yara";
        this.description =   "YARA 是 VirusTotal 开发的一款工具，主要用于帮助恶意软件研究人员识别和分类恶意软件样本。它根据用户指定的包含文本或二进制模式和布尔表达式的规则进行匹配。有关编写规则的帮助，请参阅<a href='https://yara.readthedocs.io/en/latest/writingrules.html'>YARA 文件。</a>";
        this.infoURL = "https://wikipedia.org/wiki/YARA";
        this.inputType = "ArrayBuffer";
        this.outputType = "string";
        this.args = [
            {
                name: "Rules",
                type: "text",
                value: "",
                rows: 5
            },
            {
                name: "Show strings",
                type: "boolean",
                value: false
            },
            {
                name: "Show string lengths",
                type: "boolean",
                value: false
            },
            {
                name: "Show metadata",
                type: "boolean",
                value: false
            },
            {
                name: "Show counts",
                type: "boolean",
                value: true
            },
            {
                name: "Show rule warnings",
                type: "boolean",
                value: true
            },
            {
                name: "Show console module messages",
                type: "boolean",
                value: true
            },
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    async run(input, args) {
        if (isWorkerEnvironment())
            self.sendStatusMessage("Instantiating YARA...");
        const [rules, showStrings, showLengths, showMeta, showCounts, showRuleWarns, showConsole] = args;
        return new Promise((resolve, reject) => {
            Yara().then(yara => {
                if (isWorkerEnvironment()) self.sendStatusMessage("Converting data for YARA.");
                let matchString = "";

                const inpArr = new Uint8Array(input); // Turns out embind knows that JS uint8array <==> C++ std::string

                if (isWorkerEnvironment()) self.sendStatusMessage("Running YARA matching.");

                const resp = yara.run(inpArr, rules);

                if (isWorkerEnvironment()) self.sendStatusMessage("Processing data.");

                if (resp.compileErrors.size() > 0) {
                    for (let i = 0; i < resp.compileErrors.size(); i++) {
                        const compileError = resp.compileErrors.get(i);
                        if (!compileError.warning) {
                            reject(new OperationError(`Error on line ${compileError.lineNumber}: ${compileError.message}`));
                        } else if (showRuleWarns) {
                            matchString += `Warning on line ${compileError.lineNumber}: ${compileError.message}\n`;
                        }
                    }
                }

                if (showConsole) {
                    const consoleLogs = resp.consoleLogs;
                    for (let i = 0; i < consoleLogs.size(); i++) {
                        matchString += consoleLogs.get(i) + "\n";
                    }
                }

                const matchedRules = resp.matchedRules;
                for (let i = 0; i < matchedRules.size(); i++) {
                    const rule = matchedRules.get(i);
                    const matches = rule.resolvedMatches;
                    let meta = "";
                    if (showMeta && rule.metadata.size() > 0) {
                        meta += " [";
                        for (let j = 0; j < rule.metadata.size(); j++) {
                            meta += `${rule.metadata.get(j).identifier}: ${rule.metadata.get(j).data}, `;
                        }
                        meta = meta.slice(0, -2) + "]";
                    }
                    const countString = matches.size() === 0 ? "" : (showCounts ? ` (${matches.size()} time${matches.size() > 1 ? "s" : ""})` : "");
                    if (matches.size() === 0 || !(showStrings || showLengths)) {
                        matchString += `Input matches rule "${rule.ruleName}"${meta}${countString.length > 0 ? ` ${countString}`: ""}.\n`;
                    } else {
                        matchString += `Rule "${rule.ruleName}"${meta} matches${countString}:\n`;
                        for (let j = 0; j < matches.size(); j++) {
                            const match = matches.get(j);
                            if (showStrings || showLengths) {
                                matchString += `Pos ${match.location}, ${showLengths ? `length ${match.matchLength}, ` : ""}identifier ${match.stringIdentifier}${showStrings ? `, data: "${match.data}"` : ""}\n`;
                            }
                        }
                    }
                }
                resolve(matchString);
            });
        });
    }

}

export default YARARules;
