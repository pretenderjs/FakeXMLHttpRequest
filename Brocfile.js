var mergeTrees = require('broccoli-merge-trees');
var compileModules = require('broccoli-es6-module-transpiler');
var AMDFormatter = require('es6-module-transpiler-amd-formatter');

var sieve = require('broccoli-funnel');
var lib = 'lib';

var cjsExport = compileModules(lib, {
  formatter: 'commonjs',
  output: 'cjs'
});

var globalsExport = compileModules(lib, {
  formatter: 'bundle',
  output: 'globals/fake_xml_http_request.js'
});

var amdExport = compileModules(lib, {
  formatter: new AMDFormatter(),
  output: 'amd'
});

module.exports = mergeTrees([cjsExport, globalsExport, amdExport]);