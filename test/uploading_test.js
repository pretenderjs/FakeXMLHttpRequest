var upload;
module("open", {
  setup: function(){
    upload = new FakeXMLHttpRequest().upload;
  },
  teardown: function(){
    upload = undefined;
  }
});

test("the upload property of a fake xhr is defined", function() {
  ok(upload);
})

test("triggers the onprogress event", function() {
  var event;
  upload.onprogress = function(e) {
    event = e;
  };
  upload._progress(true, 10, 100);
  ok(event, "no event was fired on upload progress");
  ok(event.lengthComputable, "ProgressEvent.lengthComputable");
  equal(event.loaded, 10, "ProgressEvent.loaded");
  equal(event.total, 100, "ProgressEvent.total");
});
