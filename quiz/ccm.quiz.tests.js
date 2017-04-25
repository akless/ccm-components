/**
 * @overview tests for ccm component for rendering a quiz
 * @author André Kless <andre.kless@web.de> 2017
 * @license The MIT License (MIT)
 */

ccm.files[ 'ccm.quiz.tests.js' ] = {
  setup: function ( suite, callback ) {
    suite.container = document.createElement( 'div' );
    document.body.appendChild( suite.container );
    suite.ccm.component( '../../ccm-components/quiz/ccm.quiz.js', { element: suite.container }, function ( component ) {
      suite.component = component;
      callback();
    } );
  },
  fundamental: {
    setup: function ( suite, callback ) {
      suite.component.instance( function ( instance ) {
        suite.instance = instance;
        callback();
      } );
    },
    tests: {
      componentName: function ( suite ) {
        suite.assertSame( 'quiz', suite.instance.component.name );
      },
      frameworkVersion: function ( suite ) {
        suite.assertEquals( '8.0.0', suite.instance.ccm.version() );
      },
      publicInstanceProperties: function ( suite ) {
        suite.assertEquals( [ 'start', 'ccm', 'element', 'id', 'index', 'component' ], Object.keys( suite.instance ) );
      },
      startCallback: function ( suite ) {
        suite.instance.start( suite.passed );
      }
    }
  },
  finally: function ( suite, callback ) {
    document.body.removeChild( suite.container );
    callback();
  }
};

ccm.components.testsuite.quiz = ccm.files[ 'ccm.quiz.tests.js' ];