# Mr. Robot

Mr. Robot helps you set robots meta tags and X-Robots-Tag headers as per [Robots meta tag and X-Robots-Tag HTTP header specifications](https://developers.google.com/webmasters/control-crawl-index/docs/robots_meta_tag?hl=en)

## Usage

### Setting an X-Robots-Tag response header
```
var mrRobot = require('..')

app.get('/example', function(req, res) {
    mrRobot(res).noIndex().noFollow().writeHeader()
})
```

Results in the following HTTP Header
```
x-robots-tag: noindex, nofollow
```

### Rendering a robots meta tag (with Moustache)

```
app.get('/example', function(req, res) {
    res.render('example', { robots: mrRobot(res).noIndex().noFollow().meta })
})
```
example.tmpl
```
{{#robots}}
    <meta name="{{name}}" content="{{content}}" />
{{/robots}}

```

### User Agent specific directives
```
var mrRobot = require('..')

app.get('/example', function(req, res) {
    var rob = mrRobot(res)
    rob.noIndex('googlebot').noFollow('googlebot').writeHeader()
    res.render('some-view', { robots: rob.meta })
})
```

Due to https://github.com/nodejs/node/issues/3591 it is not currently possible to set directives for multiple user agents using the X-Robots-Tag response header. For the moment you can only do this with meta robots tags.
