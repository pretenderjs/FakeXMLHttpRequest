import { module, test } from "qunitx";
import FakeXMLHttpRequest from "fake-xml-http-request";

module("readyState handling", function (hooks) {
  let xhr;
  hooks.beforeEach(() => {
    xhr = new FakeXMLHttpRequest();
  });
  hooks.afterEach(() => {
    xhr = undefined;
  });

  test(
    "does not call onload and loadend if readyState not UNSENT or DONE",
    function (assert) {
      let wasCalled = 0;

      xhr.onload = function () {
        wasCalled += 1;
      };
      xhr.onloadend = function (ev) {
        wasCalled += 1;
      };

      [
        FakeXMLHttpRequest.OPENED,
        FakeXMLHttpRequest.HEADERS_RECEIVED,
        FakeXMLHttpRequest.LOADING,
      ].forEach(function (state) {
        xhr._readyStateChange(state);
      });

      assert.strictEqual(wasCalled, 0);
    },
  );
});
