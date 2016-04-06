var assert = require('assert')
var express = require('express')
var request = require('supertest')
var app = express()
var mrRobot = require('..')
var StubConsole = require('./StubConsole')


describe('Mr. Robot', function() {

    var server
    var stubConsole = new StubConsole()

    before(function(done) {
        app.get('/noindex', function(req, res) {
            mrRobot(res, { logger: stubConsole }).noIndex()
            res.status(200).json({ meta: mrRobot(res).meta }).end()
        })
        app.get('/noindex-nofollow', function(req, res) {
            mrRobot(res, { logger: stubConsole }).noIndex().noFollow()
            res.status(200).json({ meta: mrRobot(res).meta }).end()
        })
        app.get('/googlebot-noindex', function(req, res) {
            mrRobot(res, { logger: stubConsole }).noIndex('googlebot')
            res.status(200).json({ meta: mrRobot(res).meta }).end()
        })
        app.get('/node-issues-3591', function(req, res) {
            mrRobot(res, { logger: stubConsole }, stubConsole).noIndex('googlebot').noFollow('otherbot').noIndex('otherbot').all()
            res.status(200).end()
        })
        app.get('/multiple-user-agents', function(req, res) {
            mrRobot(res, { logger: stubConsole, autoWrite: false }, stubConsole).noIndex('googlebot').noFollow('otherbot').noIndex('otherbot').all()
            res.status(200).json({ meta: mrRobot(res).meta }).end()
        })
        app.get('/unavailable-after', function(req, res) {
            mrRobot(res, { logger: stubConsole }).unavailableAfter(new Date(Date.parse('2016-01-10T18:11:54.445Z')))
            res.status(200).json({ meta: mrRobot(res).meta }).end()
        })
        app.get('/googlebot-unavailable-after', function(req, res) {
            mrRobot(res, { logger: stubConsole }).unavailableAfter('googlebot', new Date(Date.parse('2016-01-10T18:11:54.445Z')))
            res.status(200).json({ meta: mrRobot(res).meta }).end()
        })
        app.get('/response-ended', function(req, res) {
            res.status(204).end()
            mrRobot(res, { logger: stubConsole, autoWrite: false }).noindex().writeHeader()
        })
        server = app.listen(3000, done)
    })

    afterEach(function() {
        stubConsole.assertEmpty()
    })

    after(function(done) {
        server.close(done)
    })

    it('should output a general directive', function(done) {
        request(app).get('/noindex')
            .expect(200)
            .expect('x-robots-tag', 'noindex')
            .end(done)
    })

    it('should output a multiple general directives', function(done) {
        request(app).get('/noindex-nofollow')
            .expect(200)
            .expect('x-robots-tag', 'noindex, nofollow')
            .end(done)
    })

    it('should output a browser directive', function(done) {
        request(app).get('/googlebot-noindex')
            .expect(200)
            .expect('x-robots-tag', 'googlebot: noindex')
            .end(done)
    })

    // https://github.com/nodejs/node/issues/3591
    it('should warn when output a multiple user agent directives', function(done) {
        request(app).get('/node-issues-3591')
            .expect(200)
            .expect(function() {
                assert.equal(stubConsole.getError(), 'Mutliple user agents are not supported due to - https://github.com/nodejs/node/issues/3591')
            }).end(done)
    })

    it('should output meta tags', function(done) {
        request(app).get('/multiple-user-agents')
            .expect(200, { meta: [
                { name: 'googlebot', content: 'noindex' },
                { name: 'otherbot', content: 'nofollow, noindex' },
                { name: 'robots', content: 'all' }
            ] })
            .end(done)
    })

    it('should generate a RFC-850 for unavailable_after directives', function(done) {
        request(app).get('/unavailable-after')
            .expect(200)
            .expect('x-robots-tag', 'unavailable_after: Sun, 10 Jan 2016 18:11:54 GMT')
            .end(done)
    })

    it('should generate a RFC-850 for user agent specific unavailable_after directives', function(done) {
        request(app).get('/googlebot-unavailable-after')
            .expect(200)
            .expect('x-robots-tag', 'googlebot: unavailable_after: Sun, 10 Jan 2016 18:11:54 GMT')
            .end(done)
    })

    it('should not attempt to write headers after the response has been sent', function(done) {
        request(app).get('/response-ended')
            .expect(204)
            .expect(function() {
                assert.equal(stubConsole.getError(), 'Omitting X-robots-tag as headers have already been sent')
            })
            .end(done)
    })

})
