/**
 * @overview tests for for ccm component for interpreting JavaScript expressions
 * @author André Kless <andre.kless@web.de> 2017
 * @license The MIT License (MIT)
 */

ccm.files[ 'ccm.eval.tests.js' ] = {
  setup: function ( suite, callback ) {
    suite.ccm.component( '../../ccm-components/eval/ccm.eval.js', function ( component ) {
      suite.eval = component;
      callback();
    } );
  },
  fundamental: {
    setup: function ( suite, callback ) {
      suite.eval.instance( function ( instance ) {
        suite.eval = instance;
        callback();
      } );
    },
    tests: {
      componentName: function ( suite ) {
        suite.assertSame( 'eval', suite.eval.component.name );
      },
      publicInstanceProperties: function ( suite ) {
        suite.assertEquals( [ 'start', 'ccm', 'id', 'index', 'component' ], Object.keys( suite.eval ) );
      },
      frameworkVersion: function ( suite ) {
        suite.assertEquals( '8.0.0', suite.eval.ccm.version() );
      }
    }
  }
};

ccm.components.testsuite.eval = ccm.files[ 'ccm.eval.tests.js' ];