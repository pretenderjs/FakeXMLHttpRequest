var xhr;
module("send", {
  setup: function(){
    xhr = new FakeXMLHttpRequest();
  },
  teardown: function(){
    xhr = undefined;
  }
});

test("sets Content-Type header for non-GET/HEAD requests if not set", function(){
  xhr.open("POST", "/");
  xhr.send("data");
  equal(xhr.requestHeaders["Content-Type"], "text/plain;charset=UTF-8",
        "sets content-type when not set");
});

test("does not change Content-Type if explicitly set for non-GET/HEAD", function(){
  xhr.open("POST", "/");
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.send("data");
  equal(xhr.requestHeaders["Content-Type"], "application/json",
        "does not change existing content-type header");
});

test("does not set Content-Type if data is FormData object", function(){
  xhr.open("POST", "/");
  xhr.send(new FormData());
  equal(xhr.requestHeaders["Content-Type"], null,
        "does not set content-type header for FormData POSTs");
});
