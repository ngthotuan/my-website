const http = require('http');
const https = require('https');
const fs = require('fs');
const parser = require('xml2js');

function getProtocol(url) {
    if (url.slice(0, 5) === 'https') return https;
    return http;
}

class XmlUtils {
    static fromString(xml, callback) {
        parser.parseString(xml, function (err, result) {
            callback(err, result);
        });
    }
    static fromFile(path, callback) {
        fs.readFile(path, function (err, data) {
            if (err) callback(err, null);
            parser.parseString(data, function (err, result) {
                callback(err, result);
            });
        });
    }
    static fromUrl(url, callback) {
        const protocol = getProtocol(url);
        protocol.get(url, function (res) {
            let xml = '';

            res.on('data', function (chunk) {
                xml += chunk;
            });

            res.on('error', function (e) {
                callback(e, null);
            });

            res.on('timeout', function (e) {
                callback(e, null);
            });

            res.on('end', function () {
                parser.parseString(xml, function (err, result) {
                    callback(err, result);
                });
            });
        });
    }
}

module.exports = XmlUtils;
