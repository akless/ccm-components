/**
 * @overview tests for ccm component for rendering a quiz
 * @author André Kless <andre.kless@web.de> 2017
 * @license The MIT License (MIT)
 */

ccm.files[ 'ccm.quiz.tests.js' ] = {
  setup: function ( suite, callback ) {
    suite.container = document.createElement( 'div' );
    document.body.appendChild( suite.container );
    suite.ccm.component( './../../ccm-components/quiz/ccm.quiz.js', { element: suite.container }, function ( component ) {
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
  templates: {
    setup: function ( suite, callback ) {
      suite.component.start( { questions: [ {}, {} ] }, function ( instance ) {
        suite.instance = instance;
        callback();
      } );
    },
    tests: {
      main: function ( suite ) {
        if ( !suite.instance.element.querySelector( '#questions' ) ) return suite.failed( 'missing "questions" container' );
        if ( !suite.instance.element.querySelector( '#prev' ) ) return suite.failed( 'missing "prev" container' );
        if ( !suite.instance.element.querySelector( '#next' ) ) return suite.failed( 'missing "next" container' );
        if ( !suite.instance.element.querySelector( '#finish' ) ) return suite.failed( 'missing "finish" container' );
        suite.passed();
      }
    }
  },
  dependencies: {
    tests: {
      loggedInUser: function ( suite ) {
        suite.component.start( {
          user: [ 'ccm.instance', './../../ccm-components/user/ccm.user.js' ],
          onfinish: function ( instance ) {
            suite.assertTrue( instance.user.isLoggedIn() );
          }
        }, function ( instance ) {
          if ( instance.user.isLoggedIn() ) suite.failed( 'user is already logged in' );
          instance.element.querySelector( 'button' ).click();
        } );
      },
      logStartEvent: function ( suite ) {
        suite.component.start( {
          logger: [ 'ccm.instance', './../../ccm-components/log/ccm.log.js', { onfinish: function ( instance, results ) {
            suite.assertSame( 'start', results.event );
          } } ]
        } );
      },
      logFinishEvent: function ( suite ) {
        suite.component.start( {
          logger: [ 'ccm.instance', './../../ccm-components/log/ccm.log.js', {
            events: { finish: true },
            onfinish: function ( instance, results ) {
              suite.assertSame( 'finish', results.event );
            }
          } ]
        }, function ( instance ) {
          instance.element.querySelector( 'button' ).click();
        } );
      }
    }
  },
  finally: function ( suite, callback ) {
    document.body.removeChild( suite.container );
    callback();
  }
};

ccm.components.testsuite.quiz = ccm.files[ 'ccm.quiz.tests.js' ];