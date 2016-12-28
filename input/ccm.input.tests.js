/**
 * @overview tests for <i>ccm</i> component for user inputs
 * @author André Kless <andre.kless@web.de> 2016
 * @license The MIT License (MIT)
 */

if ( !ccm.components.testsuite ) ccm.components.testsuite = {};
ccm.components.testsuite.input = {
  setup: function ( suite, callback ) {
    // ...
    callback();
  },
  tests: {
    'first': function ( suite ) {
      // ...
      suite.failed();
    }
  }
};