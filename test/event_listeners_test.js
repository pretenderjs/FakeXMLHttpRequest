import { module, test } from "qunitx";
import FakeXMLHttpRequest from "fake-xml-http-request";

module("event listeners", function (hooks) {
  let xhr;
  hooks.beforeEach(() => {
    xhr = new FakeXMLHttpRequest();
  });
  hooks.afterEach(() => {
    xhr = undefined;
  });

  test("adding a listener", function (assert) {
    let wasCalled = false;
    xhr.addEventListener("somethingHappened", function () {
      wasCalled = true;
    });

    xhr.dispatchEvent({ type: "somethingHappened" });

    assert.ok(wasCalled, "the listener was called");
  });

  test("removing a listener", function (assert) {
    let wasCalled = false;
    let listener = xhr.addEventListener("somethingHappened", function () {
      wasCalled = true;
    });

    xhr.dispatchEvent({ type: "somethingHappened" });

    assert.ok(wasCalled, "the listener was called");
  });
});
