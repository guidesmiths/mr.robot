var fs = require('fs')
var path = require('path')
var humans = fs.readFileSync(path.join(__dirname, 'humans.txt'), 'utf-8')
var pkg = require('../package.json')
var format = require('util').format

module.exports = function(req, res) {
    res.setHeader('Content-Type', 'text/plain')
    pkg.contributors ? contributors(res) : allTheHumansAreDead(res)
}

function allTheHumansAreDead(res) {
    res.write(humans)
    res.end()
}

function contributors(res) {
    res.write('/* TEAM */\n')
    pkg.contributors.forEach(function(contributor) {
        if (contributor.name) res.write(format('name: %s\n', contributor.name))
        if (contributor.email) res.write(format('email: %s\n', contributor.email))
        res.write('\n')
    })
    res.end()
}