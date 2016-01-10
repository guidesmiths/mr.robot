# Mr. Robot

Mr. Robot helps you set robots meta tags and X-Robots-Tag headers as per [Robots meta tag and X-Robots-Tag HTTP header specifications](https://developers.google.com/webmasters/control-crawl-index/docs/robots_meta_tag?hl=en)

## Usage

### Setting an X-Robots-Tag header
```
var mrRobot = require('..')

app.get('/noindex', function(req, res) {
    mrRobot(res).noIndex().noFollow().writeHeader()
})
```

Results in the following HTTP Header
```
x-robots-tag: noindex, nofollow
```

### Rendering a robots meta tag

```
app.get('/noindex', function(req, res) {
    res.render('some-view', { robots: mrRobot(res).noIndex().noFollow().meta })
})
```

With moustache
```
{{#robots}}
    <meta name="{{name}}" content="content" />
{{/robots}}

```


### User Agent specific directives

```
var mrRobot = require('..')

app.get('/noindex', function(req, res) {
    mrRobot(res).noIndex('googlebot').noFollow('googlebot').writeHeader()
    res.render('some-view', { robots: mrRobot(res).meta })
})
```

Due to https://github.com/nodejs/node/issues/3591 it is not currently possible to set directives for multiple user agents using the X-Robots-Tag response header. For the moment you can only do this with meta robots tags.