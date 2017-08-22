/**
 * @overview ccm component for rendering a fill-in-the-blank text
 * @author André Kless <andre.kless@web.de> 2017
 * @license The MIT License (MIT)
 * @version 2.0.0
 * @changes
 * version 2.0.0 (22.08.2017):
 * - uses ccm v10.0.0 instead of v8.1.0
 * - shortened component backbone
 * - renaming of some instance properties
 * - add HTML template for a button
 * - visual feedback as default,
 * - default value for finish event
 * - reductions in HTML template for start button
 * - remove no more needed ccm.helper.protect call
 * version 1.0.0 (12.07.2017)
 */

( function () {

  var component = {

    name: 'cloze',
    version: [ 2, 0, 0 ],

    ccm: {
      url: 'https://akless.github.io/ccm/version/ccm-10.0.0.min.js',
      integrity: 'sha384-6j2e9RlJGOcd5Ge57Z1lzJSV1t4JrlPnPXZ9nZQ9vG1w0rXFhrMeiWx1EVySMM3Z',
      crossorigin: 'anonymous'
    },

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
            { "id": "keywords" },
            { "id": "text" },
            {
              "id": "buttons",
              "inner": [
                { "id": "cancel" },
                { "id": "submit" },
                { "id": "finish" },
                { "id": "timer" }
              ]
            }
          ]
        },
        "keyword": {
          "class": "keyword",
          "inner": "%%"
        },
        "button": {
          "tag": "button",
          "disabled": "%disabled%",
          "inner": "%caption%",
          "onclick": "%click%"
        },
        "timer": {
          "tag": "span",
          "inner": "%%"
        }
      },
      "css": [ "ccm.load", "https://akless.github.io/ccm-components/cloze/resources/default.css" ],
      "text": "Hello, [[(W)o(rl)d]]!",
      "captions": {
        "cancel": "Cancel",
        "submit": "Submit",
        "finish": "Close"
      },
      "feedback": true,
      "onfinish": { "clear": true, "log": true }

  //  start_button: true,
  //  cancel_button: true,
  //  keywords: [ 'keyword1', 'keyword2', ... ],
  //  blank: true,
  //  time: 60,
  //  user:   [ 'ccm.instance', 'https://akless.github.io/ccm-components/user/versions/ccm.user-1.0.0.min.js' ],
  //  logger: [ 'ccm.instance', 'https://akless.github.io/ccm-components/log/versions/ccm.log-1.0.0.min.js', [ 'ccm.get', 'https://akless.github.io/ccm-components/log/resources/log_configs.min.js', 'greedy' ] ],
  //  onstart: function ( instance ) { console.log( 'Fill-in-the-blank text started' ); },
  //  oncancel: function ( instance ) { console.log( 'Fill-in-the-blank text canceled' ); },
  //  onvalidation: function ( instance, data ) { console.log( data ); return true; },
  //  onfeedback: function ( instance, data ) { console.log( data ); },
  //  onchange: function ( instance, data ) { console.log( data ); },
  //  oninput:  function ( instance, data ) { console.log( data ); },

    },

    Instance: function () {

      var self = this;
      var my;             // contains privatized instance members
      var keywords = [];  // information data for each keyword

      this.init = function ( callback ) {

        // fill-in-the-blank text is given via inner HTML of own Custom Element? => use it with higher priority
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

          // determine and remember information data for this keyword
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

        // has logger instance? => log 'render' event
        if ( self.logger ) self.logger.log( 'render' );

        // user must click on a start button before fill-in-the-blank text is starting? => render start button
        if ( my.start_button )
          self.ccm.helper.setContent( self.element, self.ccm.helper.html( my.html.start, start ) );
        // no need for a start button? => start fill-in-the-blank text directly
        else start();

        if ( callback ) callback();

        /** starts the fill-in-the-blank text */
        function start() {

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
          var   text_elem = main_elem.querySelector( '#text'   );
          var cancel_elem = main_elem.querySelector( '#cancel' );
          var submit_elem = main_elem.querySelector( '#submit' );
          var finish_elem = main_elem.querySelector( '#finish' );
          var  timer_elem = main_elem.querySelector( '#timer'  );

          // remove unneeded buttons
          if ( !my.cancel_button ) self.ccm.helper.removeElement( cancel_elem );
          if ( !my.feedback      ) self.ccm.helper.removeElement( submit_elem );

          // add content for inner containers
          renderKeywords();
          renderText();
          updateButtons();
          renderTimer();

          // set content of own website area
          self.ccm.helper.setContent( self.element, main_elem );

          // has individual 'start' callback? => perform it
          if ( self.onstart ) self.onstart( self );

          /**
           * @summary renders given keywords for text gaps
           * @description
           * Keywords could be given (individual) via instance configuration (my.keywords is string array)
           * or (automatic generated) via private variable 'keywords' (my.keywords is boolean true).
           */
          function renderKeywords() {

            /**
             * container for keywords
             * @type {Element}
             */
            var keywords_elem = main_elem.querySelector( '#keywords' );

            /**
             * contains inner container for each keyword
             * @type {Array}
             */
            var entries = [];

            // has information data for keywords? => create inner container for each keyword
            if ( my.keywords ) ( Array.isArray( my.keywords ) ? my.keywords : keywords ).map( addKeyword );
            // no given keywords? => remove container for keywords and abort
            else return self.ccm.helper.removeElement( keywords_elem );

            // generated keyword list? => sort keywords lexicographical (keyword order gives no hint about correct solution)
            if ( my.keywords === true ) entries.sort( function ( a, b ) { return a.innerHTML.localeCompare( b.innerHTML ) } );

            // add each inner keyword container to container for keywords
            entries.map( function ( entry ) { keywords_elem.appendChild( entry ); } );

            /** adds a inner container for a keyword */
            function addKeyword( keyword ) {
              entries.push( self.ccm.helper.html( my.html.keyword, Array.isArray( my.keywords ) ? keyword : keyword.word ) );
            }

          }

          /** renders the fill-in-the-blank text */
          function renderText() {

            // render text with containing gaps
            text_elem.innerHTML = my.text;

            // iterate over all gap => render input field into each gap
            self.ccm.helper.makeIterable( main_elem.querySelectorAll( '.gap' ) ).map( function ( gap_elem, i ) {

              // blank input fields and shown keywords? => input fields should give no hint for the length of the searched word
              if ( my.blank && my.keywords ) return gap_elem.appendChild( self.ccm.helper.html( { tag: 'input', type: 'text', oninput: onInput, onchange: onChange } ) );

              // shorter access to keyword
              var keyword = keywords[ i ].word;

              // prepare ccm HTML data for the input field
              var input = {
                tag: 'input',
                type: 'text',
                oninput: onInput,
                onchange: onChange,
                maxlength: keyword.length,
                size: keyword.length * 1.5  // works tolerably for words with a length up to 30
              };

              // no blank input fields? => set placeholder attribute (gives informations about the characters of the searched word)
              if ( !my.blank ) {
                input.placeholder = '';
                for ( var j = 0; j < keyword.length; j++ )
                  input.placeholder += Math.pow( 2, j ) & keywords[ i ].givens ? keyword.charAt( j ) : '_';
              }

              // render input field in the current gap
              gap_elem.appendChild( self.ccm.helper.html( input ) );

              /** callback for 'input' event */
              function onInput() {

                /**
                 * event data (contains informations about the input field)
                 * @type {object}
                 */
                var event_data = { gap: 1 + i, input: this.value };

                // has logger instance? => log 'input' event
                if ( self.logger ) self.logger.log( 'input', event_data );

                // has individual 'input' callback? => perform it
                if ( self.oninput ) self.oninput( self, event_data );

              }

              /** callback for 'change' event */
              function onChange() {

                /**
                 * event data (contains informations about the input field)
                 * @type {object}
                 */
                var event_data = { gap: 1 + i, input: this.value };

                // has logger instance? => log 'change' event
                if ( self.logger ) self.logger.log( 'change', event_data );

                // has individual 'change' callback? => perform it
                if ( self.onchange ) self.onchange( self, event_data );

              }

            } );

          }

          /** (re)renders the buttons */
          function updateButtons() {

            // render 'cancel' button (if needed)
            if ( my.cancel_button ) self.ccm.helper.setContent( cancel_elem, self.ccm.helper.html( my.html.button, {
              disabled: '',
              caption: my.captions.cancel,
              click: function () { if ( self.oncancel ) self.oncancel( self ); else self.start( callback ); }
            } ) );

            // render 'submit' button (if needed)
            if ( my.feedback ) self.ccm.helper.setContent( submit_elem, self.ccm.helper.html( my.html.button, {
              disabled: results.details.length > 0 || '',
              caption: my.captions.submit,
              click: evaluate
            } ) );

            // render 'finish' button
            self.ccm.helper.setContent( finish_elem, self.ccm.helper.html( my.html.button, {
              disabled: '',
              caption: my.captions.finish,
              click: onFinish
            } ) );

            /** evaluates the fill-in-the-blank text and shows feedback */
            function evaluate() {

              // iterate over all gap input fields
              self.ccm.helper.makeIterable( main_elem.querySelectorAll( '.gap input' ) ).map( function ( gap, i ) {

                /**
                 * event data (contains informations about the input field)
                 * @type {object}
                 */
                var event_data = { gap: 1 + i, input: gap.value };

                // determine correctness of the user input value
                var nearly = gap.value.toLowerCase().trim() === keywords[ i ].word.toLowerCase().trim();
                var correct = gap.value === keywords[ i ].word;

                // has individual 'validation' callback? => perform it (reset evaluation if user input value is not valid)
                if ( self.onvalidation && !self.onvalidation( self, self.ccm.helper.clone( event_data ) ) ) return results.details = [];

                // add solution information to event data
                event_data.solution = keywords[ i ].word;

                // give visual feedback for correctness
                gap.disabled = true;
                if ( !nearly ) gap.value = '';
                gap.setAttribute( 'placeholder', keywords[ i ].word );
                gap.parentNode.classList.add( correct ? 'correct' : ( nearly ? 'nearly' : 'wrong' ) );

                // set detail informations for current gap result
                results.details.push( event_data );

              } );

              // no evaluation results? => abort
              if ( results.details.length === 0 ) return;

              // has logger instance? => log 'feedback' event
              if ( self.logger ) self.logger.log( 'feedback', results );

              // has individual 'feedback' callback? => perform it
              if ( self.onfeedback ) self.onfeedback( self, self.ccm.helper.clone( results ) );

              updateButtons();

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

          /** finishes the fill-in-the-blank text */
          function onFinish() {

            // has user instance? => login user (if not already logged in)
            if ( self.user ) self.user.login( proceed ); else proceed();

            function proceed() {

              // make sure that user could not use 'finish' button again
              self.ccm.helper.removeElement( finish_elem );
              self.ccm.helper.removeElement(  timer_elem );

              // finalize result data
              if ( self.user ) results.user = self.user.data().user;

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