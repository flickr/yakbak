# yakbak

Record HTTP interactions The Node Way™. Inspired by ruby's [vcr][1].

> [![Build Status](https://travis-ci.org/flickr/yakbak.svg?branch=master)](https://travis-ci.org/flickr/yakbak)

## install

``` bash
$ npm install yakbak --save-dev
```
## usage

The main idea behind testing HTTP clients with yakbak is:

1. Make your client's target host configurable.
2. Set up a yakbak server locally to proxy the target host.
3. Point your client at the yakbak server.

Then develop or run your tests. If a recorded HTTP request is found on disk, it will be played back instead of hitting the target host. If no recorded request is found, the request will be forwarded to the target host and recorded to disk.

### yakbak(host, options)

Returns a function of the signature `function (req, res)` that you can give to an `http.Server` as its handler.

``` js
var handler = yakbak('http://api.flickr.com', {
	dirname: __dirname + '/tapes'
});
```

#### options

- `dirname` the path where recorded responses will be written (required).
- `noRecord` if true, requests will return a 404 error if the tape doesn't exist
- `hash(req, body)` provide your own IncomingMessage hash function

### with node's http module

yakbak provides a handler with the same signature that `http.Server` expects so you can create your own proxy:

``` js
var http = require('http');
var yakbak = require('yakbak');

http.createServer(yakbak('http://api.flickr.com', {
	dirname: __dirname + '/tapes'
})).listen(3000);
```

Now any requests to `http://localhost:3000` will be proxied to `http://api.flickr.com` and recorded to `/tapes` for future playback.

### with express

Need more flexibility? [express](https://github.com/expressjs/express) expects the same function signature, so you can use yakbak just like you would any other middleware:

``` js
var express = require('express');
var yakbak = require('yakbak');

var flickr = yakbak('http://api.flickr.com', {
	dirname: __dirname + '/tapes'
});

var upload = yakbak('http://up.flickr.com', {
	dirname: __dirname + '/tapes'
});

express().use(function (req, res, next) {
	if (req.path.indexOf('/services/upload') === 0) {
	  upload(req, res);
	} else {
	  flickr(req, res);
	}
}).listen(3000);
```

### as a standalone response server

Each recorded response is itself a node module with the same handler signature, so if you want to create a server that replays a single response, you can do so easily:

``` js
var http = require('http');
var tape = require('./tapes/1117f3d81490d441d826dd2fb26470f9.js');

http.createServer(tape).listen(3000);
```

### on the command line

yakbak also ships with a `yakbak` utility that will start an HTTP server to play back a given tape.

``` bash
$ yakbak
Error: file is required
Usage: yakbak <file>
$ yakbak ./tapes/1117f3d81490d441d826dd2fb26470f9.js
Server listening on port 3000
* Connection from 127.0.0.1 port 63669
< GET / HTTP/1.1
< host: localhost:3000
< user-agent: curl/7.43.0
< accept: */*
<
> HTTP/1.1 201 Created
> content-type: text/html
> date: Sat, 26 Oct 1985 08:20:00 GMT
> connection: close
> transfer-encoding: chunked
>
* Connection closed
```

## why not [insert other project here]?

Check out [this blog post][2] about why we chose a reverse proxy over other existing approaches to recording HTTP interactions.

## license

This software is free to use under the MIT license. See the [LICENSE][] file for license text and copyright information.

[1]: https://github.com/vcr/vcr
[2]: http://code.flickr.net/2016/04/25/introducing-yakbak-record-and-playback-http-interactions-in-nodejs/
[LICENSE]: https://github.com/flickr/yakbak/blob/master/LICENSE
