var upload;
var xhr;

module("upload", {
  setup: function(){
    xhr = new FakeXMLHttpRequest();
    upload = xhr.upload;
  }
});

test("the upload property of a fake xhr is defined", function() {
  ok(upload);
});

test("_progress triggers the onprogress event", function() {
  var event;
  upload.onprogress = function(e) {
    event = e;
  };
  upload._progress(true, 10, 100);
  ok(event, "A progress event was fired");
  ok(event.lengthComputable, "ProgressEvent.lengthComputable");
  equal(event.loaded, 10, "ProgressEvent.loaded");
  equal(event.total, 100, "ProgressEvent.total");
});