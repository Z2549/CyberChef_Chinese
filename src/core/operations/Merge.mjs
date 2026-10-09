/**
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2018
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";

/**
 * Merge operation
 */
class Merge extends Operation {

    /**
     * Merge constructor
     */
    constructor() {
        super();

        this.name = "Merge";
        this.flowControl = true;
        this.module = "Default";
        this.description =   "将所有分支合并成一个主干。在福克的对面。取消“合并全部”复选框只会将所有分支合并到最近的Fork/分段。";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [
            {
                name: "Merge All",
                type: "boolean",
                value: true,
            }
        ];
    }

    /**
     * @param {Object} state - The current state of the recipe.
     * @param {number} state.progress - The current position in the recipe.
     * @param {Dish} state.dish - The Dish being operated on.
     * @param {Operation[]} state.opList - The list of operations in the recipe.
     * @returns {Object} The updated state of the recipe.
     */
    run(state) {
        // No need to actually do anything here. The fork operation will
        // merge when it sees this operation.
        return state;
    }

}

export default Merge;
