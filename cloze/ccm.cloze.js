/**
 * @overview ccm component for fill-in-the-blank texts
 * @author André Kless <andre.kless@web.de> 2017
 * @license The MIT License (MIT)
 */

( function () {

  var ccm_version = '8.0.0';
  var ccm_url     = '../../ccm-developer/ccm/ccm.js';

  var component_name = 'cloze';
  var component_obj  = {

    name: component_name,

    config: {

      text: 'Hello, [[(W)o(rl)d]]!',
      html_templates: {
        start: {
          id: 'start',
          inner: {
            tag: 'button',
            inner: '%caption%',
            onclick: '%click%'
          }
        },
        main: {
          id: 'main',
          inner: {
            tag: 'form',
            id: 'form',
            inner: [
              { id: 'keywords' },
              { id: 'text' },
              { id: 'button' },
              { id: 'timer' }
            ],
            onsubmit: '%%'
          }
        },
        keyword: {
          class: 'keyword',
          inner: '%%'
        },
        button: {
          tag: 'input',
          type: 'submit',
          value: '%caption%'
        },
        timer: {
          tag: 'span',
          inner: '%%'
        }
      },
      css_layout: [ 'ccm.load', '../cloze/layouts/default.css' ],
      placeholder: {
        start: 'Start',
        finish: 'Finish'
      }

  //  keywords: [ 'keyword1', 'keyword2', ... ],
  //  blank: true,
  //  time: 60,
  //  feedback: true,
  //  logger: [ 'ccm.instance', '../log/ccm.log.js', [ 'ccm.get', '../log/configs.json', 'greedy' ] ],
  //  user:   [ 'ccm.instance', '../user/ccm.user.js' ],
  //  onchange: function ( instance, data ) { console.log( data ); },
  //  oninput:  function ( instance, data ) { console.log( data ); },
  //  onfinish: function ( instance, results ) { console.log( results ); }

    },

    Instance: function () {

      var self = this;
      var my;             // contains privatized instance members
      var keywords = [];  // information data for each keyword

      this.init = function ( callback ) {

        // fill-in-the-blank text is given via inner HTML? => use it with higher priority
        if ( self.node && self.node.innerHTML.trim() ) self.text = self.node.innerHTML;

        callback();
      };

      this.ready = function ( callback ) {

        // privatize all possible instance members
        my = self.ccm.helper.privatize( self );

        var regex_keyword = /\[\[.+?\]\]/g;   // regular expression for finding all gaps/keywords in the text
        var regex_given = /\(.+?\)/g;         // regular expression for finding all given characters of a keyword

        // iterate all keywords in the text to determine the information data for each keyword
        ( my.text.match( regex_keyword ) || [] ).map( function ( keyword ) {

          // remove distinguishing characteristic '[[' and ']]'
          keyword = keyword.substr( 2, keyword.length - 4 );

          // replace all given characters of a keywords with '*'
          var keyw__d = keyword.replace( '*', '#' ).replace( regex_given, function ( given ) {
            var length = given.length - 2;
            given = '';
            for ( var i = 0; i < length; i++ ) given += '*';
            return given;
          } );

          // determine given characters and hold this information in a single number (disadvantage: possible positions
          var givens = 0;                                                      // for given letters in a word are 0-31
          for ( var i = 0; i < keyw__d.length; i++ )                           // because of data type limitations)
            if ( keyw__d.charAt( i ) === '*' ) givens += Math.pow( 2, i );

          // add keyword information data for current keyword
          keywords.push( {
            word: keyword.replace( regex_given, function ( given ) { return given.substr( 1, given.length - 2 ); } ),
            givens: givens
          } );

        } );

        // replace gaps/keywords with empty span elements
        my.text = my.text.replace( regex_keyword, '<span class="gap"></span>' );

        callback();
      };

      this.start = function ( callback ) {

        // no start button? => start quiz
        if ( !my.start_button ) return start();

        // has logger instance? => log 'render' event
        if ( self.logger ) self.logger.log( 'render' );

        // render start button (start quiz when button is clicked)
        self.ccm.helper.setContent( self.element, self.ccm.helper.protect( self.ccm.helper.html( my.html_templates.start, {
          caption: my.placeholder.start,
          click: start
        } ) ) );

        /** starts the fill-in-the-blank text */
        function start() {

          // initial result data
          var results = { details: [] };

          // prepare main HTML structure
          var main_elem = self.ccm.helper.html( my.html_templates.main, onFinish );

          var   text_elem  = main_elem.querySelector( '#text'   );  // container for text with containing gaps
          var button_elem  = main_elem.querySelector( '#button' );  // container for finish button
          var  timer_elem  = main_elem.querySelector( '#timer'  );  // container for timer

          // add content for inner containers
          renderKeywords();
          renderText();
          renderButton();
          renderTimer();

          // set content of own website area
          self.ccm.helper.setContent( self.element, self.ccm.helper.protect( main_elem ) );

          // has logger instance? => log start event
          if ( self.logger ) self.logger.log( 'start', my );

          if ( callback ) callback();

          /**
           * @summary renders given keywords for text gaps
           * @description
           * Keywords could be given (individual) via instance configuration (my.keywords is string array)
           * or (automatic generated) via private variable 'keywords' (my.keywords is boolean true).
           */
          function renderKeywords() {

            var keywords_elem = main_elem.querySelector( '#keywords' );  // container for keywords
            var entries = [];                                            // inner container for each keyword

            // has given keywords? => create inner container for each keyword
            if ( my.keywords )
              ( Array.isArray( my.keywords ) ? my.keywords : keywords ).map( addKeyword );
            else
              return keywords_elem.parentNode.removeChild( keywords_elem );  // no given keywords? => remove container for keywords and abort

            // generated keyword list? => sort keywords lexicographical (keyword order gives no hint about correct solution)
            if ( my.keywords === true ) entries.sort( function ( a, b ) { return a.innerHTML.localeCompare( b.innerHTML ) } );

            // add each inner keyword container to container for keywords
            entries.map( function ( entry ) { keywords_elem.appendChild( entry ); } );

            /** adds a inner container for a keyword */
            function addKeyword( keyword ) {
              entries.push( self.ccm.helper.html( my.html_templates.keyword, Array.isArray( my.keywords ) ? keyword : keyword.word ) );
            }

          }

          /** renders the text with containing gaps */
          function renderText() {

            // render text with containing gaps
            text_elem.innerHTML = my.text;

            // render input field in each gap
            self.ccm.helper.makeIterable( main_elem.querySelectorAll( '.gap' ) ).map( function ( gap_elem, i ) {

              // blank input fields and shown keywords? => input fields should give no hint for the length of the searched word
              if ( my.blank && my.keywords ) return gap_elem.appendChild( self.ccm.helper.html( { tag: 'input', type: 'text', oninput: onInput, onchange: onChange } ) );

              // shorter access to keyword
              var keyword = keywords[ i ].word;

              // prepare ccm HTML data for input field
              var input = {
                tag: 'input',
                type: 'text',
                oninput: onInput,
                onchange: onChange,
                maxlength: keyword.length,
                size: keyword.length * 1.5  // works tolerably for words with a length up to 30
              };

              // no blank input fields? => set placeholder attribute
              if ( !my.blank ) {
                input.placeholder = '';
                for ( var j = 0; j < keyword.length; j++ )
                  input.placeholder += Math.pow( 2, j ) & keywords[ i ].givens ? keyword.charAt( j ) : '_';
              }

              // render input field in the current gap
              gap_elem.appendChild( self.ccm.helper.html( input ) );

              /** oninput callback for input fields */
              function onInput() {

                var data = { gap: 1 + i, input: this.value };  // input field informations

                // has logger instance? => log input event
                if ( self.logger ) self.logger.log( 'input', data );

                // has individual input callback? => perform it
                if ( self.oninput ) self.oninput( self, data );

              }

              /** onchange callback for input fields */
              function onChange() {

                var data = { gap: 1 + i, input: this.value };  // input field informations

                // has logger instance? => log change event
                if ( self.logger ) self.logger.log( 'change', data );

                // has individual change callback? => perform it
                if ( self.onchange ) self.onchange( self, data );

              }

            } );

          }

          /** renders the finish button */
          function renderButton() {

            // set content of container for finish button
            self.ccm.helper.setContent( button_elem, self.ccm.helper.html( my.html_templates.button, {
              caption: my.placeholder.submit,
              click:   onFinish
            } ) );

            // finish button is a input tag? => allow use of browser specific default caption
            var submit_elem = button_elem.querySelector( 'input[type=submit]' );
            if ( submit_elem && !my.placeholder.submit ) submit_elem.removeAttribute( 'value' );

          }

          /** renders the timer */
          function renderTimer() {

            var timer_value = my.time;

            // no limited time? => remove timer button and abort
            if ( !my.time ) return self.ccm.helper.removeElement( timer_elem );

            // start timer
            timer();

            /** updates countdown timer */
            function timer() {

              // already finished? => stop timer
              if ( !timer_elem ) return;

              // (re)render timer value
              self.ccm.helper.setContent( timer_elem, self.ccm.helper.html( my.html_templates.timer, timer_value ) );

              // countdown
              if ( timer_value-- )
                self.ccm.helper.wait( 1000, timer );
              else if ( button_elem )
                onFinish();           // perform finish callback at timeout

            }

          }

          /** onclick callback for finish button */
          function onFinish( event ) {

            // prevent page reload
            if ( event ) event.preventDefault();

            self.ccm.helper.removeElement( button_elem );  // remove button
            self.ccm.helper.removeElement(  timer_elem );  // remove timer container

            // has user instance? => login user
            if ( self.user ) self.user.login( proceed ); else proceed();

            function proceed() {

              // iterate over all gap input fields
              self.ccm.helper.makeIterable( main_elem.querySelectorAll( '.gap input' ) ).map( function ( gap, i ) {

                // give visual feedback for correctness
                if ( my.feedback ) {
                  var nearly = gap.value.toLowerCase().trim() === keywords[ i ].word.toLowerCase().trim();
                  var correct = gap.value === keywords[ i ].word;
                  if ( !nearly ) gap.value = '';
                  gap.setAttribute( 'placeholder', keywords[ i ].word );
                  gap.parentNode.classList.add( correct ? 'correct' : ( nearly ? 'nearly' : 'wrong' ) );
                }

                // set detail informations for current gap result
                results.details.push( { input: gap.value, solution: keywords[ i ].word } );

              } );

              // finalize result data
              if ( self.user ) results.user = self.user.data().key;

              // has logger instance? => log finish event
              if ( self.logger ) self.logger.log( 'finish', results );

              // provide result data
              self.ccm.helper.onFinish( self, results );

            }

          }

        }

      }

    }

  };

  var namespace = window.ccm && ccm.components[ component_name ]; if ( namespace ) { if ( namespace.ccm_version ) ccm_version = namespace.ccm_version; if ( namespace.ccm_url ) ccm_url = namespace.ccm_url; }
  if ( !window.ccm || !ccm[ ccm_version ] ) { var tag = document.createElement( 'script' ); document.head.appendChild( tag ); tag.onload = register; tag.src = ccm_url; } else register();
  function register() { ccm[ ccm_version ].component( component_obj ); }
}() );