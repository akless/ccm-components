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
    tests: {
      componentName: function ( suite ) {
        suite.eval.instance( function ( instance ) {
          suite.assertSame( 'eval', instance.component.name );
        } );
      },
      publicProperties: function ( suite ) {
        suite.eval.instance( function ( instance ) {
          suite.assertEquals( [ 'start', 'ccm', 'id', 'index', 'component' ], Object.keys( instance ) );
        } );
      }
    }
  }
};

ccm.components.testsuite.eval = ccm.files[ 'ccm.eval.tests.js' ];