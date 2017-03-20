#!/usr/bin/env node
const request = require('./lib/request');
const xss = require('./lib/xss');

const INFO = `Patronus.io Backend Developer Test
Usage:
    index.js <url> <payload>
    url     - URL of PHP script to test (protocol optional, default HTTP)
    payload - Value of 'name' parameter for GET request`;

if(process.argv.length !== 4) {
    console.log(INFO);
    process.exitCode = 1;
    return;
}

let [url, payload] = process.argv.slice(2,4);

request(url, payload, (err, res, body) => {
    if(err) {
        console.error(err.message);
        process.exitCode = 1;
        return;
    }

    let isVuln = xss(payload, body.toString());
    if(isVuln) {
        console.log(`VULNERABLE using payload ${payload}`);
        console.log('The following characters were not properly encoded:');
        console.log(`${isVuln}`);
    } else {
        console.log(`NOT VULNERABLE using payload ${payload}`);
    }
});