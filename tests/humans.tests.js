var express = require('express')
var request = require('supertest')
var rewire = require("rewire")
var assert = require('assert')
var humans = rewire('../middleware/humans')
var app = express()

var server

describe('Humans middleware', function() {

    before(function(done) {
        app.get('/humans.txt', humans)
        server = app.listen(3000, done)
    })

    after(function(done) {
        server.close(done)
    })

    it('should serve default humans.txt', function(done) {

        humans.__set__('pkg', {})

        request(app).get('/humans.txt')
            .expect(200)
            .expect('content-type', 'text/plain')
            .expect(function(res) {
                return /^The distant future/.test(res.body)
            })
            .end(done)
    })

    it('should serve custom humans.txt', function(done) {

        humans.__set__('pkg', {
            contributors: [
                { name: 'Stephen Cresswell', email: 'stephen.cresswell@guidesmiths.com' }
            ]
        })

        request(app).get('/humans.txt')
            .expect(200)
            .expect('content-type', 'text/plain')
            .expect('/* TEAM */\nname: Stephen Cresswell\nemail: stephen.cresswell@guidesmiths.com\n\n')
            .end(done)
    })

})
