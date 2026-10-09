/**
 * @author h345983745
 * @copyright Crown Copyright 2019
 * @license Apache-2.0
 */
import Operation from "../Operation.mjs";
import OperationError from "../errors/OperationError.mjs";

/**
 * DNS over HTTPS operation
 */
class DNSOverHTTPS extends Operation {

    /**
     * DNSOverHTTPS constructor
     */
    constructor() {
        super();

        this.name = "DNS over HTTPS";
        this.module = "Default";
        this.description =   "使用单个域名，并通过 HTTPS DNS 执行 DNS 查询。\\n<br><br>\\n默认情况下, <a href='https://developers.cloudflare.com/1.1.1.1/dns-over-https/'>Cloudflare</a> 和 <a href='https://developers.google.com/speed/public-dns/docs/dns-over-https'>Google</a> 支持 DNS over HTTPS 服务。\\n<br><br>\\n可用于任何支持 GET 参数的服务 <code>name</code> 和 <code>type</code>.";
        this.infoURL = "https://wikipedia.org/wiki/DNS_over_HTTPS";
        this.inputType = "string";
        this.outputType = "JSON";
        this.manualBake = true;
        this.args = [
            {
                name: "Resolver",
                type: "editableOption",
                value: [
                    {
                        name: "Google",
                        value: "https://dns.google.com/resolve"
                    },
                    {
                        name: "Cloudflare",
                        value: "https://cloudflare-dns.com/dns-query"
                    }
                ]
            },
            {
                name: "Request Type",
                type: "option",
                value: [
                    "A",
                    "AAAA",
                    "ANAME",
                    "CERT",
                    "CNAME",
                    "DNSKEY",
                    "HTTPS",
                    "IPSECKEY",
                    "LOC",
                    "MX",
                    "NS",
                    "OPENPGPKEY",
                    "PTR",
                    "RRSIG",
                    "SIG",
                    "SOA",
                    "SPF",
                    "SRV",
                    "SSHFP",
                    "TA",
                    "TXT",
                    "URI",
                    "ANY"
                ]
            },
            {
                name: "Answer Data Only",
                type: "boolean",
                value: false
            },
            {
                name: "Disable DNSSEC validation",
                type: "boolean",
                value: false
            }
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {JSON}
     */
    run(input, args) {
        const [resolver, requestType, justAnswer, DNSSEC] = args;
        let url = URL;
        try {
            url = new URL(resolver);
        } catch (error) {
            throw new OperationError(error.toString() +
            "\n\nThis error could be caused by one of the following:\n" +
            " - An invalid Resolver URL\n");
        }
        const params = {name: input, type: requestType, cd: DNSSEC};

        url.search = new URLSearchParams(params);

        return fetch(url, {headers: {"accept": "application/dns-json"}}).then(response => {
            return response.json();
        }).then(data => {
            if (justAnswer) {
                return extractData(data.Answer);
            }
            return data;
        }).catch(e => {
            throw new OperationError(`Error making request to ${url}\n${e.toString()}`);
        });

    }
}

/**
 * Construct an array of just data from a DNS Answer section
 *
 * @private
 * @param {JSON} data
 * @returns {JSON}
 */
function extractData(data) {
    if (typeof(data) == "undefined") {
        return [];
    } else {
        const dataValues = [];
        data.forEach(element => {
            dataValues.push(element.data);
        });
        return dataValues;
    }
}

export default DNSOverHTTPS;
