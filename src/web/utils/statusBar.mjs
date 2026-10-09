/**
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2022
 * @license Apache-2.0
 */

import {showPanel} from "@codemirror/view";
import {CHR_ENC_SIMPLE_LOOKUP, CHR_ENC_SIMPLE_REVERSE_LOOKUP} from "../../core/lib/ChrEnc.mjs";
import { eolCodeToName, eolSeqToCode } from "./editorUtils.mjs";

/**
 * 状态栏文案中「输入 / 输出」的中文显示名。
 *
 * 重要：this.label 本身必须保持英文（"Input" / "Output"），因为有两处**功能判断**依赖它：
 *   - updateTiming():  if (this.label === "Output" && this.timing)
 *   - constructRHS():  if (this.label === "Input")
 * 因此只在「拼渲染文案」时通过本映射取中文，逻辑判断继续用英文 label。
 */
const LABEL_ZH = {
    "Input": "输入",
    "Output": "输出"
};

/**
 * 行尾序列的中文名称（仅用于状态栏显示）。
 *
 * 不修改 editorUtils.mjs 的 eolCodeToName，原因：该表同时被 InputWaiter / OutputWaiter 的
 * snackbar 提示复用，而提示条按本项目约定一律保持英文（UI 测试会断言提示条文案）。
 * 行尾代码本身（LF / CR / CRLF …）是写进 URL 参数与 el-value 的标识符，必须保持英文，
 * UI 测试也直接断言 .eol-value 的文本等于 "LF" / "CRLF" 等。
 */
const EOL_NAME_ZH = {
    "LF": "换行符",
    "VT": "垂直制表符",
    "FF": "换页符",
    "CR": "回车符",
    "CRLF": "回车符 + 换行符",
    "NEL": "下一行",
    "LS": "行分隔符",
    "PS": "段分隔符"
};

/**
 * 未做编码转换时的显示名。
 * 注意：这个字符串是纯界面文案（不是 IANA 字符集名），故汉化；
 * 下拉列表中形如 "UTF-8" / "Simplified Chinese GBK" 的条目是真实字符集名，一律保持英文，
 * 也是 UI 测试 tests/browser/browserUtils.js setChrEnc() 用 link text 定位的目标。
 */
const RAW_BYTES_ZH = "原始字节";

const DETECTED_SUFFIX = "（自动检测）";

/**
 * A Status bar extension for CodeMirror
 */
class StatusBarPanel {

    /**
     * StatusBarPanel constructor
     * @param {Object} opts
     */
    constructor(opts) {
        this.label = opts.label;
        // 仅供界面显示，不参与任何逻辑判断
        this.labelZh = LABEL_ZH[opts.label] || opts.label;
        this.timing = opts.timing;
        this.tabNumGetter = opts.tabNumGetter;
        this.eolHandler = opts.eolHandler;
        this.chrEncHandler = opts.chrEncHandler;
        this.chrEncGetter = opts.chrEncGetter;
        this.getEncodingState = opts.getEncodingState;
        this.getEOLState = opts.getEOLState;
        this.htmlOutput = opts.htmlOutput;

        this.eolVal = null;
        this.chrEncVal = null;

        this.dom = this.buildDOM();
    }

    /**
     * Builds the status bar DOM tree
     * @returns {DOMNode}
     */
    buildDOM() {
        const dom = document.createElement("div");
        const lhs = document.createElement("div");
        const rhs = document.createElement("div");

        dom.className = "cm-status-bar";
        dom.setAttribute("data-help-title", `${this.labelZh}状态栏`);
        dom.setAttribute("data-help", `此状态栏提供${this.labelZh}中数据的信息。将鼠标悬停在各组件上并激活帮助，即可查看对应组件的帮助主题。`);
        lhs.innerHTML = this.constructLHS();
        rhs.innerHTML = this.constructRHS();

        dom.appendChild(lhs);
        dom.appendChild(rhs);

        // Event listeners
        dom.querySelectorAll(".cm-status-bar-select-btn").forEach(
            el => el.addEventListener("click", this.showDropUp.bind(this), false)
        );
        dom.querySelector(".eol-select").addEventListener("click", this.eolSelectClick.bind(this), false);
        dom.querySelector(".chr-enc-select").addEventListener("click", this.chrEncSelectClick.bind(this), false);
        dom.querySelector(".cm-status-bar-filter-input").addEventListener("keyup", this.chrEncFilter.bind(this), false);

        return dom;
    }

    /**
     * Handler for dropup clicks
     * Shows/Hides the dropup
     * @param {Event} e
     */
    showDropUp(e) {
        const el = e.target
            .closest(".cm-status-bar-select")
            .querySelector(".cm-status-bar-select-content");
        const btn = e.target.closest(".cm-status-bar-select-btn");

        if (btn.classList.contains("disabled")) return;

        el.classList.add("show");

        // Focus the filter input if present
        const filter = el.querySelector(".cm-status-bar-filter-input");
        if (filter) filter.focus();

        // Set up a listener to close the menu if the user clicks outside of it
        hideOnClickOutside(el, e);
    }

    /**
     * Handler for EOL Select clicks
     * Sets the line separator
     * @param {Event} e
     */
    eolSelectClick(e) {
        // preventDefault is required to stop the URL being modified and popState being triggered
        e.preventDefault();

        const eolCode = e.target.getAttribute("data-val");
        if (!eolCode) return;

        // Call relevant EOL change handler
        this.eolHandler(e.target.getAttribute("data-val"), true);

        hideElement(e.target.closest(".cm-status-bar-select-content"));
    }

    /**
     * Handler for Chr Enc Select clicks
     * Sets the character encoding
     * @param {Event} e
     */
    chrEncSelectClick(e) {
        // preventDefault is required to stop the URL being modified and popState being triggered
        e.preventDefault();

        const chrEncVal = parseInt(e.target.getAttribute("data-val"), 10);

        if (isNaN(chrEncVal)) return;

        this.chrEncHandler(chrEncVal, true);
        this.updateCharEnc(chrEncVal);
        hideElement(e.target.closest(".cm-status-bar-select-content"));
    }

    /**
     * Handler for Chr Enc keyup events
     * Filters the list of selectable character encodings
     * @param {Event} e
     */
    chrEncFilter(e) {
        const input = e.target;
        const filter = input.value.toLowerCase();
        const div = input.closest(".cm-status-bar-select-content");
        const a = div.getElementsByTagName("a");
        for (let i = 0; i < a.length; i++) {
            const txtValue = a[i].textContent || a[i].innerText;
            if (txtValue.toLowerCase().includes(filter)) {
                a[i].style.display = "block";
            } else {
                a[i].style.display = "none";
            }
        }
    }

    /**
     * Counts the stats of a document
     * @param {EditorState} state
     */
    updateStats(state) {
        const length = this.dom.querySelector(".stats-length-value"),
            lines = this.dom.querySelector(".stats-lines-value");

        let docLength = state.doc.length;
        // CodeMirror always counts line breaks as one character.
        // We want to show an accurate reading of how many bytes there are.
        if (state.lineBreak.length !== 1) {
            docLength += (state.lineBreak.length * state.doc.lines) - state.doc.lines - 1;
        }
        length.textContent = docLength;
        lines.textContent = state.doc.lines;
    }

    /**
     * Gets the current selection info
     * @param {EditorState} state
     * @param {boolean} selectionSet
     */
    updateSelection(state, selectionSet) {
        const selLen = state?.selection?.main ?
            state.selection.main.to - state.selection.main.from :
            0;

        const selInfo = this.dom.querySelector(".sel-info"),
            curOffsetInfo = this.dom.querySelector(".cur-offset-info");

        if (!selectionSet) {
            selInfo.style.display = "none";
            curOffsetInfo.style.display = "none";
            return;
        }

        // CodeMirror always counts line breaks as one character.
        // We want to show an accurate reading of how many bytes there are.
        let from = state.selection.main.from,
            to = state.selection.main.to;
        if (state.lineBreak.length !== 1) {
            const fromLine = state.doc.lineAt(from).number;
            const toLine = state.doc.lineAt(to).number;
            from += (state.lineBreak.length * fromLine) - fromLine - 1;
            to += (state.lineBreak.length * toLine) - toLine - 1;
        }

        if (selLen > 0) { // Range
            const start = this.dom.querySelector(".sel-start-value"),
                end = this.dom.querySelector(".sel-end-value"),
                length = this.dom.querySelector(".sel-length-value");

            selInfo.style.display = "inline-block";
            curOffsetInfo.style.display = "none";
            start.textContent = from;
            end.textContent = to;
            length.textContent = to - from;
        } else { // Position
            const offset = this.dom.querySelector(".cur-offset-value");

            selInfo.style.display = "none";
            curOffsetInfo.style.display = "inline-block";
            offset.textContent = from;
        }
    }

    /**
     * Sets the current EOL separator in the status bar
     * @param {EditorState} state
     */
    updateEOL(state) {
        if (this.getEOLState() < 2 && state.lineBreak === this.eolVal) return;

        const val = this.dom.querySelector(".eol-value");
        const button = val.closest(".cm-status-bar-select-btn");
        let eolCode = eolSeqToCode[state.lineBreak];
        // 显示用中文名优先，取不到时退回上游英文名
        let eolName = EOL_NAME_ZH[eolCode] || eolCodeToName[eolCode];

        switch (this.getEOLState()) {
            case 1: // Detected
                val.classList.add("font-italic");
                eolCode += DETECTED_SUFFIX;
                eolName += DETECTED_SUFFIX;
                // Pulse
                val.classList.add("pulse");
                setTimeout(() => {
                    val.classList.remove("pulse");
                }, 2000);
                break;
            case 0: // Unset
            case 2: // Manually set
            default:
                val.classList.remove("font-italic");
                break;
        }

        val.textContent = eolCode;
        button.setAttribute("title", `行尾序列：<br>${eolName}`);
        button.setAttribute("data-original-title", `行尾序列：<br>${eolName}`);
        this.eolVal = state.lineBreak;
    }


    /**
     * Sets the current character encoding of the document
     */
    updateCharEnc() {
        const chrEncVal = this.chrEncGetter();
        if (this.getEncodingState() < 2 && chrEncVal === this.chrEncVal) return;

        let name = CHR_ENC_SIMPLE_REVERSE_LOOKUP[chrEncVal] ? CHR_ENC_SIMPLE_REVERSE_LOOKUP[chrEncVal] : RAW_BYTES_ZH;

        const val = this.dom.querySelector(".chr-enc-value");
        const button = val.closest(".cm-status-bar-select-btn");

        switch (this.getEncodingState()) {
            case 1: // Detected
                val.classList.add("font-italic");
                name += DETECTED_SUFFIX;
                // Pulse
                val.classList.add("pulse");
                setTimeout(() => {
                    val.classList.remove("pulse");
                }, 2000);
                break;
            case 0: // Unset
            case 2: // Manually set
            default:
                val.classList.remove("font-italic");
                break;
        }

        val.textContent = name;
        button.setAttribute("title", `${this.labelZh}字符编码：<br>${name}`);
        button.setAttribute("data-original-title", `${this.labelZh}字符编码：<br>${name}`);
        this.chrEncVal = chrEncVal;
    }

    /**
     * Sets the latest timing info
     */
    updateTiming() {
        if (!this.timing) return;

        const bakingTime = this.dom.querySelector(".baking-time-value");
        const bakingTimeInfo = this.dom.querySelector(".baking-time-info");

        if (this.label === "Output" && this.timing) {
            bakingTimeInfo.style.display = "inline-block";
            bakingTime.textContent = this.timing.duration(this.tabNumGetter());

            const info = this.timing.printStages(this.tabNumGetter()).replace(/\n/g, "<br>");
            bakingTimeInfo.setAttribute("data-original-title", info);
        } else {
            bakingTimeInfo.style.display = "none";
        }
    }

    /**
     * Updates the sizing of elements that need to fit correctly
     * @param {EditorView} view
     */
    updateSizing(view) {
        const viewHeight = view.contentDOM.parentNode.clientHeight;
        this.dom.querySelectorAll(".cm-status-bar-select-scroll").forEach(
            el => {
                el.style.maxHeight = (viewHeight - 50) + "px";
            }
        );
    }

    /**
     * Checks whether there is HTML output requiring some widgets to be disabled
     */
    monitorHTMLOutput() {
        if (!this.htmlOutput?.changed) return;

        if (this.htmlOutput?.html === "") {
            // Enable all controls
            this.dom.querySelectorAll(".disabled").forEach(el => {
                el.classList.remove("disabled");
            });
        } else {
            // Disable chrenc, length, selection etc.
            this.dom.querySelectorAll(".cm-status-bar-select-btn").forEach(el => {
                el.classList.add("disabled");
            });

            this.dom.querySelector(".stats-length-value").parentNode.classList.add("disabled");
            this.dom.querySelector(".stats-lines-value").parentNode.classList.add("disabled");
            this.dom.querySelector(".sel-info").classList.add("disabled");
            this.dom.querySelector(".cur-offset-info").classList.add("disabled");
        }
    }

    /**
     * Builds the Left-hand-side widgets
     * @returns {string}
     */
    constructLHS() {
        return `
            <span data-toggle="tooltip" title="${this.labelZh}长度" data-help-title="${this.labelZh}长度" data-help="此数字表示${this.labelZh}中的字符数。<br><br>CRLF 行尾分隔符会被计为两个字符，这会影响该数值。">
                <i class="material-icons">abc</i>
                <span class="stats-length-value"></span>
            </span>
            <span data-toggle="tooltip" title="行数"  data-help-title="行数" data-help="此数字表示${this.labelZh}中的行数。行由行尾序列分隔，可用此状态栏最右侧的行尾序列选择器更改。">
                <i class="material-icons">sort</i>
                <span class="stats-lines-value"></span>
            </span>

            <span class="sel-info" data-toggle="tooltip" title="主选区" data-help-title="主选区" data-help="这些数字表示已选中的偏移范围以及当前选区包含的字符数。如果有多个选区，则指最近操作的那个。">
                <i class="material-icons">highlight_alt</i>
                <span class="sel-start-value"></span>\u279E<span class="sel-end-value"></span>
                （已选中 <span class="sel-length-value"></span> 个字符）
            </span>
            <span class="cur-offset-info" data-toggle="tooltip" title="光标偏移" data-help-title="光标偏移" data-help="此数字表示光标相对于${this.labelZh}起始位置的当前偏移量。<br><br>CRLF 行尾分隔符会被计为两个字符，这会影响该数值。">
                <i class="material-icons">location_on</i>
                <span class="cur-offset-value"></span>
            </span>`;
    }

    /**
     * Builds the Right-hand-side widgets
     * Event listener set up in Manager
     *
     * @returns {string}
     */
    constructRHS() {
        const chrEncOptions = Object.keys(CHR_ENC_SIMPLE_LOOKUP).map(name =>
            `<a href="#" draggable="false" data-val="${CHR_ENC_SIMPLE_LOOKUP[name]}">${name}</a>`
        ).join("");

        let chrEncHelpText = "",
            eolHelpText = "";
        if (this.label === "Input") {
            chrEncHelpText = "输入字符编码定义了输入文本如何被编码为字节，随后由配方处理。<br><br>「原始字节」选项会尝试把输入视为 0-255 范围内的单个字节；如果检测到任何 Unicode 值大于 255 的字符，就会把整个输入当作 UTF-8 处理。如果输入的是二进制数据（例如文件），「原始字节」通常是最佳选项。";
            eolHelpText = "行尾序列定义了哪些字节被视为行尾终止符。按下回车键会将该序列写入输入并创建新行。<br><br>更改行尾序列不会修改输入中已有的数据，但可能改变此前输入的换行显示的形态。在设置了不同行尾终止符期间添加的行，可能不再产生换行，而是显示为控制字符。";
        } else {
            chrEncHelpText = "输出字符编码定义了输出字节如何被解码为可供您查看的文本。<br><br>「原始字节」选项把输出数据视为 0-255 范围内的单个字节。";
            eolHelpText = "行尾序列定义了哪些字节被视为行尾终止符。<br><br>更改该值不会修改输出的内容，但可能改变某些字节的显示形态，以及它们是否会产生换行。";
        }

        return `
            <span class="baking-time-info" style="display: none" data-toggle="tooltip" data-html="true" title="烘焙耗时" data-help-title="烘焙耗时" data-help="烘焙耗时是指数据从输入被读取、经过处理、再到显示在输出中的总耗时。<br><br>「线程开销」数值反映的是数据在不同处理线程之间传输以及部分垃圾回收所消耗的时间。由于它很大程度上受操作系统与浏览器后台活动影响，波动可能很大，因此不计入状态栏显示的总体烘焙耗时。">
                <i class="material-icons">schedule</i>
                <span class="baking-time-value"></span>ms
            </span>

            <div class="cm-status-bar-select chr-enc-select" data-help-title="${this.labelZh}字符编码" data-help="${chrEncHelpText}">
                <span class="cm-status-bar-select-btn" data-toggle="tooltip" data-html="true" data-placement="left" title="${this.labelZh}字符编码">
                    <i class="material-icons">text_fields</i> <span class="chr-enc-value">原始字节</span>
                </span>
                <div class="cm-status-bar-select-content">
                    <div class="cm-status-bar-select-scroll no-select">
                        <a href="#" draggable="false" data-val="0">原始字节</a>
                        ${chrEncOptions}
                    </div>
                    <div class="input-group cm-status-bar-filter-search">
                        <div class="input-group-prepend">
                            <span class="input-group-text">
                                <i class="material-icons">search</i>
                            </span>
                        </div>
                        <input type="text" class="form-control cm-status-bar-filter-input" placeholder="筛选…">
                    </div>
                </div>
            </div>

            <div class="cm-status-bar-select eol-select" data-help-title="${this.labelZh}行尾序列" data-help="${eolHelpText}">
                <span class="cm-status-bar-select-btn" data-toggle="tooltip" data-html="true" data-placement="left" title="行尾序列">
                    <i class="material-icons">keyboard_return</i> <span class="eol-value"></span>
                </span>
                <div class="cm-status-bar-select-content no-select">
                    <a href="#" draggable="false" data-val="LF">换行符, U+000A</a>
                    <a href="#" draggable="false" data-val="VT">垂直制表符, U+000B</a>
                    <a href="#" draggable="false" data-val="FF">换页符, U+000C</a>
                    <a href="#" draggable="false" data-val="CR">回车符, U+000D</a>
                    <a href="#" draggable="false" data-val="CRLF">回车符 + 换行符, U+000D U+000A</a>
                    <!-- <a href="#" draggable="false" data-val="NL">Next Line, U+0085</a> This causes problems. -->
                    <a href="#" draggable="false" data-val="LS">行分隔符, U+2028</a>
                    <a href="#" draggable="false" data-val="PS">段分隔符, U+2029</a>
                </div>
            </div>`;
    }

}

const elementsWithListeners = {};

/**
 * Hides the provided element when a click is made outside of it
 * @param {Element} element
 * @param {Event} instantiatingEvent
 */
function hideOnClickOutside(element, instantiatingEvent) {
    /**
     * Handler for document click events
     * Closes element if click is outside it.
     * @param {Event} event
     */
    const outsideClickListener = event => {
        // Don't trigger if we're clicking inside the element, or if the element
        // is not visible, or if this is the same click event that opened it.
        if (!element.contains(event.target) &&
            event.timeStamp !== instantiatingEvent.timeStamp) {
            hideElement(element);
        }
    };

    if (!Object.prototype.hasOwnProperty.call(elementsWithListeners, element)) {
        elementsWithListeners[element] = outsideClickListener;
        document.addEventListener("click", elementsWithListeners[element], false);
    }
}

/**
 * Hides the specified element and removes the click listener for it
 * @param {Element} element
 */
function hideElement(element) {
    element.classList.remove("show");
    document.removeEventListener("click", elementsWithListeners[element], false);
    delete elementsWithListeners[element];
}


/**
 * A panel constructor factory building a panel that re-counts the stats every time the document changes.
 * @param {Object} opts
 * @returns {Function<PanelConstructor>}
 */
function makePanel(opts) {
    const sbPanel = new StatusBarPanel(opts);

    return (view) => {
        sbPanel.updateEOL(view.state);
        sbPanel.updateCharEnc();
        sbPanel.updateTiming();
        sbPanel.updateStats(view.state);
        sbPanel.updateSelection(view.state, false);
        sbPanel.monitorHTMLOutput();

        return {
            "dom": sbPanel.dom,
            update(update) {
                sbPanel.updateEOL(update.state);
                sbPanel.updateCharEnc();
                sbPanel.updateSelection(update.state, update.selectionSet);
                sbPanel.updateTiming();
                sbPanel.monitorHTMLOutput();
                if (update.geometryChanged) {
                    sbPanel.updateSizing(update.view);
                }
                if (update.docChanged) {
                    sbPanel.updateStats(update.state);
                }
            }
        };
    };
}

/**
 * A function that build the extension that enables the panel in an editor.
 * @param {Object} opts
 * @returns {Extension}
 */
export function statusBar(opts) {
    const panelMaker = makePanel(opts);
    return showPanel.of(panelMaker);
}
