var middleware = require('../')
var assert = require('assert')
var express = require('express')
var request = require('supertest')
var app = express()

var server

before(function(done) {
    app.get('/', middleware)
    server = app.listen(3000, done)
})

after(function(done) {
    server.close(done)
})

describe('Mr. Robot', function() {

    it('should output a general directive', function(done) {
        middleware.noindex()
        request(app).get('/').expect('x-robots-tag', 'noindex').end(done)
    })

    it('should output a browser directive', function(done) {
        middleware.noindex('googlebot')
        request(app).get('/').expect('x-robots-tag', 'googlebot: noindex').end(done)
    })

    it('should output a multiple directives', function(done) {
        middleware.noindex()
        middleware.nofollow()
        request(app).get('/')
            .expect('x-robots-tag', 'noindex, nofollow')
            .end(done)
    })

})
