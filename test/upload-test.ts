import FakeXMLHttpRequest, { FakeEvent } from 'FakeXMLHttpRequest';

let xhr: FakeXMLHttpRequest;
let upload: any;

QUnit.module("setting unsafe header mirrors browser behavior and throws", function(hooks) {
  hooks.beforeEach(function() {
    xhr = new FakeXMLHttpRequest();
    upload = xhr.upload;
  });

  QUnit.test("the upload property of a fake xhr is defined", function(assert) {
    assert.ok(upload);
  });

  QUnit.test("_progress triggers the onprogress event", function(assert) {
    let done = assert.async();
    upload.onprogress = function(e: FakeEvent) {
      assert.ok(e, "A progress event was fired");
      assert.ok(e.lengthComputable, "ProgressEvent.lengthComputable");
      assert.equal(e.loaded, 10, "ProgressEvent.loaded");
      assert.equal(e.total, 100, "ProgressEvent.total");
      done();
    };
    upload._progress(true, 10, 100);
  });
});
