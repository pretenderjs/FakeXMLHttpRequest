import FakeXMLHttpRequest from 'FakeXMLHttpRequest';

let xhr: FakeXMLHttpRequest;

QUnit.module('aborting', function(hooks) {
  hooks.beforeEach(function() {
    xhr = new FakeXMLHttpRequest();
  });

  QUnit.test("sets aborted to true", function(assert) {
    xhr.abort();
    assert.equal(xhr.aborted, true);
  });

  QUnit.test("sets responseText to null", function(assert) {
    xhr.abort();
    assert.equal(xhr.responseText, null);
  });

  QUnit.test("sets errorFlag to true", function(assert) {
    xhr.abort();
    assert.equal(xhr.errorFlag, true);
  });

  QUnit.test("sets requestHeaders to {}", function(assert) {
    xhr.abort();
    assert.deepEqual(xhr.requestHeaders, {});
  });

  QUnit.test("sets readyState to 0", function(assert) {
    xhr.abort();
    assert.equal(xhr.readyState, 0);
  });

  QUnit.test("calls the abort event", function(assert) {
    var wasCalled = false;
    xhr.addEventListener('abort', function() {
      wasCalled = true;
    });

    xhr.abort();

    assert.ok(wasCalled);
  });

  QUnit.test("calls the onerror event", function(assert) {
    var wasCalled = false;
    xhr.onerror = function () {
      wasCalled = true;
    };

    xhr.abort();

    assert.ok(wasCalled);
  });
});
