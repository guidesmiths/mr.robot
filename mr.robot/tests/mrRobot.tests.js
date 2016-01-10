var express = require('express')
var request = require('supertest')
var app = express()
var mrRobot = require('..')

var server

before(function(done) {
    app.get('/noindex', function(req, res) {
        mrRobot(res).noIndex().writeHeader()
        res.status(200).json({ meta: mrRobot(res).meta }).end()
    })
    app.get('/noindex-nofollow', function(req, res) {
        mrRobot(res).noIndex().noFollow().writeHeader()
        res.status(200).json({ meta: mrRobot(res).meta }).end()
    })
    app.get('/googlebot-noindex', function(req, res) {
        mrRobot(res).noIndex('googlebot').writeHeader()
        res.status(200).json({ meta: mrRobot(res).meta }).end()
    })
    app.get('/multiple-user-agents', function(req, res) {
        mrRobot(res).noIndex('googlebot').noFollow('otherbot').noIndex('otherbot').all()
        res.status(200).json({ meta: mrRobot(res).meta }).end()
    })
    app.get('/unavailable-after', function(req, res) {
        mrRobot(res).unavailableAfter(new Date(Date.parse('2016-01-10T18:11:54.445Z'))).writeHeader()
        res.status(200).json({ meta: mrRobot(res).meta }).end()
    })
    app.get('/googlebot-unavailable-after', function(req, res) {
        mrRobot(res).unavailableAfter('googlebot', new Date(Date.parse('2016-01-10T18:11:54.445Z'))).writeHeader()
        res.status(200).json({ meta: mrRobot(res).meta }).end()
    })
    server = app.listen(3000, done)
})

after(function(done) {
    server.close(done)
})

describe('Mr. Robot', function() {

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
    xit('should output a multiple user agent directives', function(done) {
        request(app).get('/multiple-user-agents')
            .expect(200)
            .expect(function(res) {
                // TODO
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

})
