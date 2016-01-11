# Mr. Robot

Mr. Robot helps you set robots meta tags and X-Robots-Tag headers as per [Robots meta tag and X-Robots-Tag HTTP header specifications](https://developers.google.com/webmasters/control-crawl-index/docs/robots_meta_tag?hl=en).

## X-Robots-Tag HTTP Response Header

#### Set an X-Robots-Tag response header for all crawlers
```
var mrRobot = require('mr.robot')

app.get('/example', function(req, res) {
    mrRobot(res).noIndex().noFollow().writeHeader()
})
```
Results in the following response header
```
x-robots-tag: noindex, nofollow
```

#### Set an X-Robots-Tag response header for a specific crawler
```
var mrRobot = require('mr.robot')

app.get('/example', function(req, res) {
    mrRobot(res).noIndex('googlebot').noFollow('googlebot').writeHeader()
})
```
Results in the following response header
```
x-robots-tag: googlebot: noindex, nofollow
```

Due to https://github.com/nodejs/node/issues/3591 it is not currently possible to set directives for multiple user agents using the X-Robots-Tag response header. For the moment you can only do this with meta robots tags.


## Meta Robots Tag

#### Rendering a robots meta tag for all crawlers (with Moustache)

```
var mrRobot = require('mr.robot')

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
Results in the following output
```
   <meta name="robots" content="noindex, nofollow" />
```

#### Rendering a robots meta tag for a all crawlers (with Moustache)

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
Results in the following output
```
   <meta name="robots" content="noindex, nofollow" />
```

#### Rendering a robots meta tag for a specific crawler (with Moustache)

```
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

```
mrRobot(res).unavailableAfter(new Date()).writeHeader()
// or
mrRobot(res).unavailableAfter('googlebot', new Date()).writeHeader()

```

## Humans.txt

Mr.Robot includes middleware for generating a [humans.txt](http://humanstxt.org) file

```
var humans = require('mr.robot/middleware/humans')
app.get('/humans.txt', humans)
```
Will output a humans.txt file generated from the contributors in your ```package.json```


