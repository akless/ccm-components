/**
 * @overview ccm component for rendering a quiz
 * @author André Kless <andre.kless@web.de> 2016-2017
 * @license The MIT License (MIT)
 * @version latest (2.0.0)
 * @changes
 * version 2.0.0 (23.08.2017):
 * - uses ccm v10.0.0 instead of v8.1.0
 * - renaming of some instance properties
 * - reductions in HTML template for start button
 * - remove no more needed ccm.helper.protect calls
 * - remove no more needed ccm.helper.clone call
 * version 1.0.0 (04.08.2017)
 * TODO: docu comments -> API
 * TODO: factory
 * TODO: multilingualism
 */

( function () {

  var component = {

    name: 'quiz',

    ccm: 'https://akless.github.io/ccm/ccm.js',

    config: {

      "html": {
        "start": {
          "id": "start",
          "inner": {
            "tag": "button",
            "inner": "Start",
            "onclick": "%%"
          }
        },
        "main": {
          "id": "main",
          "inner": [
            { "id": "questions" },
            {
              "id": "buttons",
              "inner": [
                { "id": "cancel" },
                { "id": "prev" },
                { "id": "submit" },
                { "id": "next" },
                { "id": "finish" },
                { "id": "timer" }
              ]
            }
          ]
        },
        "question": {
          "id": "%id%",
          "class": "question",
          "inner": [
            {
              "class": "title",
              "inner": [
                { "inner": "Question" },
                { "inner": "%nr%/%count%" },
                { "inner": "%text%" }
              ]
            },
            {
              "class": "description",
              "inner": "%description%"
            },
            { "class": "answers" }
          ]
        },
        "answer": {
          "id": "%id%",
          "class": "answer %class%",
          "inner": {
            "class": "entry",
            "inner": [
              {
                "class": "text",
                "inner": {
                  "tag": "label",
                  "inner": "%text%",
                  "for": "%id%-input"
                }
              },
              { "class": "comment" }
            ]
          }
        },
        "comment": {
          "class": "tooltip",
          "inner": [
            "i",
            {
              "tag": "div",
              "class": "tooltiptext",
              "inner": {
                "inner": {
                  "inner": "%%"
                }
              }
            }
          ]
        },
        "timer": {
          "tag": "span",
          "inner": "%%"
        }
      },
      "css": [ "ccm.load", "../quiz/resources/default.css" ],
      "questions": {},
      "placeholder": {
        "cancel": "Cancel",
        "prev": "Previous",
        "submit": "Submit",
        "next": "Next",
        "correct": "Correct solution: ",
        "finish": "Finish"
      }

  //  start_button: true,
  //  cancel_button: true,
  //  feedback: true,
  //  navigation: true,
  //  skippable: true,
  //  anytime_finish: true,
  //  time: 60,
  //  shuffle: true,
  //  random: true,
  //  answers: [],
  //  correct: [],
  //  input: 'radio',
  //  attributes: {},
  //  encode: true,
  //  swap: true,
  //  user: [ 'ccm.instance', 'https://akless.github.io/ccm-components/user/ccm.user.min.js' ],
  //  logger: [ 'ccm.instance', 'https://akless.github.io/ccm-components/log/ccm.log.min.js', [ 'ccm.get', 'https://akless.github.io/ccm-components/log/resources/log_configs.min.js', 'greedy' ] ],
  //  onstart: function ( instance ) { console.log( 'Quiz started' ); },
  //  oncancel: function ( instance ) { console.log( 'Quiz canceled' ); },
  //  onprev: function ( instance, data ) { console.log( data ); },
  //  onnext: function ( instance, data ) { console.log( data ); },
  //  oninput: function ( instance, data ) { console.log( data ); },
  //  onchange: function ( instance, data ) { console.log( data ); },
  //  onvalidation: function ( instance, data ) { console.log( data ); return true; },
  //  onfeedback: function ( instance, data ) { console.log( data ); },
  //  onfinish: function ( instance, results ) { console.log( results ); }

    },

    Instance: function () {

      var self = this;
      var my;           // contains privatized instance members

      this.init = function ( callback ) {

        // support declarative way for defining a quiz via HTML
        evaluateLightDOM();

        callback();

        /** finds Custom Component Elements for generating question data sets */
        function evaluateLightDOM() {

          // no Light DOM? => skip
          if ( !self.inner ) return;

          /**
           * question data sets (generated out of Custom Component Elements)
           * @type {object[]}
           */
          var questions = [];

          // iterate over all children of the Light DOM to search for question tags
          self.ccm.helper.makeIterable( self.inner.children ).map( function ( question_tag ) {

            // no question tag? => skip
            if ( question_tag.tagName !== 'CCM-QUIZ-QUESTION' ) return;

            /**
             * question data (generated out of question tag)
             * @type {object}
             */
            var question = self.ccm.helper.generateConfig( question_tag );

            /**
             * answer data sets (generated out of question tag)
             * @type {object[]}
             */
            question.answers = [];

            // iterate over all children of the question tag to search for answer tags
            self.ccm.helper.makeIterable( question.inner.children ).map( function ( answer_tag ) {

              // no answer tag? => skip
              if ( answer_tag.tagName !== 'CCM-QUIZ-ANSWER' ) return;

              /**
               * answer data (generated out of answer tag)
               * @type {object}
               */
              var answer = self.ccm.helper.generateConfig( answer_tag );

              // remove no more needed properties in answer data
              delete answer.inner;

              // add answer data to answer data sets
              question.answers.push( answer );

            } );

            // remove no more needed properties in question data
            delete question.inner;

            // add question data to question data sets
            questions.push( question );

          } );

          // has founded question data sets? => use them for quiz (with higher priority)
          if ( questions.length > 0 ) self.questions = questions;

        }

      };

      this.ready = function ( callback ) {

        // privatize all possible instance members
        my = self.ccm.helper.privatize( self );

        // support different forms of data structure
        uniformData();

        callback();

        /** brings given data to uniform data structure */
        function uniformData() {

          // question data sets could be given without array as single object if quiz has only one question
          if ( !Array.isArray( my.questions ) ) my.questions = [ my.questions ];

          // iterate over all question data sets
          my.questions.map( function ( question, i ) {

            // each question knows her original number and HTML ID
            question.nr = i + 1; question.id = 'question-' + question.nr;

            // consider default values for question data from instance config
            self.ccm.helper.integrate( self.ccm.helper.filterProperties( my, 'text', 'description', 'answers', 'input', 'attributes', 'swap', 'encode', 'random', 'correct' ), question, true );

            // default input type is checkbox
            if ( !question.input ) question.input = 'checkbox';

            // answer data sets could be given without array as single object (or string) if question has only one answer
            if ( !Array.isArray( question.answers ) ) question.answers = [ question.answers ];

            // answer data sets could be given as single string (answer text) instead of object
            for ( i = 0; i < question.answers.length; i++ )
              if ( !self.ccm.helper.isObject( question.answers[ i ] ) )
                question.answers[ i ] = { text: question.answers[ i ] };

            // informations about the correct answers of questions that have only one answer could be given without array as single value
            if ( question.input !== 'radio' && !Array.isArray( question.correct ) ) question.correct = [ question.correct ];

            // informations about the correct answers of a multiple choice question could be given as integer array instead of boolean array
            if ( question.input === 'checkbox' && typeof question.correct[ 0 ] === 'number' ) {
              var correct = [];
              for ( i = 0; i < question.answers.length; i++ )
                correct.push( question.correct.indexOf( i ) >= 0 );
              question.correct = correct;
            }

            // fill up the array of informations about the correct answers with default values (checkbox -> false, otherwise empty string)
            if ( Array.isArray( question.correct ) )
              for ( i = 0; i < question.answers.length; i++ )
                if ( question.correct[ i ] === undefined )
                  question.correct[ i ] = question.input === 'checkbox' ? false : '';

            // iterate over all answers
            question.answers.map( function ( answer, i ) {

              // each answer knows her original number, HTML class and HTML ID
              answer.nr = i + 1; answer.class = 'answer-' + answer.nr; answer.id = question.id + '-' + answer.class;

              // informations about the correct answers of a question could be given via answer data
              if ( answer.correct !== undefined )
                if ( question.input === 'radio' )
                  question.correct = i;
                else
                  question.correct[ i ] = question.input === 'number' ? parseInt( answer.correct ) : answer.correct;

              // consider default values for answer data from question data
              self.ccm.helper.integrate( self.ccm.helper.filterProperties( question, 'attributes', 'swap', 'encode' ), answer, true );

            } );

            // remove no more needed properties in question data
            delete question.attributes; delete question.swap;

          } );

          // remove no more needed properties in config
          delete my.text; delete my.description; delete my.answers; delete my.input; delete my.attributes; delete my.swap; delete my.encode; delete my.random; delete my.correct;

        }

      };

      this.start = function ( callback ) {

        // has logger instance? => log 'render' event
        if ( self.logger ) self.logger.log( 'render' );

        // user must click on a start button before quiz is starting? => render start button
        if ( my.start_button ) self.ccm.helper.setContent( self.element, self.ccm.helper.html( my.html.start, start ) );

        // no need for a start button? => start quiz directly
        else start();

        if ( callback ) callback();

        /** starts the quiz */
        function start() {

          /**
           * index of current question
           * @type {number}
           */
          var current_question = 0;

          /**
           * stores which questions are already evaluated
           * @type {Object.<number,boolean>}
           */
          var evaluated = {};

          /**
           * initial result data
           * @type {object}
           */
          var results = { details: [] };

          // has logger instance? => log 'start' event
          if ( self.logger ) self.logger.log( 'start', my );

          // prepare main HTML structure
          var main_elem = self.ccm.helper.html( my.html.main );

          // select inner containers (mostly for buttons)
          var cancel_elem = main_elem.querySelector( '#cancel' );
          var   prev_elem = main_elem.querySelector( '#prev'   );
          var   next_elem = main_elem.querySelector( '#next'   );
          var submit_elem = main_elem.querySelector( '#submit' );
          var finish_elem = main_elem.querySelector( '#finish' );
          var  timer_elem = main_elem.querySelector( '#timer'  );

          // remove unneeded buttons
          if ( !my.cancel_button ) self.ccm.helper.removeElement( cancel_elem );
          if ( !my.navigation    ) self.ccm.helper.removeElement(   prev_elem );
          if ( !my.feedback      ) self.ccm.helper.removeElement( submit_elem );
          if ( my.questions.length === 1 ) {
            self.ccm.helper.removeElement( prev_elem );
            self.ccm.helper.removeElement( next_elem );
          }

          // want random order for the questions? => shuffle questions
          if ( my.shuffle ) self.ccm.helper.shuffleArray( my.questions );

          // render all questions and show only first one
          my.questions.map( renderQuestion );
          showQuestion();

          // render timer (in case of time limited quiz)
          renderTimer();

          // set content of own website area
          self.ccm.helper.setContent( self.element, main_elem );

          // has individual 'start' callback? => perform it
          if ( self.onstart ) self.onstart( self );

          /**
           * renders a specific question
           * @param {object} question - question data
           * @param {number} i - question index
           */
          function renderQuestion( question, i ) {

            // each question knows her index
            question.i = i;

            // prepare HTML structure of the question
            question.elem = self.ccm.helper.html( my.html.question, {
              id:          question.id,
              nr:          i + 1,
              count:       my.questions.length,
              text:        question.encode ? self.ccm.helper.htmlEncode( question.text ) : question.text,
              description: question.description
            } );

            // question has no description? => remove description container
            if ( !question.description ) self.ccm.helper.removeElement( question.elem.querySelector( '.description' ) );

            // want random order for the answers? => shuffle answers
            if ( question.random ) self.ccm.helper.shuffleArray( question.answers );

            // render all question answers
            question.answers.map( renderAnswer );

            // add prepared question container to main HTML structure
            main_elem.querySelector( '#questions' ).appendChild( question.elem );

            /**
             * renders a specific answer
             * @param {object} answer - answer data
             */
            function renderAnswer( answer ) {

              // prepare HTML structure of the answer
              answer.elem = self.ccm.helper.html( my.html.answer, {
                id: answer.id,
                class: answer.class,
                text: answer.encode ? self.ccm.helper.htmlEncode( answer.text ) : answer.text
              } );
              addInput();  // add input field of the answer

              // add prepared answer container to the HTML structure of the question
              question.elem.querySelector( '.answers' ).appendChild( answer.elem );

              /** adds the input field */
              function addInput() {

                // prepare ccm HTML data of the input field
                var input_html = {
                  tag: 'input',
                  type: question.input,
                  name: answer.id,
                  id: answer.id + '-input',
                  oninput: function () {

                    // prepare event data
                    var event_data = { question: question.nr, answer: answer.nr, value: this.value };

                    // has logger instance? => log 'input' event
                    if ( self.logger ) self.logger.log( 'input', event_data );

                    // has individual 'input' callback? => perform it
                    if ( self.oninput ) self.oninput( self, event_data );

                  },
                  onchange: function () {

                    // prepare event data
                    var event_data = { question: question.nr, answer: answer.nr, value: this.value };

                    // has logger instance? => log 'change' event
                    if ( self.logger ) self.logger.log( 'change', event_data );

                    // has individual 'change' callback? => perform it
                    if ( self.onchange ) self.onchange( self, event_data );

                  }
                };

                // is a single choice answer? => set same name and different value for the radio button
                if ( question.input === 'radio' ) { input_html.name = question.id; input_html.value = answer.nr - 1; }

                // add individual attributes to the input field (if any)
                self.ccm.helper.integrate( answer.attributes, input_html );

                // add input field to HTML structure of the answer
                var entry_elem = answer.elem.querySelector( '.entry' );
                var input_elem = self.ccm.helper.html( { class: 'input', inner: input_html } );
                entry_elem.insertBefore( input_elem, entry_elem.firstChild );
                if ( answer.swap ) {
                  entry_elem.insertBefore( entry_elem.children[ 1 ], input_elem );
                  entry_elem.classList.add( 'swap' );
                }
              }

            }

          }

          /** shows current question (and hides all others) */
          function showQuestion() {

            // hide all questions and show only current question
            self.ccm.helper.makeIterable( main_elem.querySelectorAll( '.question' ) ).map( function ( question_elem ) { question_elem.style.display = 'none'; } );
            my.questions[ current_question ].elem.style.display = 'block';

            updateButtons();

          }

          /** (re)renders the buttons */
          function updateButtons() {

            /**
             * question data of the current question
             * @type {object}
             */
            var question = my.questions[ current_question ];

            // render 'cancel' button (if needed)
            if ( my.cancel_button ) self.ccm.helper.setContent( cancel_elem, self.ccm.helper.html( {
              tag: 'button',
              inner: my.placeholder.cancel,
              onclick: function () { if ( self.oncancel ) self.oncancel( self ); else self.start( callback ); }
            } ) );

            // render 'prev' button (if needed)
            if ( my.navigation ) self.ccm.helper.setContent( prev_elem, self.ccm.helper.html( {
              tag: 'button',
              disabled: question.i === 0,
              inner: my.placeholder.prev,
              onclick: previousQuestion
            } ) );

            // render 'next' button
            self.ccm.helper.setContent( next_elem, self.ccm.helper.protect( self.ccm.helper.html( {
              tag: 'button',
              disabled: question.i === my.questions.length - 1 || my.feedback && !my.skippable && !evaluated[ question.nr ],
              inner: my.placeholder.next,
              onclick: nextQuestion
            } ) ) );

            // render 'submit' button (if needed)
            if ( my.feedback ) self.ccm.helper.setContent( submit_elem, self.ccm.helper.html( {
              tag: 'button',
              disabled: evaluated[ question.nr ],
              inner: my.placeholder.submit,
              onclick: function () { evaluate( question ); }
            } ) );

            // render 'finish' button
            self.ccm.helper.setContent( finish_elem, self.ccm.helper.html( {
              tag: 'button',
              disabled: !my.anytime_finish && ( question.i !== my.questions.length - 1 || my.feedback && !evaluated[ question.nr ] ),
              inner: my.placeholder.finish,
              onclick: onFinish
            } ) );

            /** switch to previous question */
            function previousQuestion() {

              // decrease index of current question
              current_question--;

              // show previous question
              showQuestion();

              /**
               * question data of the current question
               * @type {object}
               */
              var question = my.questions[ current_question ];

              // prepare event data
              var event_data = { question_nr: question.i + 1, original_nr: question.nr, number_of_questions: my.questions.length };

              // has logger instance? => log 'prev' event
              if ( self.logger ) self.logger.log( 'prev', event_data );

              // has individual 'prev' callback? => perform it
              if ( self.onprev ) self.onprev( self, event_data );

            }

            /** switch to next question */
            function nextQuestion() {

              // increase index of current question
              current_question++;

              // show next question
              showQuestion();

              /**
               * question data of the current question
               * @type {object}
               */
              var question = my.questions[ current_question ];

              // prepare event data
              var event_data = { question_nr: question.i + 1, original_nr: question.nr, number_of_questions: my.questions.length };

              // has logger instance? => log 'next' event
              if ( self.logger ) self.logger.log( 'next', event_data );

              // has individual 'next' callback? => perform it
              if ( self.onnext ) self.onnext( self, event_data );

            }

          }

          /**
           * evaluates a question
           * @param {object} [question] - question data (default: evaluate all not already evaluated questions)
           */
          function evaluate( question ) {

            // no specific question? => evaluate all questions
            if ( !question ) return my.questions.map( evaluate );

            // question is already evaluated? => abort
            if ( results.details[ question.nr - 1 ] ) return;

            // prepare event data
            var event_data = { question_nr: question.i + 1, original_nr: question.nr, number_of_questions: my.questions.length, input: getResult() };

            // has individual 'validation' callback? => perform it (abort evaluation if user input value is not valid)
            if ( self.onvalidation && !self.onvalidation( self, self.ccm.helper.clone( event_data ) ) ) return;

            // add solution information to event data
            event_data.correct = question.correct;

            // has logger instance? => log 'feedback' event
            if ( self.logger ) self.logger.log( 'feedback', event_data );

            // add result data of this question to result data of hole quiz
            delete event_data.number_of_questions;
            results.details[ question.nr - 1 ] = event_data;

            // disable evaluated input fields
            self.ccm.helper.makeIterable( question.elem.querySelectorAll( 'input' ) ).map( function ( input_field ) { input_field.disabled = true; } );

            // show visual feedback for this question
            showFeedback();

            // remember that this question is already evaluated
            evaluated[ question.nr ] = true;

            // has individual 'feedback' callback? => perform it
            if ( self.onfeedback ) self.onfeedback( self, self.ccm.helper.clone( event_data ) );

            updateButtons();

            /**
             * get input field values of this question
             * @returns {Array|number}
             */
            function getResult() {

              var values = self.ccm.helper.formData( question.elem );
              if ( question.input === 'radio' ) return parseInt( values[ Object.keys( values )[ 0 ] ] );
              var array = [];
              for ( var i in values )
                array[ i.split( '-' ).pop() - 1 ] = question.input === 'checkbox' ? !!values[ i ] : values[ i ];
              return array;

            }

            /** gives the user a visual feedback */
            function showFeedback() {

              // iterate over all answer data sets of the current question
              question.answers.map( function ( answer ) {

                // no informations about correct answer? => abort
                if ( event_data.correct === undefined ) return;

                // current question is a single choice question? => skip
                if ( question.input === 'radio' ) return;

                /**
                 * correct value for this answer
                 * @type {boolean|number|string}
                 */
                var correct = event_data.correct[ answer.nr - 1 ];

                /**
                 * user input value for this answer
                 * @type {boolean|number|string}
                 */
                var input = event_data.input[ answer.nr - 1 ];

                // user gives correct value for this answer? => mark answer as right
                if ( input !== '' && input !== false && input === correct ) answer.elem.classList.add( 'right' );

                // user gives wrong value for this answer? => mark answer as wrong
                if ( input !== '' && input !== false && input !== correct ) answer.elem.classList.add( 'wrong' );

                // user gives no value for a (correct) multiple choice answer? => mark missed correct answer as correct
                if ( input === false && correct !== false ) answer.elem.classList.add( 'correct' );

                // number or text input field and user gives not correct value? => show user correct value (via placeholder attribute)
                if ( question.input !== 'checkbox' && correct !== '' && input !== correct )
                  answer.comment = my.placeholder.correct + correct + ( answer.comment ? '. ' + answer.comment : '' );

              } );

              // no informations about correct answers? => abort and render answer comments
              if ( event_data.correct === undefined ) return renderComments();

              // is a single choice question?
              if ( question.input === 'radio' ) {

                /**
                 * correct value for this question
                 * @type {number}
                 */
                var correct = event_data.correct;

                /**
                 * user input value for this question
                 * @type {number}
                 */
                var input = event_data.input;

                /**
                 * prefix of the HTML ID of an answer
                 * @type {string}
                 */
                var id_prefix = '#' + question.id + '-answer-';

                // user chooses correct answer? => mark correct answer as right
                if ( event_data.input === correct )
                  question.elem.querySelector( id_prefix + ( input + 1 ) ).classList.add( 'right' );
                else {
                  // user chooses wrong answer? => mark user answer as wrong
                  if ( !isNaN( event_data.input ) ) question.elem.querySelector( id_prefix + ( input + 1 ) ).classList.add( 'wrong' );
                  // mark missed correct answer as correct
                  question.elem.querySelector( id_prefix + ( correct + 1 ) ).classList.add( 'correct' );
                }

              }

              // render answer comments
              renderComments();

              /** renders the comments of the question answers (if any) */
              function renderComments() {

                // iterate over all answer data sets of the current question
                question.answers.map( function ( answer ) {

                  // answer has a comment? => render it
                  if ( answer.comment ) self.ccm.helper.setContent( answer.elem.querySelector( '.comment' ), self.ccm.helper.html( my.html.comment, answer.encode ? self.ccm.helper.htmlEncode( answer.comment ) : answer.comment ) );

                } );

              }

            }

          }

          /** renders the timer */
          function renderTimer() {

            // no limited time? => remove timer button and abort
            if ( !my.time ) return self.ccm.helper.removeElement( timer_elem );

            /**
             * given seconds for working with the quiz
             * @type {number}
             */
            var timer_value = my.time;

            // start timer
            timer();

            /** updates countdown timer (recursive function) */
            function timer() {

              // no existing finish button? => stop timer
              if ( !finish_elem ) return;

              // (re)render timer value
              self.ccm.helper.setContent( timer_elem, self.ccm.helper.html( my.html.timer, timer_value ) );

              // countdown
              if ( timer_value-- )
                self.ccm.helper.wait( 1000, timer );  // recursive call
              else
                onFinish();  // finish quiz at timeout

            }

          }

          /** finishes the quiz */
          function onFinish() {

            // has user instance? => login user (if not already logged in)
            if ( self.user ) self.user.login( proceed ); else proceed();

            function proceed() {

              // make sure that user could not use 'finish' button again
              self.ccm.helper.removeElement( finish_elem );
              self.ccm.helper.removeElement(  timer_elem );

              // evaluate all not already evaluated questions
              evaluate();

              // finalize result data
              if ( self.user ) results.user = self.user.data().name;

              // has logger instance? => log 'finish' event
              if ( self.logger ) self.logger.log( 'finish', results );

              // perform 'finish' actions and provide result data
              self.ccm.helper.onFinish( self, results );

            }

          }

        }

      };

    }

  };

  function p(){window.ccm[v].component(component)}var f="ccm."+component.name+(component.version?"-"+component.version.join("."):"")+".js";if(window.ccm&&null===window.ccm.files[f])window.ccm.files[f]=component;else{var n=window.ccm&&window.ccm.components[component.name];n&&n.ccm&&(component.ccm=n.ccm),"string"==typeof component.ccm&&(component.ccm={url:component.ccm});var v=component.ccm.url.split("/").pop().split("-");if(v.length>1?(v=v[1].split("."),v.pop(),"min"===v[v.length-1]&&v.pop(),v=v.join(".")):v="latest",window.ccm&&window.ccm[v])p();else{var e=document.createElement("script");document.head.appendChild(e),component.ccm.integrity&&e.setAttribute("integrity",component.ccm.integrity),component.ccm.crossorigin&&e.setAttribute("crossorigin",component.ccm.crossorigin),e.onload=function(){p(),document.head.removeChild(e)},e.src=component.ccm.url}}
}() );