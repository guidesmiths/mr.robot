# Mr. Robot

Handles all things todo with x-robots HTTP headers

## Usage

```
var mrRobot = require('mr.robot')
mrRobot.noindex()
mrRobot.nofollow()
app.get('/', mrRobot)
```

Results in
```
x-robots-tag: noindex, nofollow
```