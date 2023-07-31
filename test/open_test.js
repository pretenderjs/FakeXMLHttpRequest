import { module, test } from "qunitx";
import FakeXMLHttpRequest from "fake-xml-http-request";

module("open", function (hooks) {
  let xhr;
  hooks.beforeEach(() => {
    xhr = new FakeXMLHttpRequest();
  });
  hooks.afterEach(() => {
    xhr = undefined;
  });

  test("open sets the method property", function (assert) {
    xhr.open("get", "/some/url");
    assert.equal(xhr.method, "get");
  });

  test("open sets the url property", function (assert) {
    xhr.open("get", "/some/url");
    assert.equal(xhr.url, "/some/url");
  });

  test("open sets the async property", function (assert) {
    xhr.open("get", "/some/url", false);
    assert.equal(xhr.async, false);
  });

  test(
    "open sets the async property to true if a boolean isn't passed",
    function (assert) {
      xhr.open("get", "/some/url", "whatisthisidontevent");
      assert.equal(xhr.url, "/some/url", false);
    },
  );

  test("open sets the username property", function (assert) {
    xhr.open("get", "/some/url", true, "johndoe");
    assert.equal(xhr.username, "johndoe");
  });

  test("open sets the password property", function (assert) {
    xhr.open("get", "/some/url", true, "johndoe", "password");
    assert.equal(xhr.password, "password");
  });

  test("initializes the responseText as null", function (assert) {
    xhr.open("get", "/some/url");
    assert.equal(xhr.responseText, null);
  });

  test("initializes the response as null", function (assert) {
    xhr.open("get", "/some/url");
    assert.equal(xhr.response, null);
  });

  test("initializes the responseXML as null", function (assert) {
    xhr.open("get", "/some/url");
    assert.equal(xhr.responseXML, null);
  });

  test("initializes the responseURL as the opened url", function (assert) {
    xhr.open("get", "/some/url");
    assert.equal(xhr.responseURL, "/some/url");
  });

  test(
    "initializes the requestHeaders property as empty object",
    function (assert) {
      xhr.open("get", "/some/url");
      assert.deepEqual(xhr.requestHeaders, {});
    },
  );

  test("open sets the ready state to 1", function (assert) {
    xhr.open("get", "/some/url");
    assert.equal(xhr.readyState, 1);
  });

  test(
    "triggers the onreadystatechange event with OPENED readyState",
    function (assert) {
      let readyState = null;

      xhr.onreadystatechange = function () {
        readyState = this.readyState;
      };

      xhr.open("get", "/some/url");

      assert.equal(readyState, FakeXMLHttpRequest.OPENED);
    },
  );
});
