var assert = require('assert')

module.exports = function StubConsole() {

    var errors = []
    var warnings = []

    this.error = function(message) {
        errors.push(message)
    }

    this.warn = function(message) {
        warnings.push(message)
    }

    this.info = function() {
    }

    this.debug = function() {
    }

    this.log = function() {
    }

    this.getError = function() {
        return errors.pop()
    }

    this.getWarning = function() {
        return errors.pop()
    }

    this.assertEmpty = function() {
        assert.deepEqual(errors, [])
        assert.deepEqual(warnings, [])
    }
}