import { module, test } from "qunitx";
import FakeXMLHttpRequest from "fake-xml-http-request";

module("FakeXMLHttpRequest construction", function (hooks) {
  let xhr;
  hooks.beforeEach(() => {
    xhr = new FakeXMLHttpRequest();
  });
  hooks.afterEach(() => {
    xhr = undefined;
  });

  test("readyState is 0", function (assert) {
    assert.equal(xhr.readyState, 0);
  });

  test("requestHeaders are {}", function (assert) {
    assert.deepEqual(xhr.requestHeaders, {});
  });

  test("requestBody is null", function (assert) {
    assert.equal(xhr.requestBody, null);
  });

  test("status is 0", function (assert) {
    assert.equal(xhr.status, 0);
  });

  test("statusText is empty", function (assert) {
    assert.equal(xhr.statusText, "");
  });

  test("withCredentials is false", function (assert) {
    assert.equal(xhr.withCredentials, false);
  });

  test("onabort is null", function (assert) {
    assert.equal(xhr.onabort, null);
  });

  test("onerror is null", function (assert) {
    assert.equal(xhr.onerror, null);
  });

  test("onload is null", function (assert) {
    assert.equal(xhr.onload, null);
  });

  test("onloadend is null", function (assert) {
    assert.equal(xhr.onloadend, null);
  });

  test("onloadstart is null", function (assert) {
    assert.equal(xhr.onloadstart, null);
  });

  test("onprogress is null", function (assert) {
    assert.equal(xhr.onprogress, null);
  });

  test("onreadystatechange is null", function (assert) {
    assert.equal(xhr.onreadystatechange, null);
  });

  test("ontimeout is null", function (assert) {
    assert.equal(xhr.ontimeout, null);
  });
});
