import { module, test } from "qunitx";
import FakeXMLHttpRequest from "fake-xml-http-request";

module("upload", function (hooks) {
  let xhr, upload;
  hooks.beforeEach(() => {
    xhr = new FakeXMLHttpRequest();
    upload = xhr.upload;
  });
  hooks.afterEach(() => {
    xhr = undefined;
  });

  test("the upload property of a fake xhr is defined", function (assert) {
    assert.ok(upload);
  });

  test("_progress triggers the onprogress event", function (assert) {
    let event;
    upload.onprogress = function (e) {
      event = e;
    };
    upload._progress(true, 10, 100);
    assert.ok(event, "A progress event was fired");
    assert.ok(event.lengthComputable, "ProgressEvent.lengthComputable");
    assert.equal(event.loaded, 10, "ProgressEvent.loaded");
    assert.equal(event.total, 100, "ProgressEvent.total");
  });
});
