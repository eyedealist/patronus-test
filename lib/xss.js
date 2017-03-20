// Dangerous HTML entities
const ENTITIES = {
    '"': {
        entity: /"/g,
        encoding: /&(quot|#x[0]*22|#[0]*34);/i
    },
    '\'': {
        entity: /'/g,
        encoding: /&(apos|#x[0]*27|#[0]*39);/i
    },
    '&': {
        entity: /&/g,
        encoding: /&(amp|#x[0]*26|#[0]*38);/i
    },
    '<': {
        entity: /</g,
        encoding: /&(lt|#x[0]*3C|#[0]*60);/i
    },
    '>': {
        entity: />/g,
        encoding: /&(gt|#x[0]*3E|#[0]*62);/i
    }
};

// Regex to extract the echoed payload
const RE = /<pre>Hello (.*)<\/pre>/i;

/**
 * Generates a map containing the number of occurrences of each HTML entity in <str>.
 *
 * @param {string} str - String to search for raw HTML entities
 * @returns Map
 */
function mapEntities(str) {
    let map = new Map();

    for( let key of Object.keys(ENTITIES) ) {
        let matches = str.match(ENTITIES[key].entity);
        if(matches != null) {
            map.set(key, matches.length);
        }
    }

    return map;
}

/**
 * Removes encoded HTML entity occurrences in <str> from <map>.
 *
 * @param {string} str - String to search for encoded HTML entities
 * @param {Map} map - Map to track un-encoded HTML entities
 */
function unmapEntities(str, map) {
    for( let key of map.keys() ) {

        let countRaw = map.get(key);
        let matches = str.match(ENTITIES[key].encoding);
        let countEncoded = matches ? matches.length : 0;
        if(countEncoded < countRaw) {
            // Not all occurrences were encoded, updated count
            map.set(key, countRaw - countEncoded);
        } else {
            // All occurrences encoded, remove entity
            map.delete(key);
        }
    }

    return map;
}

/**
 * Tests <data> for the presence of un-encoded special characters present in
 * <payload>. If payload contains no special characters, or data is safe from XSS,
 * returns null, otherwise, returns array of un-encoded special characters detected.
 *
 * @param {string} payload - Payload sent to server
 * @param {string} data - Response to test for un-encoded characters
 * @returns null|[string]
 */
module.exports = function xss(payload, data) {
    // Extract echoed payload from data response
    let result = RE.exec(data);
    if(!result) throw new Error('Unable to find echoed payload in HTML response');
    let echo = result[1];

    // Get number of occurrences of each entity in payload
    let map = mapEntities(payload);

    // If payload contains no special characters, we can't test for XSS vulnerability
    if(map.size === 0) {
        return null;
    }

    // Update count of entities after encoding check
    unmapEntities(echo, map);

    if(map.size === 0) {
        return null;
    }

    return [ ...map.keys() ];
};