const assert = require('assert');
const fs = require('fs');
const xss = require('../lib/xss');

describe('xss()', function() {

    before(function(done) {
        fs.readFile(__dirname + '/fixtures/output.html', (err, data) => {
            if(err) throw err;

            data = data.toString();
            this.createResponse = (payload) => {
                return data.replace('${PAYLOAD}', payload);
            };
            done();
        });
    });

    it('should return null when no HTML entities exist in payload', function() {
        let payload = 'Hello';
        let isVuln = xss(payload, this.createResponse(payload));
        assert(isVuln === null);
    });

    it('should throw an error if HTML response not in expected format', function() {
        assert.throws(() => xss('Payload', 'This is not right'));
    });

    it('should detect un-encoded single-quote', function() {
        let payload = 'alert(\'xss\');';
        let isVuln = xss(payload, this.createResponse(payload));
        assert(Array.isArray(isVuln));
        assert(isVuln.length === 1);
        assert(isVuln[0] === '\'');
    });

    it('should detect un-encoded double-quote', function() {
        let payload = 'alert("xss");';
        let isVuln = xss(payload, this.createResponse(payload));
        assert(Array.isArray(isVuln));
        assert(isVuln.length === 1);
        assert(isVuln[0] === '"');
    });

    it('should detect un-encoded ampersand', function() {
        let payload = '&XSS';
        let isVuln = xss(payload, this.createResponse(payload));
        assert(Array.isArray(isVuln));
        assert(isVuln.length === 1);
        assert(isVuln[0] === '&');
    });

    it('should detect un-encoded greater-than', function() {
        let payload = 'Node.js > PHP === SO TRUE';
        let isVuln = xss(payload, this.createResponse(payload));
        assert(Array.isArray(isVuln));
        assert(isVuln.length === 1);
        assert(isVuln[0] === '>');
    });

    it('should detect un-encoded less-then', function() {
        let payload = 'Node.js < Golang === MAYBE';
        let isVuln = xss(payload, this.createResponse(payload));
        assert(Array.isArray(isVuln));
        assert(isVuln.length === 1);
        assert(isVuln[0] === '<');
    });

    it('should allow characters encoded in named format', function() {
        let isVuln = xss('><\'"&', this.createResponse('&gt;&lt;&apos;&quot;&amp;'));
        assert(isVuln == null, `Didn't allow characters: ${isVuln}`);
    });

    it('should allow characters encoded in decimal format, with or without leading zeroes', function() {
        let isVuln = xss('><\'"&', this.createResponse('&#0062;&#060;&#39;&#034;&#0038;'));
        assert(isVuln == null, `Didn't allow characters: ${isVuln}`);
    });

    it('should allow characters encoded in hex format, with or without leading zeroes', function() {
        let isVuln = xss('><\'"&', this.createResponse('&#x3E;&#x03c;&#x00027;&#x22;&#x00026;'));
        assert(isVuln == null, `Didn't allow characters: ${isVuln}`);
    });

    it('should return null when all HTML entities are properly encoded', function() {
        let isVuln = xss(
            '<script>alert("XSS hax!\'&\'");</script>',
            this.createResponse('&#x3C;script&#x3E;alert(&#34;XSS hax!&#x27;&amp;&#x27;&#x22;);&#x3C;/script&#x3E;')
        );
        assert(isVuln == null, `False positive for characters: ${isVuln}`);
    });

});