/**
 * @overview unit tests of ccm component for rendering a quiz
 * @author André Kless <andre.kless@web.de> 2017
 * @license The MIT License (MIT)
 */

ccm.files[ 'tests.js' ] = {
  setup: function ( suite, callback ) {
    suite.ccm.component( '../quiz/ccm.quiz.js', function ( component ) {
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
      publicProperties: function ( suite ) {
        suite.assertEquals( [ 'start', 'ccm', 'id', 'index', 'component', 'root', 'element', 'dependency' ], Object.keys( suite.instance ) );
      },
      startCallback: function ( suite ) {
        suite.instance.start( suite.passed );
      }
    }
  },
  uniform_data_structure: {
    setup: function ( suite, callback ) {
      suite.logger_url = '../log/ccm.log.js';
      callback();
    },
    tests: {
      singleQuestion: function ( suite ) {
        suite.component.start( {
          questions: {},
          logger: [ 'ccm.instance', suite.logger_url, {
            events: { start: true },
            logging: { data: true },
            onfinish: function ( instance, results ) {
              suite.assertSame( 1, results.data.questions.length );
            }
          } ]
        } );
      },
      defaultsByConfig: function ( suite ) {
        suite.component.start( {
          text: true, description: true, answers: true, input: true, attributes: true, swap: true, encode: true, random: true, correct: true,
          questions: {},
          logger: [ 'ccm.instance', suite.logger_url, {
            events: { start: true },
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
              if ( data.correct     ) return suite.failed( 'correct property not deleted' );

              var question = data.questions[ 0 ];
              if ( !question.text        ) return suite.failed( 'missing text property' );
              if ( !question.description ) return suite.failed( 'missing description property' );
              if ( !question.answers     ) return suite.failed( 'missing answers property' );
              if ( !question.input       ) return suite.failed( 'missing input property' );
              if ( !question.random      ) return suite.failed( 'missing random property' );
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
          logger: [ 'ccm.instance', suite.logger_url, {
            events: { start: true },
            logging: { data: true },
            onfinish: function ( instance, results ) {
              suite.assertSame( 'checkbox', results.data.questions[ 0 ].input );
            }
          } ]
        } );
      },
      singleAnswer: function ( suite ) {
        suite.component.start( {
          questions: { answers: {} },
          logger: [ 'ccm.instance', suite.logger_url, {
            events: { start: true },
            logging: { data: true },
            onfinish: function ( instance, results ) {
              suite.assertSame( 1, results.data.questions[ 0 ].answers.length );
            }
          } ]
        } );
      },
      stringAnswers: function ( suite ) {
        suite.component.start( {
          questions: { answers: [ 'foo', {}, 'bar' ] },
          logger: [ 'ccm.instance', suite.logger_url, {
            events: { start: true },
            logging: { data: true },
            onfinish: function ( instance, results ) {
              suite.assertEquals( [ { text: 'foo', nr: 1, class: 'answer-1', id: 'question-1-answer-1' }, { nr: 2, class: 'answer-2', id: 'question-1-answer-2' }, { text: 'bar', nr: 3, class: 'answer-3', id: 'question-1-answer-3' } ], results.data.questions[ 0 ].answers );
            }
          } ]
        } );
      },
      singleCorrectNumber: function ( suite ) {
        suite.component.start( {
          questions: { answers: [ '', '', '' ], correct: 1 },
          logger: [ 'ccm.instance', suite.logger_url, {
            events: { start: true },
            logging: { data: true },
            onfinish: function ( instance, results ) {
              suite.assertEquals( [ false, true, false ], results.data.questions[ 0 ].correct );
            }
          } ]
        } );
      },
      fillUpValue: function ( suite ) {
        suite.component.start( {
          questions: { input: 'number', answers: [ '', '', '' ], correct: 5711 },
          logger: [ 'ccm.instance', suite.logger_url, {
            events: { start: true },
            logging: { data: true },
            onfinish: function ( instance, results ) {
              suite.assertEquals( [ 5711, '', '' ], results.data.questions[ 0 ].correct );
            }
          } ]
        } );
      },
      defaultsByQuestion: function ( suite ) {
        suite.component.start( {
          questions: {
            text: '',
            attributes: true, swap: true, encode: true,
            answers: ''
          },
          logger: [ 'ccm.instance', suite.logger_url, {
            events: { start: true },
            logging: { data: true },
            onfinish: function ( instance, results ) {

              var question = results.data.questions[ 0 ];
              if ( question.attributes ) return suite.failed( 'attributes property not deleted' );
              if ( question.swap       ) return suite.failed( 'swap property not deleted' );

              var answer = question.answers[ 0 ];
              if ( !answer.attributes  ) return suite.failed( 'missing attributes property' );
              if ( !answer.swap        ) return suite.failed( 'missing swap property' );
              if ( !answer.encode      ) return suite.failed( 'missing encode property' );

              suite.passed();
            }
          } ]
        } );
      }
    }
  },
  config: {
    tests: {
      oneQuestion: function ( suite ) {
        suite.component.start( function ( instance ) {
          var buttons = instance.element.querySelectorAll( 'button' );
          if ( buttons.length !== 1 ) return suite.failed( 'not one button' );
          suite.assertSame( 'Finish', buttons[ 0 ].innerHTML );
        } );
      },
      shuffle: function ( suite ) {
        suite.component.instance( {
          questions: [ { text: 'foo' }, { text: 'bar' }, { text: 'baz' } ],
          shuffle: true
        }, function ( instance ) {
          var i = 0;
          start();
          function start() {
            i++;
            instance.start( function () {
              if ( instance.element.querySelectorAll( '.title' )[ 0 ].children[ 2 ].innerHTML !== 'foo' )
                return suite.passed();
              else if ( i < 10 )
                start();
              else
                return suite.failed( 'same order' );
            } );
          }
        } );
      },
      loggedInUser: function ( suite ) {
        suite.component.start( {
          anytime_finish: true,
          user: [ 'ccm.instance', '../user/ccm.user.js' ],
          onfinish: function ( instance ) {
            suite.assertTrue( instance.user.isLoggedIn() );
          }
        }, function ( instance ) {
          if ( instance.user.isLoggedIn() ) suite.failed( 'user is already logged in' );
          instance.element.querySelector( 'button' ).click();
        } );
      }
    },
    logger: {
      setup: function ( suite, callback ) {
        suite.logger_url = '../log/ccm.log.js';
        callback();
      },
      tests: {
        start: function ( suite ) {
          suite.component.start( {
            logger: [ 'ccm.instance', suite.logger_url, {
              events: { start: true },
              logging: { data: true },
              onfinish: function ( instance, results ) {
                if ( results.event !== 'start' ) return suite.failed( 'wrong event' );
                suite.assertEquals( [ 'html', 'css', 'questions', 'placeholder' ], Object.keys( results.data ) );
              }
            } ]
          } );
        },
        finish: function ( suite ) {
          suite.component.start( {
            anytime_finish: true,
            logger: [ 'ccm.instance', suite.logger_url, {
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
    html: {
      setup: function ( suite, callback ) {
        suite.component.start( { questions: [ {}, {} ] }, function ( instance ) {
          suite.instance = instance;
          callback();
        } );
      },
      tests: {
        main: function ( suite ) {
          if ( !suite.instance.element.querySelector( '#questions' ) ) return suite.failed( 'missing "questions" container' );
          if ( !suite.instance.element.querySelector( '#next button' ) ) return suite.failed( 'missing "next" button' );
          if ( !suite.instance.element.querySelector( '#finish button' ) ) return suite.failed( 'missing "finish" button' );
          suite.passed();
        },
        question: function ( suite ) {
          var questions = suite.instance.element.querySelectorAll( '.question' );
          if ( questions.length !== 2 ) return suite.failed( 'missing "question" container(s)' );
          suite.ccm.helper.makeIterable( questions ).map( function ( question, i ) {
            var title = question.querySelector( '.title' );
            if ( parseInt( title.children[ 1 ].innerHTML !== i + 1 ) ) return suite.failed( 'wrong question number' );
          } );
          suite.passed();
        }
      }
    },
    placeholder: {
      tests: {
        question: function ( suite ) {
          suite.component.start( function ( instance ) {
            suite.assertSame( 'Question', instance.element.querySelector( '.question' ).querySelector( '.title' ).children[ 0 ].innerHTML );
          } );
        },
        prev: function ( suite ) {
          suite.component.start( { questions: [ {}, {} ], navigation: true }, function ( instance ) {
            suite.assertSame( 'Previous', instance.element.querySelector( '#prev button' ).innerHTML );
          } );
        }
      }
    }
  }
};