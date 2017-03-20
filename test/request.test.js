const assert = require('assert');
const nock = require('nock');
const request = require('../lib/request');
const pkg = require('../package.json');

describe('request()', function() {

    it('should set query parameter <name> to payload', function(done) {
        let scope = nock('http://patronus.io')
            .get('/')
            .query({ name: 'name' })
            .reply(200, 'Success');

        request('http://patronus.io', 'name', () => {
            assert(scope.isDone());
            done();
        });
    });

    it('should set User-Agent header', function(done) {
        let scope = nock('http://patronus.io', {
            reqHeaders: {
                'User-Agent': pkg.repository.url
            }
        })
            .get('/')
            .query({ name: 'name' })
            .reply(200, 'Success');

        request('http://patronus.io', 'name', () => {
            assert(scope.isDone());
            done();
        });
    });

    it('should return error if status code !== 200', function(done) {
        let scope = nock('http://patronus.io')
            .get('/')
            .query({ name: 'name' })
            .reply(404);

        request('http://patronus.io', 'name', (err, res) => {
            assert(scope.isDone());
            assert(err instanceof Error);
            assert(res.statusCode === 404);
            done();
        });
    });

    it('should return error if request fails', function(done) {
        let scope = nock('http://patronus.io')
            .get('/')
            .query({ name: 'name' })
            .socketDelay(2000)
            .replyWithError('ETIMEDOUT');

        request('http://patronus.io', 'name', (err) => {
            assert(scope.isDone());
            assert(err instanceof Error);
            assert(err.message === 'ETIMEDOUT');
            done();
        });
    });

    it('should allow url without a protocol specified', function(done) {
        let scope = nock('http://patronus.io')
            .get('/')
            .query({ name: 'name' })
            .reply(200, 'Success');

        request('patronus.io', 'name', () => {
            assert(scope.isDone());
            done();
        });
    });

    it('should allow url with port specified', function(done) {
        let scope = nock('http://patronus.io:3000')
            .get('/')
            .query({ name: 'name' })
            .reply(200, 'Success');

        request('http://patronus.io:3000', 'name', () => {
            assert(scope.isDone());
            done();
        });
    });

    it('should allow url with HTTP authentication specified', function(done) {
        let scope = nock('http://user:password@patronus.io')
            .get('/')
            .query({ name: 'name' })
            .reply(200, 'Success');

        request('http://user:password@patronus.io', 'name', () => {
            assert(scope.isDone());
            done();
        });
    });

    it('should allow url with other query parameters specified', function(done) {
        let scope = nock('http://patronus.io')
            .get('/')
            .query({ foo: 'foo', name: 'name' })
            .reply(200, 'Success');

        request('http://patronus.io?foo=foo', 'name', () => {
            assert(scope.isDone());
            done();
        });
    });

});