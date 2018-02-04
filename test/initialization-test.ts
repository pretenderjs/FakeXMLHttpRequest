import FakeXMLHttpRequest from 'FakeXMLHttpRequest';

let xhr: FakeXMLHttpRequest;

QUnit.module('FakeXMLHttpRequest constructor', function(hooks) {
  hooks.beforeEach(function() {
    xhr = new FakeXMLHttpRequest();
  });

  QUnit.test("readyState is 0", function(assert) {
    assert.equal(xhr.readyState, 0);
  });

  QUnit.test("requestHeaders are {}", function(assert) {
    assert.deepEqual(xhr.requestHeaders, {});
  });

  QUnit.test("requestBody is null", function(assert) {
    assert.equal(xhr.requestBody, null);
  });

  QUnit.test("status is 0", function(assert) {
    assert.equal(xhr.status, 0);
  });

  QUnit.test("statusText is empty", function(assert) {
    assert.equal(xhr.status, '');
  });

  QUnit.test("withCredentials is false", function(assert) {
    assert.equal(xhr.withCredentials, false);
  });
});
