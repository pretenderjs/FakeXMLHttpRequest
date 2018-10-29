var xhr, xmlDocumentConstructor;
module("readyState handling", {
  setup: function(){
    xhr = new FakeXMLHttpRequest();
  },
  teardown: function(){
    xhr = undefined;
  }
});

test("does not call onload and loadend if readyState not UNSENT or DONE", function(){
  var wasCalled = 0;

  xhr.onload = function() {
    wasCalled += 1;
  }
  xhr.onloadend = function(ev){
    wasCalled += 1;
  };

  [
    FakeXMLHttpRequest.OPENED,
    FakeXMLHttpRequest.HEADERS_RECEIVED,
    FakeXMLHttpRequest.LOADING
  ].forEach(function(state) {
    xhr._readyStateChange(state);
  });

  strictEqual(wasCalled, 0);
});