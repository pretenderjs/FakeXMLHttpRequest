import { module, test } from "qunitx";
import FakeXMLHttpRequest from "fake-xml-http-request";

module(
  "setting unsafe header mirrors browser behavior and throws",
  function (hooks) {
    let xhr;
    hooks.beforeEach(() => {
      xhr = new FakeXMLHttpRequest();
      xhr.open("GET", "/");
    });
    hooks.afterEach(() => {
      xhr = undefined;
    });

    test("Accept-Charset", function (assert) {
      assert.throws(function () {
        xhr.setRequestHeader("Accept-Charset", "...");
      }, /Refused to set unsafe header.*Accept\-Charset/);
    });

    test("Accept-Encoding", function (assert) {
      assert.throws(function () {
        xhr.setRequestHeader("Accept-Encoding", "...");
      }, /Refused to set unsafe header.*Accept\-Encoding/);
    });

    test("Connection", function (assert) {
      assert.throws(function () {
        xhr.setRequestHeader("Connection", "...");
      }, /Refused to set unsafe header.*Connection/);
    });

    test("Content-Length", function (assert) {
      assert.throws(function () {
        xhr.setRequestHeader("Content\-Length", "...");
      }, /Refused to set unsafe header.*Content\-Length/);
    });

    test("Cookie", function (assert) {
      assert.throws(function () {
        xhr.setRequestHeader("Cookie", "...");
      }, /Refused to set unsafe header.*Cookie/);
    });

    test("Cookie2", function (assert) {
      assert.throws(function () {
        xhr.setRequestHeader("Cookie2", "...");
      }, /Refused to set unsafe header.*Cookie2/);
    });

    test("Content-Transfer-Encoding", function (assert) {
      assert.throws(function () {
        xhr.setRequestHeader("Content-Transfer-Encoding", "...");
      }, /Refused to set unsafe header.*Content\-Transfer\-Encoding/);
    });

    test("Date", function (assert) {
      assert.throws(function () {
        xhr.setRequestHeader("Date", "...");
      }, /Refused to set unsafe header.*Date/);
    });

    test("Expect", function (assert) {
      assert.throws(function () {
        xhr.setRequestHeader("Expect", "...");
      }, /Refused to set unsafe header.*Expect/);
    });

    test("Host", function (assert) {
      assert.throws(function () {
        xhr.setRequestHeader("Host", "...");
      }, /Refused to set unsafe header.*Host/);
    });

    test("Keep-Alive", function (assert) {
      assert.throws(function () {
        xhr.setRequestHeader("Keep-Alive", "...");
      }, /Refused to set unsafe header.*Keep-Alive/);
    });

    test("Referer", function (assert) {
      assert.throws(function () {
        xhr.setRequestHeader("Referer", "...");
      }, /Refused to set unsafe header.*Referer/);
    });

    test("TE", function (assert) {
      assert.throws(function () {
        xhr.setRequestHeader("TE", "...");
      }, /Refused to set unsafe header.*TE/);
    });

    test("Trailer", function (assert) {
      assert.throws(function () {
        xhr.setRequestHeader("Trailer", "...");
      }, /Refused to set unsafe header.*Trailer/);
    });

    test("Transfer-Encoding", function (assert) {
      assert.throws(function () {
        xhr.setRequestHeader("Transfer-Encoding", "...");
      }, /Refused to set unsafe header.*Transfer\-Encoding/);
    });

    test("Upgrade", function (assert) {
      assert.throws(function () {
        xhr.setRequestHeader("Upgrade", "...");
      }, /Refused to set unsafe header.*Upgrade/);
    });

    test("User-Agent", function (assert) {
      assert.throws(function () {
        xhr.setRequestHeader("User-Agent", "...");
      }, /Refused to set unsafe header.*User\-Agent/);
    });

    test("Via", function (assert) {
      assert.throws(function () {
        xhr.setRequestHeader("Via", "...");
      }, /Refused to set unsafe header.*Via/);
    });
  },
);
