import { module, test } from "qunitx";
import FakeXMLHttpRequest from "fake-xml-http-request";

module("aborting", function (hooks) {
  let xhr;
  hooks.beforeEach(() => {
    xhr = new FakeXMLHttpRequest();
  });
  hooks.afterEach(() => {
    xhr = undefined;
  });

  test("sets aborted to true", function (assert) {
    xhr.abort();
    assert.equal(xhr.aborted, true);
  });

  test("sets responseText to null", function (assert) {
    xhr.abort();
    assert.equal(xhr.responseText, null);
  });

  test("sets response to null", function (assert) {
    xhr.abort();
    assert.equal(xhr.response, null);
  });

  test("sets errorFlag to true", function (assert) {
    xhr.abort();
    assert.equal(xhr.errorFlag, true);
  });

  test("sets requestHeaders to {}", function (assert) {
    xhr.abort();
    assert.deepEqual(xhr.requestHeaders, {});
  });

  test("sets readyState to 0", function (assert) {
    xhr.abort();
    assert.equal(xhr.readyState, 0);
  });

  test("calls the abort event", function (assert) {
    let wasCalled = false;
    xhr.addEventListener("abort", function () {
      wasCalled = true;
    });

    xhr.abort();

    assert.ok(wasCalled);
  });

  test("calls the onerror event", function (assert) {
    let wasCalled = false;
    xhr.onerror = function () {
      wasCalled = true;
    };

    xhr.abort();

    assert.ok(wasCalled);
  });

  test("does not call the onload event", function (assert) {
    let wasCalled = false;
    xhr.onload = function () {
      wasCalled = true;
    };

    xhr.open("POST", "/");
    xhr.send("data");

    xhr.abort();

    assert.notOk(wasCalled);
  });

  test("calls the loadend event", function (assert) {
    let wasCalled = false;
    xhr.onloadend = function () {
      wasCalled = true;
    };

    xhr.open("POST", "/");
    xhr.send("data");

    xhr.abort();

    assert.ok(wasCalled);
  });
});
