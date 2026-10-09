/**
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

import CategoryZh from "./CategoryZh.mjs";

/**
 * Object to handle the creation of operation categories.
 */
class HTMLCategory {

    /**
     * HTMLCategory constructor.
     *
     * @param {string} name - The name of the category.
     * @param {boolean} selected - Whether this category is pre-selected or not.
     */
    constructor(name, selected) {
        // catId 保留上游英文原名，用于生成 DOM id / data-target。
        // 它是稳定标识符，被 index.html、_list.css 与上游 UI 测试引用，不能随文案改动。
        // name 仅用于界面显示，做一层中文查表。
        this.catId = name;
        this.name = CategoryZh[name] || name;
        this.selected = selected;
        this.opList = [];
    }


    /**
     * Adds an operation to this category.
     *
     * @param {HTMLOperation} operation - The operation to add.
     */
    addOperation(operation) {
        this.opList.push(operation);
    }


    /**
     * Renders the category and all operations within it in HTML.
     *
     * @returns {string}
     */
    toHtml() {
        const catName = "cat" + this.catId.replace(/[\s/\-:_]/g, "");
        let html = `<div class="panel category">
        <a class="category-title" data-toggle="collapse" data-target="#${catName}">
            ${this.name}
            <span class="op-count hidden">
                ${this.opList.length}
            </span>
        </a>
        <div id="${catName}" class="panel-collapse collapse ${(this.selected ? " show" : "")}" data-parent="#categories">
            <ul class="op-list">`;

        for (let i = 0; i < this.opList.length; i++) {
            html += this.opList[i].toStubHtml();
        }

        html += "</ul></div></div>";
        return html;
    }

}

export default HTMLCategory;
