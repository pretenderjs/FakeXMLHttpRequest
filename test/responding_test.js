var xhr, xmlDocumentConstructor;
module("responding", {
  setup: function(){
    xhr = new FakeXMLHttpRequest();
    xmlDocumentConstructor = makeXMLDocument().constructor;
  },
  teardown: function(){
    xhr = undefined;
    xmlDocumentConstructor = undefined;
  }
});

// Different browsers report different constructors for XML Documents.
// Chrome 45.0.2454 and Firefox 40.0.0 report `XMLDocument`,
// PhantomJS 1.9.8 reports `Document`.
// Make a dummy xml document to determine what constructor to
// compare against in the tests below.
// This function is taken from `parseXML` in the src/
function makeXMLDocument() {
  var xmlDoc, text = "<some>xml</some>";

  if (typeof DOMParser != "undefined") {
    var parser = new DOMParser();
    xmlDoc = parser.parseFromString(text, "text/xml");
  } else {
    xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
    xmlDoc.async = "false";
    xmlDoc.loadXML(text);
  }

  return xmlDoc;
}

test("defaults responseHeaders to {} if not passed", function(){
  xhr.respond(200);
  deepEqual(xhr.responseHeaders, {});
});

test("sets responseHeaders", function(){
  xhr.respond(200, {"Content-Type":"application/json"});
  deepEqual(xhr.responseHeaders, {"Content-Type":"application/json"});
});

test("sets body", function(){
  xhr.respond(200, {"Content-Type":"application/json"}, JSON.stringify({a: 'key'}));
  equal(xhr.responseText, '{"a":"key"}');
  equal(xhr.response, '{"a":"key"}');
});

test("parses the body if it's XML and no content-type is set", function(){
  xhr.respond(200, {}, "<key>value</key>");
  equal(xhr.responseXML.constructor, xmlDocumentConstructor);
});

test("parses the body if it's XML and xml content type is set", function(){
  xhr.respond(200, {'Content-Type':'application/xml'}, "<key>value</key>");
  equal(xhr.responseXML.constructor, xmlDocumentConstructor);
});

test("does not parse the body if it's XML and another content type is set", function(){
  xhr.respond(200, {'Content-Type':'application/json'}, "<key>value</key>");
  equal(xhr.responseXML, undefined);
});

test("calls the onload callback once", function(){
  var wasCalled = 0;

  xhr.onload = function(ev){
    wasCalled += 1;
  };

  xhr.respond(200, {}, "");

  strictEqual(wasCalled, 1);
});

test("calls the onloadend callback once", function(){
  var wasCalled = 0;

  xhr.onloadend = function(ev){
    wasCalled += 1;
  };

  xhr.respond(200, {}, "");

  strictEqual(wasCalled, 1);
});

test("passes event target as context to onload", function() {
  var context;
  var event;

  xhr.onload = function(ev){
    event = ev;
    context = this;
  };

  xhr.respond(200, {}, "");

  deepEqual(context, event.target);
});

test("calls onreadystatechange for each state change", function() {
  var states = [];

  xhr.onreadystatechange = function() {
    states.push(this.readyState);
  };

  xhr.open('get', '/some/url');

  xhr.respond(200, {}, "");

  var expectedStates = [
    FakeXMLHttpRequest.OPENED,
    FakeXMLHttpRequest.HEADERS_RECEIVED,
    FakeXMLHttpRequest.LOADING,
    FakeXMLHttpRequest.DONE
  ];
  deepEqual(states, expectedStates);
});

test("passes event to onreadystatechange", function() {
  var event = null;
  xhr.onreadystatechange = function(e) {
    event = e;
  };
  xhr.open('get', '/some/url');
  xhr.respond(200, {}, "");

  ok(event && event.type === 'readystatechange',
     'passes event with type "readystatechange"');
});

test("overrideMimeType overrides content-type responseHeader", function(){
  xhr.overrideMimeType('text/plain');
  xhr.respond(200, {"Content-Type":"application/json"});
  deepEqual(xhr.responseHeaders, {"Content-Type":"text/plain"});
});

test("parses the body if it's XML and overrideMimeType is set to xml", function(){
  xhr.overrideMimeType('application/xml');
  xhr.respond(200, {'Content-Type':'text/plain'}, "<key>value</key>");
  equal(xhr.responseXML.constructor, xmlDocumentConstructor);
});

test("does not parse the body if it's XML and overrideMimeType is set to another content type", function(){
  xhr.overrideMimeType('text/plain');
  xhr.respond(200, {'Content-Type':'application/xml'}, "<key>value</key>");
  equal(xhr.responseXML, undefined);
});
