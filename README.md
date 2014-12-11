# FakeXMLHttpRequest [![Build Status](https://travis-ci.org/trek/FakeXMLHttpRequest.png?branch=master)](https://travis-ci.org/trek/FakeXMLHttpRequest)

This library provide a fake XMLHttpRequest object for testing browser-based
libraries. It is partially extracted (and in many places simplified) from
[Sinon.JS](http://sinonjs.org/) and attempts to match the behavior of
[XMLHttpRequest specification](http://www.w3.org/TR/XMLHttpRequest/).

## Why not just use Sinon.JS?
Sinon includes much more than _just_ a fake XHR object which is useful in
situations where you may not need mocks, spies, stubs, or fake servers.

## How to use it
In addition to matching the native XMLHttpRequest's API, FakeXMLHttpRequest
adds a `respond` function that takes three arguments: a HTTP response status
number, a headers object, and a text response body:

```javascript
// simulate successful response
xhr = new FakeXMLHttpRequest();
xhr.respond(200, {"Content-Type": "application/json"}, '{"key":"value"}');
xhr.status; // 200
xhr.statusText; // "OK"
xhr.responseText; // '{"key":"value"}'

// simulate failed response
xhr = new FakeXMLHttpRequest();
xhr.abort();
```

There is no mechanism for swapping the native XMLHttpRequest or for
recording, finding, or playing back requests. Libraries using FakeXMLHttpRequest
should provide this behavior.

## Testing
Tests are written in [QUnit](http://qunitjs.com/) and run through the
[Karma test runner](http://karma-runner.github.io/0.10/index.html).

Run with:

```shell
karma start
```
