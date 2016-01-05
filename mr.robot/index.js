var merge = require('lodash.merge')

var tags = {}

function middleware(req, res, next) {
    Object.keys(tags).forEach(function(userAgent) {
        var directives = tags[userAgent]
        var value = (userAgent ? userAgent + ': ' : '') + directives.join(', ')
        res.setHeader('X-Robots-Tag', value)
    })
    next()
}

var methods = {
    all: generatePushTag('all'),
    noindex: generatePushTag('noindex'),
    nofollow: generatePushTag('nofollow'),
    none: generatePushTag('none'),
    noarchive: generatePushTag('none'),
    nosnippet: generatePushTag('nosnippet'),
    noodp: generatePushTag('noodp'),
    notranslate: generatePushTag('notranslate'),
    noimageindex: generatePushTag('noimageindex'),
    unavailable_after: function(userAgent, date) {
        ensureTags(userAgent).push('unavailable_after: ' + date.toUTCString())
    }
}

function generatePushTag(name) {
    return function pushTag(userAgent) {
        ensureTags(userAgent).push(name)
    }
}

function ensureTags(userAgent) {
    if (userAgent === undefined) return ensureTags('')
    return tags[userAgent] = tags[userAgent] || []
}

module.exports = merge(middleware, methods)