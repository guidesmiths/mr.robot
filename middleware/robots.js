var mrRobot = require('..')
var format = require('util').format

module.exports = function(req, res) {
    res.setHeader('Content-Type', 'plain/text')
    mrRobot(res).robots.userAgents.forEach(function(userAgent) {
        res.write(format('User-agent: %s', userAgent))
        mrRobot(res).robots.userAgents[userAgent].forEach(function(directive) {
            res.write(format('%s: %s' ), directive.name, directive.value)
        })
    })
    mrRobot(res).robots.sitemaps.forEach(function(url) {
        res.write(format('Sitemap: %s', url))
    })
    mrRobot(res).robots.hosts.forEach(function(host) {
        res.write(format('Host: %s', host))
    })
    res.send()
}
