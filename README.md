![alt tag](https://raw.github.com/guidesmiths/mr.robot/master/MrRobot.png)

Mr. Robot helps you set robots meta tags and X-Robots-Tag headers as per [Robots meta tag and X-Robots-Tag HTTP header specifications](https://developers.google.com/webmasters/control-crawl-index/docs/robots_meta_tag?hl=en).

## X-Robots-Tag HTTP Response Header

#### Set an X-Robots-Tag response header for all crawlers
```js
var mrRobot = require('mr.robot')

app.get('/example', function(req, res) {
    mrRobot(res).noIndex().noFollow()
})
```
Results in the following response header
```
x-robots-tag: noindex, nofollow
```

#### Set an X-Robots-Tag response header for specific crawlers
```js
var mrRobot = require('mr.robot')

app.get('/example', function(req, res) {
    mrRobot(res).noIndex('googlebot').noFollow('googlebot')
})
```
Results in the following response header
```
x-robots-tag: googlebot: noindex, nofollow
```

Due to https://github.com/nodejs/node/issues/3591 it is not currently possible to set directives for multiple user agents using the X-Robots-Tag response header. For the moment you can only do this with meta robots tags.


## Meta Robots Tag

#### Rendering a robots meta tag for all crawlers (with Moustache)
```js
var mrRobot = require('mr.robot')

app.get('/example', function(req, res) {
    mrRobot(res)
        .noIndex()
        .noFollow()
    res.render('example', { robots: mrRobot(res).meta })
})
```
example.tmpl
```
{{#robots}}
    <meta name="{{name}}" content="{{content}}" />
{{/robots}}
```
Results in the following output
```
   <meta name="robots" content="noindex, nofollow" />
```

#### Rendering a robots meta tag for specific crawlers (with Moustache)
```js
app.get('/example', function(req, res) {
    mrRobot(res)
        .noIndex('googlebot')
        .noFollow('otherbot')
        .all('none')
    res.render('example', { robots: mrRobot(res).meta })
})
```
example.tmpl
```
{{#robots}}
    <meta name="{{name}}" content="{{content}}" />
{{/robots}}

```
Results in the following output
```
   <meta name="googlebot" content="noindex" />
   <meta name="otherbot" content="nofollow" />
   <meta name="robots" content="none" />
```


### Supported Directives

| Directive         | Alias                  |
|-------------------|------------------------|
| all               |                        |
| noindex           | noIndex                |
| nofollow          | noFollow               |
| none              |                        |
| noarchive         | noArchive              |
| nosnipper         | noSnipper              |
| noodp             | noOpenDirectoryProject |
| notranslate       | noTranslate            |
| noimageindex      | noImageIndex           |
| unavailable_after | unavailableAfter       |

All methods accept an optional user agent name (e.g. 'googlebot') as their first parameter.
unavailable_after/unavailableAfter requires an instance of Date, e.g.

```js
mrRobot(res).unavailableAfter(new Date())
// or
mrRobot(res).unavailableAfter('googlebot', new Date())
```

### Options
You can customise behaviour the first time you intialise mr.robot through the options parameter
```js
mrRobot(res, options)
```

#### logger
Allows you to specify your own logger (otherwise mr.robot will use console), e.g.
```js
var mrRobot = require('mr.robot')

app.get('/example', function(req, res) {
    mrRobot(res, { logger: myLogger }).noIndex('googlebot').noFollow('googlebot')
})
```

#### autoWrite
Controls whether mr.robot automatically writes headers before response.end(). If you disable this you must explicitly call write headers for them to be output, e.g.
```js
var mrRobot = require('mr.robot')

app.get('/example', function(req, res) {
    mrRobot(res, { autoWrite: false }).noIndex('googlebot').noFollow('googlebot').writeHeader()
})
```



