/**
 * @author j433866 [j433866@gmail.com]
 * @author 0xff1ce [github.com/0xff1ce]
 * @copyright Crown Copyright 2024
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import {FORMATS, convertCoordinates} from "../lib/ConvertCoordinates.mjs";
import OperationError from "../errors/OperationError.mjs";

/**
 * Show on map operation
 */
class ShowOnMap extends Operation {

    /**
     * ShowOnMap constructor
     */
    constructor() {
        super();

        this.name = "Show on map";
        this.module = "Hashing";
        this.description =   "在滑动地图上显示坐标。<br><br>坐标在地图上显示之前会被转换成十进制。<br><br>支持的格式:<ul><li>度 分 秒 (DMS)</li><li>十进制分 (DDM)</li><li>十进制度 (DD)</li><li>地理哈希</li><li>军用网格参考系统 (MGRS)</li><li>国家地形测量网 (OSNG)</li><li>通用横向墨卡托 (UTM)</li></ul><br>此操作不能脱机运行.";
        this.infoURL = "https://osmfoundation.org/wiki/Terms_of_Use";
        this.inputType = "string";
        this.outputType = "string";
        this.presentType = "html";
        this.args = [
            {
                name: "Zoom Level",
                type: "number",
                value: 13
            },
            {
                name: "Input Format",
                type: "option",
                value: ["Auto"].concat(FORMATS),
                allowEmpty: false
            },
            {
                name: "Input Delimiter",
                type: "option",
                value: [
                    "Auto",
                    "Direction Preceding",
                    "Direction Following",
                    "\\n",
                    "Comma",
                    "Semi-colon",
                    "Colon"
                ],
                allowEmpty: false
            }
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        if (input.replace(/\s+/g, "") !== "") {
            const inFormat = args[1],
                inDelim = args[2];
            let latLong;
            try {
                latLong = convertCoordinates(input, inFormat, inDelim, "Decimal Degrees", "Comma", "None", 5);
            } catch (error) {
                throw new OperationError(error);
            }
            latLong = latLong.replace(/[,]$/, "");
            latLong = latLong.replace(/°/g, "");

            // The map requires a latitude and longitude pair. If the conversion only produced a
            // single value (e.g. because the chosen input delimiter didn't match the input), bail
            // out with a helpful message rather than passing it on to the map, which would throw an
            // uncaught TypeError in the browser.
            const coords = latLong.split(",").map(v => v.trim());
            if (coords.length !== 2 || coords.some(v => v === "" || isNaN(Number(v)))) {
                throw new OperationError(`Could not show coordinates '${latLong}' on the map. Expected a latitude and longitude pair - check that the input format and delimiter are correct.`);
            }

            return latLong;
        }
        return input;
    }

    /**
     * @param {string} data
     * @param {Object[]} args
     * @returns {string}
     */
    async present(data, args) {
        if (data.replace(/\s+/g, "") === "") {
            data = "0, 0";
        }
        const zoomLevel = args[0];
        const tileUrl = "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
            tileAttribution = "&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors",
            leafletUrl = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js",
            leafletCssUrl = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        return `<link rel="stylesheet" href="${leafletCssUrl}" crossorigin=""/>
<style>
    #output-text .cm-content,
    #output-text .cm-line,
    #output-html {
        padding: 0;
        white-space: normal;
    }
</style>
<div id="presentedMap" style="width: 100%; height: 100%;"></div>
<script type="text/javascript">
var mapscript = document.createElement('script');
document.body.appendChild(mapscript);
mapscript.onload = function() {
    var presentMap = L.map('presentedMap').setView([${data}], ${zoomLevel});
    L.tileLayer('${tileUrl}', {
        attribution: '${tileAttribution}'
    }).addTo(presentMap);

    L.marker([${data}]).addTo(presentMap)
        .bindPopup('${data}')
        .openPopup();
};
mapscript.src = "${leafletUrl}";
</script>`;
    }
}

export default ShowOnMap;
