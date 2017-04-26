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
      publicProperties: function ( suite ) {
        suite.assertEquals( [ 'start', 'ccm', 'element', 'id', 'index', 'component' ], Object.keys( suite.instance ) );
      },
      startCallback: function ( suite ) {
        suite.instance.start( suite.passed );
      },
      componentTag: function ( suite ) {
        suite.container.innerHTML = '<ccm-quiz></ccm-quiz>';
        suite.passed();
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
  data: {
    tests: {
      singleQuestion: function ( suite ) {
        suite.component.start( {
          questions: {},
          logger: [ 'ccm.instance', './../../ccm-components/log/ccm.log.js', {
            logging: { data: true },
            onfinish: function ( instance, results ) {
              suite.assertSame( 1, results.data.questions.length );
            }
          } ]
        } );
      },
      defaultsByConfig: function ( suite ) {
        suite.component.start( {
          text: true, description: true, answers: true, input: true, attributes: true, swap: true, encode: true, random: true, feedback: true, correct: true,
          questions: {},
          logger: [ 'ccm.instance', './../../ccm-components/log/ccm.log.js', {
            logging: { data: true },
            onfinish: function ( instance, results ) {

              var data = results.data;
              if ( data.text        ) return suite.failed( 'text property not deleted' );
              if ( data.description ) return suite.failed( 'description property not deleted' );
              if ( data.answers     ) return suite.failed( 'answers property not deleted' );
              if ( data.input       ) return suite.failed( 'input property not deleted' );
              if ( data.attributes  ) return suite.failed( 'attributes property not deleted' );
              if ( data.swap        ) return suite.failed( 'swap property not deleted' );
              if ( data.encode      ) return suite.failed( 'encode property not deleted' );
              if ( data.random      ) return suite.failed( 'random property not deleted' );
              if ( data.feedback    ) return suite.failed( 'feedback property not deleted' );
              if ( data.correct     ) return suite.failed( 'correct property not deleted' );

              var question = data.questions[ 0 ];
              if ( !question.text        ) return suite.failed( 'missing text property' );
              if ( !question.description ) return suite.failed( 'missing description property' );
              if ( !question.answers     ) return suite.failed( 'missing answers property' );
              if ( !question.input       ) return suite.failed( 'missing input property' );
              if ( !question.random      ) return suite.failed( 'missing random property' );
              if ( !question.feedback    ) return suite.failed( 'missing feedback property' );
              if ( !question.correct     ) return suite.failed( 'missing correct property' );

              var answer = question.answers[ 0 ];
              if ( !answer.attributes  ) return suite.failed( 'missing attributes property' );
              if ( !answer.swap        ) return suite.failed( 'missing swap property' );
              if ( !answer.encode      ) return suite.failed( 'missing encode property' );

              suite.passed();
            }
          } ]
        } );
      },
      defaultInput: function ( suite ) {
        suite.component.start( {
          questions: {},
          logger: [ 'ccm.instance', './../../ccm-components/log/ccm.log.js', {
            logging: { data: true },
            onfinish: function ( instance, results ) {
              suite.assertSame( 'checkbox', results.data.questions[ 0 ].input );
            }
          } ]
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