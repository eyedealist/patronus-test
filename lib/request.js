const http = require('http');
const url = require('url');
const pkg = require('../package.json');

/**
 * Parses url and adds name as query parameter.
 *
 * @param {string} href
 * @param {string} name
 * @returns {url.URL}
 */
function getUrl(href, name) {
    let urlObj = url.parse(href, true);
    Object.assign(urlObj.query, { name });
    delete urlObj.search;
    return url.parse(url.format(urlObj));
}

/**
 * @callback requestCallback
 * @param {Error} [err=null]
 * @param {http.IncomingMessage} [res=null]
 * @param {string} [body=null]
 */

/**
 * Makes a request to the specified URL and sets the name GET parameter.
 * Response is provided to callback as a Buffer.
 *
 * @param {string} href
 * @param {string} name
 * @param {requestCallback} done
 */
module.exports = function request(href, name, done) {
    // Prepend protocol if none exists (for convenience)
    if(!/^https?:\/\//i.test(href)) {
        href = 'http://' + href;
    }

    // Parse url and add name as query parameter
    let { protocol, host, port, auth, path } = getUrl(href, name);

    let req = http.get({
        protocol, host, port, auth, path,
        headers: {
            // Identify request as coming from a known trusted source
            'User-Agent': pkg.repository.url
        }
    }, (res) => {
        let data = [];

        if(res.statusCode !== 200) {
            return done(new Error(`HTTP Error - ${res.statusCode}: ${res.statusMessage}`), res);
        }

        res.on('data', (chunk) => {
            data.push(chunk);
        });

        res.on('end', () => {
            return done(null, res, Buffer.concat(data).toString());
        });
    });

    req.on('error', (err) => {
        return done(err);
    });

    req.end();
};