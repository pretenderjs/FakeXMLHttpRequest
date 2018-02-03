import hello from 'FakeXMLHttpRequest';

QUnit.module('FakeXMLHttpRequest tests');

QUnit.test('hello', assert => {
  assert.equal(hello(), 'Hello from FakeXMLHttpRequest');
});
