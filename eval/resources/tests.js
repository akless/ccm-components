/**
 * @overview unit tests of ccm component for evaluating a given JavaScript expression
 * @author André Kless <andre.kless@web.de> 2017
 * @license The MIT License (MIT)
 */

ccm.files[ 'tests.js' ] = {
  setup: function ( suite, callback ) {
    suite.ccm.component( '../eval/ccm.eval.js', function ( component ) {
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
        suite.assertSame( 'eval', suite.instance.component.name );
      },
      publicInstanceProperties: function ( suite ) {
        suite.assertEquals( [ 'start', 'ccm', 'id', 'index', 'component', 'root', 'element', 'dependency' ], Object.keys( suite.instance ) );
      },
      startCallback: function ( suite ) {
        suite.instance.start( suite.passed );
      }
    }
  },
  defaults: {
    setup: function ( suite, callback ) {
      suite.component.start( function ( instance ) {
        suite.instance = instance;
        callback();
      } );
    },
    tests: {
      mainTemplate: function ( suite ) {
        if ( !suite.instance.element.querySelector( '#expression' ) ) return suite.failed( 'missing expression container' );
        suite.passed();
      },
      buttonCaption: function ( suite ) {
        suite.assertEquals( 'Evaluate JavaScript expression', suite.instance.element.querySelector( 'button' ).innerHTML );
      },
      onFinish: function ( suite ) {
        suite.instance.onfinish = function ( instance, results ) {
          if ( instance !== suite.instance ) return suite.failed( 'incorrect first parameter' );
          if ( results.expression !== '"Hello, World!"' ) return suite.failed( 'wrong expression in result data' );
          if ( results.value !== 'Hello, World!' ) return suite.failed( 'wrong value in result data' );
          suite.passed();
        };
        suite.instance.element.querySelector( 'button' ).click();
      }
    }
  },
  dependencies: {
    tests: {
      loggedInUser: function ( suite ) {
        suite.component.start( {
          user: [ 'ccm.instance', '../user/ccm.user.js' ],
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
          logger: [ 'ccm.instance', '../log/ccm.log.js', { onfinish: function ( instance, results ) {
            suite.assertSame( 'start', results.event );
          } } ]
        } );
      },
      logFinishEvent: function ( suite ) {
        suite.component.start( {
          logger: [ 'ccm.instance', '../log/ccm.log.js', {
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
  json_parse: {
    tests: {
      valid: function ( suite ) {
        suite.component.start( {
          expression: '{ "foo": "bar" }',
          json_parse: true,
          onfinish: function ( instance, results ) {
            suite.assertEquals( { foo: 'bar' }, results.value );
          }
        }, function ( instance ) {
          instance.element.querySelector( 'button' ).click();
        } );
      },
      invalid: function ( suite ) {
        suite.component.start( {
          expression: "{ foo: 'bar' }",
          json_parse: true,
          onfinish: function ( instance, results ) {
            suite.assertEquals( undefined, results.value );
          }
        }, function ( instance ) {
          instance.element.querySelector( 'button' ).click();
        } );
      },
      functionsNotParsable: function ( suite ) {
        suite.component.start( {
          expression: 'function () {}',
          json_parse: true,
          onfinish: function ( instance, results ) {
            suite.assertEquals( undefined, results.value );
          }
        }, function ( instance ) {
          instance.element.querySelector( 'button' ).click();
        } );
      },
      evalIntertretsFunctions: function ( suite ) {
        suite.component.start( {
          expression: 'function () {}',
          json_parse: false,
          onfinish: function ( instance, results ) {
            if ( typeof results.value !== 'function' )
              return suite.failed( 'result value is not a function' );
            suite.assertEquals( 'function () {}', results.value.toString() );
          }
        }, function ( instance ) {
          instance.element.querySelector( 'button' ).click();
        } );
      }
    }
  }
};