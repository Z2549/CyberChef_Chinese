/**
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import Utils from "../Utils.mjs";

/**
 * TCP/IP Checksum operation
 */
class TCPIPChecksum extends Operation {

    /**
     * TCPIPChecksum constructor
     */
    constructor() {
        super();

        this.name = "TCP/IP Checksum";
        this.module = "Crypto";
        this.description =   "根据原始字节输入计算 TCP（传输控制协议）或 IP（互联网协议）标头的校验和。";
        this.infoURL = "https://wikipedia.org/wiki/IPv4_header_checksum";
        this.inputType = "ArrayBuffer";
        this.outputType = "string";
        this.args = [];
    }

    /**
     * @param {ArrayBuffer} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        input = new Uint8Array(input);
        let csum = 0;

        for (let i = 0; i < input.length; i++) {
            if (i % 2 === 0) {
                csum += (input[i] << 8);
            } else {
                csum += input[i];
            }
        }

        csum = (csum >> 16) + (csum & 0xffff);

        return Utils.hex(0xffff - csum);
    }

}

export default TCPIPChecksum;
