import FakeXMLHttpRequest from 'FakeXMLHttpRequest';

let xhr: FakeXMLHttpRequest;

QUnit.module('event listeners', function(hooks) {
  hooks.beforeEach(function() {
    xhr = new FakeXMLHttpRequest();
  });

  QUnit.test("adding a listener", function(assert) {
    var wasCalled = false;
    xhr.addEventListener('somethingHappened', function () {
      wasCalled = true;
    });

    xhr.dispatchEvent({ type: 'somethingHappened' });

    assert.ok(wasCalled, "the listener was called");
  });

  QUnit.test("removing a listener", function(assert) {
    var wasCalled = false;
    xhr.addEventListener('somethingHappened', function () {
      wasCalled = true;
    });

    xhr.dispatchEvent({ type: 'somethingHappened' });

    assert.ok(wasCalled, "the listener was called");
  });
});
