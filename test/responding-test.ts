import FakeXMLHttpRequest from 'FakeXMLHttpRequest';

let xhr: FakeXMLHttpRequest;
let xmlDocumentConstructor: any;

// Different browsers report different constructors for XML Documents.
// Chrome 45.0.2454 and Firefox 40.0.0 report `XMLDocument`,
// PhantomJS 1.9.8 reports `Document`.
// Make a dummy xml document to determine what constructor to
// compare against in the tests below.
// This function is taken from `parseXML` in the src/
function makeXMLDocument() {
  let xmlDoc, text = "<some>xml</some>";

  if (typeof DOMParser != "undefined") {
    let parser = new DOMParser();
    xmlDoc = parser.parseFromString(text, "text/xml");
  } else {
    xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
    xmlDoc.async = "false";
    xmlDoc.loadXML(text);
  }

  return xmlDoc;
}

QUnit.module('responding', function(hooks) {
  hooks.beforeEach(function() {
    xhr = new FakeXMLHttpRequest();
    xmlDocumentConstructor = makeXMLDocument().constructor;
  });

  QUnit.test("defaults responseHeaders to {} if not passed", function(assert) {
    xhr.respond(200);
    assert.deepEqual(xhr.responseHeaders, {});
  });

  QUnit.test("sets responseHeaders", function(assert) {
    xhr.respond(200, { "Content-Type": "application/json" });
    assert.deepEqual(xhr.responseHeaders, { "Content-Type": "application/json" });
  });

  QUnit.test("sets body", function(assert) {
    xhr.respond(200, { "Content-Type": "application/json" }, JSON.stringify({ a: 'key' }));
    assert.equal(xhr.responseText, '{"a":"key"}');
  });

  QUnit.test("parses the body if it's XML and no content-type is set", function(assert) {
    xhr.respond(200, {}, "<key>value</key>");
    assert.equal((<any>xhr.responseXML).constructor, xmlDocumentConstructor);
  });

  QUnit.test("parses the body if it's XML and xml content type is set", function(assert) {
    xhr.respond(200, { 'Content-Type': 'application/xml' }, "<key>value</key>");
    assert.equal((<any>xhr.responseXML).constructor, xmlDocumentConstructor);
  });

  QUnit.test("does not parse the body if it's XML and another content type is set", function(assert) {
    xhr.respond(200, { 'Content-Type': 'application/json' }, "<key>value</key>");
    assert.equal(xhr.responseXML, undefined);
  });

  QUnit.test("calls the onload callback once", function(assert) {
    let wasCalled = 0;

    xhr.onload = function() {
      wasCalled += 1;
    };

    xhr.respond(200, {}, "");

    assert.strictEqual(wasCalled, 1);
  });

  QUnit.test("passes event target as context to onload", function(assert) {
    assert.expect(1);
    let done = assert.async();

    xhr.onload = function(ev) {
      assert.deepEqual(this, ev.target);
      done();
    };

    xhr.respond(200, {}, "");
  });

  QUnit.test("calls onreadystatechange for each state change", function(assert) {
    let states: number[] = [];

    xhr.onreadystatechange = function() {
      states.push(this.readyState);
    };

    xhr.open('get', '/some/url');

    xhr.respond(200, {}, "");

    let expectedStates = [
      FakeXMLHttpRequest.OPENED,
      FakeXMLHttpRequest.HEADERS_RECEIVED,
      FakeXMLHttpRequest.LOADING,
      FakeXMLHttpRequest.DONE
    ];
    assert.deepEqual(states, expectedStates);
  });

  QUnit.test("passes event to onreadystatechange", function(assert) {
    assert.expect(1);
    let done = assert.async();
    let called = false;
    xhr.onreadystatechange = function(e) {
      if (!called) {
        assert.ok(e && e.type === 'readystatechange', 'passes event with type "readystatechange"');
        called = true;
        done();
      }
    };
    xhr.open('get', '/some/url');
    xhr.respond(200, {}, "");
  });

  QUnit.test("overrideMimeType overrides content-type responseHeader", function(assert) {
    xhr.overrideMimeType('text/plain');
    xhr.respond(200, { "Content-Type": "application/json" });
    assert.deepEqual(xhr.responseHeaders, { "Content-Type": "text/plain" });
  });

  QUnit.test("parses the body if it's XML and overrideMimeType is set to xml", function(assert) {
    xhr.overrideMimeType('application/xml');
    xhr.respond(200, { 'Content-Type': 'text/plain' }, "<key>value</key>");
    assert.equal((<XMLDocument>xhr.responseXML).constructor, xmlDocumentConstructor);
  });

  QUnit.test("does not parse the body if it's XML and overrideMimeType is set to another content type", function(assert) {
    xhr.overrideMimeType('text/plain');
    xhr.respond(200, { 'Content-Type': 'application/xml' }, "<key>value</key>");
    assert.equal(xhr.responseXML, undefined);
  });
});
