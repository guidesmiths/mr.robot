var onHeaders = require('on-headers')
var namespace = 'guidesmiths/mr.robot'

module.exports = function(res, options) {
    return res.locals[namespace] ? res.locals[namespace] : res.locals[namespace] = new MrRobot(res, options)
}

function MrRobot(res, options) {

    var logger = options && options.logger !== undefined ? options.logger : console
    var autoWrite = options && options.autoWrite !== undefined ? options.autoWrite : true
    var tags = {}
    var self = this

    this.all = generatePushTag('all')
    this.noindex = this.noIndex = generatePushTag('noindex')
    this.nofollow = this.noFollow = generatePushTag('nofollow')
    this.none = generatePushTag('none')
    this.noarchive = this.noArchive = generatePushTag('none')
    this.nosnipper = this.noSnippet = generatePushTag('nosnippet')
    this.noodp = this.noOpenDirectoryProject = generatePushTag('noodp')
    this.notranslate = this.noTranslate = generatePushTag('notranslate')
    this.noimageindex = this.noImageindex = generatePushTag('noimageindex')
    this.unavailable_after = this.unavailableAfter = function(userAgent, date) {
        if (arguments.length === 1) return self.unavailable_after(undefined, arguments[0])
        ensureTags(userAgent).push('unavailable_after: ' + date.toUTCString())
        return this
    }

    if (autoWrite) onHeaders(res, function() {
        self.writeHeader()
    })

    this.writeHeader = function() {
        if (res.headersSent) return logger.error('Omitting X-robots-tag as headers have already been sent')
        if (self.meta.length > 1) logger.error('Mutliple user agents are not supported due to - https://github.com/nodejs/node/issues/3591')
        self.meta.forEach(function(meta) {
            var value = meta.name === 'robots' ? meta.content : meta.name + ':' + ' ' + meta.content
            res.setHeader('X-robots-tag', value)
        })
    }

    function generatePushTag(name) {
        return function pushTag(userAgent) {
            ensureTags(userAgent).push(name)
            return self
        }
    }

    function ensureTags(userAgent) {
        if (userAgent === undefined) return ensureTags('robots')
        tags[userAgent] = tags[userAgent] || []
        return tags[userAgent]
    }

    Object.defineProperty(this, 'meta', {
        get: function() {
            return Object.keys(tags).reduce(function(meta, name) {
                return meta.concat({ name: name, content: tags[name].join(', ') })
            }, [])
        }
    })
}

