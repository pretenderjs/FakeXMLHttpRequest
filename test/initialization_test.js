var xhr;
QUnit.module( "FakeXMLHttpRequest construction", {
  beforeEach: function( assert ) {
    xhr = new FakeXMLHttpRequest();
  },
  afterEach: function( assert ) {
    xhr = undefined;
  }
} );

QUnit.test( "readyState is 0", function( assert ) {
  assert.equal( xhr.readyState, 0 );
} );

QUnit.test( "requestHeaders are {}", function( assert ) {
  assert.deepEqual( xhr.requestHeaders, {} );
} );

QUnit.test( "requestBody is null", function( assert ) {
  assert.equal( xhr.requestBody, null );
} );

QUnit.test( "status is 0", function( assert ) {
  assert.equal( xhr.status, 0 );
} );

QUnit.test( "statusText is empty", function( assert ) {
  assert.equal( xhr.status, "" );
} );

QUnit.test( "withCredentials is false", function( assert ) {
  assert.equal( xhr.withCredentials, false );
} );
