/**
 * @author Cynser
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2018
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import Utils from "../Utils.mjs";
import cptable from "codepage";
import {CHR_ENC_CODE_PAGES} from "../lib/ChrEnc.mjs";

/**
 * Text Encoding Brute Force operation
 */
class TextEncodingBruteForce extends Operation {

    /**
     * TextEncodingBruteForce constructor
     */
    constructor() {
        super();

        this.name = "Text Encoding Brute Force";
        this.module = "Encodings";
        this.description =   "枚举输入的所有支持的文本编码，使您能够快速找到正确的编码。\\n<br><br>\\n支持的字符集有:\\n<ul>\\n<li>UTF-8 (65001)</li>\\n<li>UTF-7 (65000)</li>\\n<li>UTF-16LE (1200)</li>\\n<li>UTF-16BE (1201)</li>\\n<li>UTF-32LE (12000)</li>\\n<li>UTF-32BE (12001)</li>\\n<li>IBM EBCDIC International (500)</li>\\n<li>IBM EBCDIC US-Canada (37)</li>\\n<li>IBM EBCDIC Multilingual/ROECE (Latin 2) (870)</li>\\n<li>IBM EBCDIC Greek Modern (875)</li>\\n<li>IBM EBCDIC French (1010)</li>\\n<li>IBM EBCDIC Turkish (Latin 5) (1026)</li>\\n<li>IBM EBCDIC Latin 1/Open System (1047)</li>\\n<li>IBM EBCDIC Lao (1132/1133/1341)</li>\\n<li>IBM EBCDIC US-Canada (037 + Euro symbol) (1140)</li>\\n<li>IBM EBCDIC Germany (20273 + Euro symbol) (1141)</li>\\n<li>IBM EBCDIC Denmark-Norway (20277 + Euro symbol) (1142)</li>\\n<li>IBM EBCDIC Finland-Sweden (20278 + Euro symbol) (1143)</li>\\n<li>IBM EBCDIC Italy (20280 + Euro symbol) (1144)</li>\\n<li>IBM EBCDIC Latin America-Spain (20284 + Euro symbol) (1145)</li>\\n<li>IBM EBCDIC United Kingdom (20285 + Euro symbol) (1146)</li>\\n<li>IBM EBCDIC France (20297 + Euro symbol) (1147)</li>\\n<li>IBM EBCDIC International (500 + Euro symbol) (1148)</li>\\n<li>IBM EBCDIC Icelandic (20871 + Euro symbol) (1149)</li>\\n<li>IBM EBCDIC Germany (20273)</li>\\n<li>IBM EBCDIC Denmark-Norway (20277)</li>\\n<li>IBM EBCDIC Finland-Sweden (20278)</li>\\n<li>IBM EBCDIC Italy (20280)</li>\\n<li>IBM EBCDIC Latin America-Spain (20284)</li>\\n<li>IBM EBCDIC United Kingdom (20285)</li>\\n<li>IBM EBCDIC Japanese Katakana Extended (20290)</li>\\n<li>IBM EBCDIC France (20297)</li>\\n<li>IBM EBCDIC Arabic (20420)</li>\\n<li>IBM EBCDIC Greek (20423)</li>\\n<li>IBM EBCDIC Hebrew (20424)</li>\\n<li>IBM EBCDIC Korean Extended (20833)</li>\\n<li>IBM EBCDIC Thai (20838)</li>\\n<li>IBM EBCDIC Icelandic (20871)</li>\\n<li>IBM EBCDIC Cyrillic Russian (20880)</li>\\n<li>IBM EBCDIC Turkish (20905)</li>\\n<li>IBM EBCDIC Latin 1/Open System (1047 + Euro symbol) (20924)</li>\\n<li>IBM EBCDIC Cyrillic Serbian-Bulgarian (21025)</li>\\n<li>OEM United States (437)</li>\\n<li>OEM Greek (formerly 437G); Greek (DOS) (737)</li>\\n<li>OEM Baltic; Baltic (DOS) (775)</li>\\n<li>OEM Russian; Cyrillic + Euro symbol (808)</li>\\n<li>OEM Multilingual Latin 1; Western European (DOS) (850)</li>\\n<li>OEM Latin 2; Central European (DOS) (852)</li>\\n<li>OEM Cyrillic (primarily Russian) (855)</li>\\n<li>OEM Turkish; Turkish (DOS) (857)</li>\\n<li>OEM Multilingual Latin 1 + Euro symbol (858)</li>\\n<li>OEM Portuguese; Portuguese (DOS) (860)</li>\\n<li>OEM Icelandic; Icelandic (DOS) (861)</li>\\n<li>OEM Hebrew; Hebrew (DOS) (862)</li>\\n<li>OEM French Canadian; French Canadian (DOS) (863)</li>\\n<li>OEM Arabic; Arabic (864) (864)</li>\\n<li>OEM Nordic; Nordic (DOS) (865)</li>\\n<li>OEM Russian; Cyrillic (DOS) (866)</li>\\n<li>OEM Modern Greek; Greek, Modern (DOS) (869)</li>\\n<li>OEM Cyrillic (primarily Russian) + Euro Symbol (872)</li>\\n<li>Windows-874 Thai (874)</li>\\n<li>Windows-1250 Central European (1250)</li>\\n<li>Windows-1251 Cyrillic (1251)</li>\\n<li>Windows-1252 Latin (1252)</li>\\n<li>Windows-1253 Greek (1253)</li>\\n<li>Windows-1254 Turkish (1254)</li>\\n<li>Windows-1255 Hebrew (1255)</li>\\n<li>Windows-1256 Arabic (1256)</li>\\n<li>Windows-1257 Baltic (1257)</li>\\n<li>Windows-1258 Vietnam (1258)</li>\\n<li>ISO-8859-1 Latin 1 Western European (28591)</li>\\n<li>ISO-8859-2 Latin 2 Central European (28592)</li>\\n<li>ISO-8859-3 Latin 3 South European (28593)</li>\\n<li>ISO-8859-4 Latin 4 North European (28594)</li>\\n<li>ISO-8859-5 Latin/Cyrillic (28595)</li>\\n<li>ISO-8859-6 Latin/Arabic (28596)</li>\\n<li>ISO-8859-7 Latin/Greek (28597)</li>\\n<li>ISO-8859-8 Latin/Hebrew (28598)</li>\\n<li>ISO 8859-8 Hebrew (ISO-Logical) (38598)</li>\\n<li>ISO-8859-9 Latin 5 Turkish (28599)</li>\\n<li>ISO-8859-10 Latin 6 Nordic (28600)</li>\\n<li>ISO-8859-11 Latin/Thai (28601)</li>\\n<li>ISO-8859-13 Latin 7 Baltic Rim (28603)</li>\\n<li>ISO-8859-14 Latin 8 Celtic (28604)</li>\\n<li>ISO-8859-15 Latin 9 (28605)</li>\\n<li>ISO-8859-16 Latin 10 (28606)</li>\\n<li>ISO 2022 JIS Japanese with no halfwidth Katakana (50220)</li>\\n<li>ISO 2022 JIS Japanese with halfwidth Katakana (50221)</li>\\n<li>ISO 2022 Japanese JIS X 0201-1989 (1 byte Kana-SO/SI) (50222)</li>\\n<li>ISO 2022 Korean (50225)</li>\\n<li>ISO 2022 Simplified Chinese (50227)</li>\\n<li>ISO 6937 Non-Spacing Accent (20269)</li>\\n<li>EUC Japanese (51932)</li>\\n<li>EUC Simplified Chinese (51936)</li>\\n<li>EUC Korean (51949)</li>\\n<li>ISCII Devanagari (57002)</li>\\n<li>ISCII Bengali (57003)</li>\\n<li>ISCII Tamil (57004)</li>\\n<li>ISCII Telugu (57005)</li>\\n<li>ISCII Assamese (57006)</li>\\n<li>ISCII Oriya (57007)</li>\\n<li>ISCII Kannada (57008)</li>\\n<li>ISCII Malayalam (57009)</li>\\n<li>ISCII Gujarati (57010)</li>\\n<li>ISCII Punjabi (57011)</li>\\n<li>Japanese Shift-JIS (932)</li>\\n<li>Simplified Chinese GBK (936)</li>\\n<li>Korean (949)</li>\\n<li>Traditional Chinese Big5 (950)</li>\\n<li>US-ASCII (7-bit) (20127)</li>\\n<li>Simplified Chinese GB2312 (20936)</li>\\n<li>KOI8-R Russian Cyrillic (20866)</li>\\n<li>KOI8-U Ukrainian Cyrillic (21866)</li>\\n<li>Mazovia (Polish) MS-DOS (620)</li>\\n<li>Arabic (ASMO 708) (708)</li>\\n<li>Arabic (Transparent ASMO); Arabic (DOS) (720)</li>\\n<li>Kamenický (Czech) MS-DOS (895)</li>\\n<li>Korean (Johab) (1361)</li>\\n<li>MAC Roman (10000)</li>\\n<li>Japanese (Mac) (10001)</li>\\n<li>MAC Traditional Chinese (Big5) (10002)</li>\\n<li>Korean (Mac) (10003)</li>\\n<li>Arabic (Mac) (10004)</li>\\n<li>Hebrew (Mac) (10005)</li>\\n<li>Greek (Mac) (10006)</li>\\n<li>Cyrillic (Mac) (10007)</li>\\n<li>MAC Simplified Chinese (GB 2312) (10008)</li>\\n<li>Romanian (Mac) (10010)</li>\\n<li>Ukrainian (Mac) (10017)</li>\\n<li>Thai (Mac) (10021)</li>\\n<li>MAC Latin 2 (Central European) (10029)</li>\\n<li>Icelandic (Mac) (10079)</li>\\n<li>Turkish (Mac) (10081)</li>\\n<li>Croatian (Mac) (10082)</li>\\n<li>CNS Taiwan (Chinese Traditional) (20000)</li>\\n<li>TCA Taiwan (20001)</li>\\n<li>ETEN Taiwan (Chinese Traditional) (20002)</li>\\n<li>IBM5550 Taiwan (20003)</li>\\n<li>TeleText Taiwan (20004)</li>\\n<li>Wang Taiwan (20005)</li>\\n<li>Western European IA5 (IRV International Alphabet 5) (20105)</li>\\n<li>IA5 German (7-bit) (20106)</li>\\n<li>IA5 Swedish (7-bit) (20107)</li>\\n<li>IA5 Norwegian (7-bit) (20108)</li>\\n<li>T.61 (20261)</li>\\n<li>Japanese (JIS 0208-1990 and 0212-1990) (20932)</li>\\n<li>Korean Wansung (20949)</li>\\n<li>Extended/Ext Alpha Lowercase (21027)</li>\\n<li>Europa 3 (29001)</li>\\n<li>Atari ST/TT (47451)</li>\\n<li>HZ-GB2312 Simplified Chinese (52936)</li>\\n<li>Simplified Chinese GB18030 (54936)</li>\\n</ul>";
        this.infoURL = "https://wikipedia.org/wiki/Character_encoding";
        this.inputType = "string";
        this.outputType = "json";
        this.presentType = "html";
        this.args = [
            {
                name: "Mode",
                type: "option",
                value: ["Encode", "Decode"]
            }
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {json}
     */
    run(input, args) {
        const output = {},
            charsets = Object.keys(CHR_ENC_CODE_PAGES),
            mode = args[0];

        charsets.forEach(charset => {
            try {
                if (mode === "Decode") {
                    output[charset] = cptable.utils.decode(CHR_ENC_CODE_PAGES[charset], input);
                } else {
                    output[charset] = Utils.arrayBufferToStr(cptable.utils.encode(CHR_ENC_CODE_PAGES[charset], input));
                }
            } catch (err) {
                output[charset] = "Could not decode.";
            }
        });

        return output;
    }

    /**
     * Displays the encodings in an HTML table for web apps.
     *
     * @param {Object[]} encodings
     * @returns {html}
     */
    present(encodings) {
        let table = "<table class='table table-hover table-sm table-bordered table-nonfluid'><tr><th>Encoding</th><th>Value</th></tr>";

        for (const enc in encodings) {
            const value = Utils.escapeHtml(Utils.escapeWhitespace(encodings[enc]));
            table += `<tr><td>${enc}</td><td>${value}</td></tr>`;
        }

        table += "<table>";
        return table;
    }

}

export default TextEncodingBruteForce;
