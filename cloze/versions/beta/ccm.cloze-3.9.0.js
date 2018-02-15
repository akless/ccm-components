/**
 * @overview ccm component for rendering a fill-in-the-blank text
 * @author André Kless <andre.kless@web.de> 2017-2018
 * @license The MIT License (MIT)
 * @version 3.9.0
 * @changes
 * version 3.9.0 (15.01.2018):
 * - strikethrough of solution words
 * - uses ccm v15.0.2 (beta)
 * version 3.8.0 (15.01.2018): input fields for gaps are customizable
 * version 3.7.0 (09.01.2018):
 * - support of retry after submit
 * - length of an input field also adapts when pasting
 * - adding of getValue()
 * version 3.6.0 (08.01.2018):
 * - use .trim() from the beginning for solution words
 * - disable auto correction and auto capitalization for input fields
 * - uses ccm v14.3.0
 * version 3.5.0 (18.12.2017):
 * - updates in default HTML templates
 * version 3.4.0 (27.11.2017):
 * - resizable input fields by typing (pull request by Tea Kless)
 * version 3.3.0 (18.11.2017):
 * - reference text gaps like [[#1]]
 * - reference text gaps with more than one solution word are only correct if each user input is different
 * - bugfix for 'validation' callback
 * - event data contains more informations
 * - outgoing event data is always cloned (except for 'validation' callback)
 * version 3.2.1 (17.11.2017):
 * - bugfix for length of text gaps
 * - no cleared text gap on correctness only feedback
 * version 3.2.0 (13.11.2017):
 * - customizable caption for start button
 * version 3.1.0 (10.11.2017):
 * - more than one solution word for a gap
 * version 3.0.0 (10.11.2017):
 * - uses ECMAScript 6 syntax
 * - uses ccm v12.12.0
 * (for older version changes see ccm.cloze.js-2.2.0.js)
 */

{
  var component = {

    /**
     * unique component name
     * @type {string}
     */
    name: 'cloze',

    /**
     * component version
     * @type {number[]}
     */
    version: [ 3, 9, 0 ],

    /**
     * reference to used framework version
     * @type {object}
     */
    ccm: {
      url: 'https://akless.github.io/ccm/version/beta/ccm-15.0.2.min.js',
      integrity: 'sha384-53Peq0VgpD1mglN0AfJov+xrQofgUepSeq1giq7auX2rEnuFJCV/0gKQznr35xwt',
      crossorigin: 'anonymous'
    },

    /**
     * default instance configuration
     * @type {object}
     */
    config: {

      "html": {
        "start": {
          "id": "start",
          "inner": {
            "tag": "button",
            "inner": "%caption%",
            "onclick": "%click%"
          }
        },
        "main": {
          "id": "main",
          "inner": [
            {
              "class": "row",
              "id": "keywords"
            },
            {
              "id": "box",
              "class": "row",
              "inner": [
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
            }
          ]
        },
        "keyword": {
          "class": "keyword",
          "inner": "%keyword%",
          "onclick": "%click%"
        },
        "input": {
          "tag": "input",
          "type": "text",
          "size": 10,
          "autocorrect": "off",
          "autocapitalize": "none",
          "required": true,
          "oninput": "%oninput%",
          "onchange": "%onchange%"
        },
        "button": {
          "tag": "button",
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
        "start": "Start",
        "cancel": "Cancel",
        "submit": "Submit",
        "retry": "Retry",
        "finish": "Finish"
      }

  //  start_button: true,
  //  keywords: [ 'keyword1', 'keyword2', ... ],
  //  blank: true,
  //  time: 60,
  //  feedback: true,
  //  retry: true
  //  solutions: true,
  //  cancel_button: true,
  //  user:   [ 'ccm.instance', 'https://akless.github.io/ccm-components/user/versions/ccm.user-2.0.0.min.js' ],
  //  logger: [ 'ccm.instance', 'https://akless.github.io/ccm-components/log/versions/ccm.log-1.0.0.min.js', [ 'ccm.get', 'https://akless.github.io/ccm-components/log/resources/configs.min.js', 'greedy' ] ],
  //  onstart: function ( instance ) { console.log( 'Fill-in-the-blank text started' ); },
  //  oncancel: function ( instance ) { console.log( 'Fill-in-the-blank text canceled' ); },
  //  onvalidation: function ( instance, data ) { if ( data.gap % 2 ) data.correct = data.nearly = true; console.log( data ); },
  //  onfeedback: function ( instance, data ) { console.log( data ); },
  //  onchange: function ( instance, data ) { console.log( data ); },
  //  oninput:  function ( instance, data ) { console.log( data ); },
  //  onfinish: { "clear": true, "log": true },

    },

    /**
     * for creating instances out of this component
     * @constructor
     */
    Instance: function () {

      /**
       * own reference for inner functions
       * @type {Instance}
       */
      const self = this;

      /**
       * privatized instance members
       * @type {object}
       */
      let my;

      /**
       * shortcut to help functions
       * @type {Object.<string,function>}
       */
      let $;

      /**
       * information data for each keyword
       * @type {Array}
       */
      let keywords = [];

      /**
       * result data
       * @type {object}
       */
      let results = null;

      /**
       * is called once after all dependencies are solved and is then deleted
       * @param {function} callback - called after all synchronous and asynchronous operations are complete
       */
      this.init = callback => {

        // fill-in-the-blank text is given via inner HTML of own Custom Element? => use it with higher priority
        if ( self.inner && self.inner.innerHTML.trim() ) self.text = self.inner.innerHTML;

        callback();
      };

      /**
       * is called once after the initialization and is then deleted
       * @param {function} callback - called after all synchronous and asynchronous operations are complete
       */
      this.ready = callback => {

        // set shortcut to help functions
        $ = self.ccm.helper;

        // privatize all possible instance members
        my = $.privatize( self );

        const regex_keyword   = /\[\[.+?\]\]/g;  // regular expression for finding all gaps/keywords in the text
        const regex_given     = /\(.+?\)/g;      // regular expression for finding all given characters of a keyword
        const regex_reference = /^#(\d+)$/;      // regular expression for finding a gap reference

        // iterate all keywords in the text to determine the information data for each keyword
        ( my.text.match( regex_keyword ) || [] ).map( keyword => {

          // remove distinguishing characteristic '[[' and ']]'
          keyword = keyword.substr( 2, keyword.length - 4 );

          // the same as a previous gap? => use reference of previous gap
          if ( regex_reference.test( keyword ) ) return keywords.push( keywords[ keyword.substr( 1 ) - 1 ] );

          const entry = [];
          keyword.split( '|' ).map( keyword => entry.push( determineKeywordData( keyword.trim() ) ) );
          keywords.push( entry );

          function determineKeywordData( keyword ) {

            // replace all given characters of a keywords with '*'
            const keyw__d = keyword.replace( '*', '#' ).replace( regex_given, given => {
              const length = given.length - 2;
              given = '';
              for ( let i = 0; i < length; i++ )
                given += '*';
              return given;
            } );

            // determine given characters and hold this information in a single number (disadvantage: possible positions
            let givens = 0;                                                      // for given letters in a word are 0-31
            for ( let i = 0; i < keyw__d.length; i++ )                           // because of data type limitations)
              if ( keyw__d.charAt( i ) === '*' ) givens += Math.pow( 2, i );

            return {
              word: keyword.replace( regex_given, given => given.substr( 1, given.length - 2 ) ),
              givens: givens
            };

          }

        } );

        // replace gaps/keywords with empty span elements
        my.text = my.text.replace( regex_keyword, '<span class="gap"></span>' );

        callback();
      };

      /**
       * starts the instance
       * @param {function} [callback] - called after all synchronous and asynchronous operations are complete
       */
      this.start = callback => {

        // set initial result data
        results = { details: [] };

        // has logger instance? => log 'render' event
        self.logger && self.logger.log( 'render' );

        // user must click on a start button before fill-in-the-blank text is starting? => render start button
        if ( my.start_button ) $.setContent( self.element, $.html( my.html.start, { caption: my.captions.start, click: start } ) );
        // no need for a start button? => start fill-in-the-blank text directly
        else start();

        // rendering completed => perform callback
        callback && callback();

        /** starts the fill-in-the-blank text */
        function start() {

          // has logger instance? => log 'start' event
          self.logger && self.logger.log( 'start', $.clone( my ) );

          // prepare main HTML structure
          const main_elem = $.html( my.html.main );

          // select inner containers (mostly for buttons)
          const   text_elem = main_elem.querySelector( '#text'   );
          const cancel_elem = main_elem.querySelector( '#cancel' );
          const submit_elem = main_elem.querySelector( '#submit' );
          const finish_elem = main_elem.querySelector( '#finish' );
          const  timer_elem = main_elem.querySelector( '#timer'  );

          // remove unneeded buttons
          !my.cancel_button && $.removeElement( cancel_elem );
          !my.feedback      && $.removeElement( submit_elem );

          // add content for inner containers
          renderKeywords();
          renderText();
          renderInitialButtons();
          renderTimer();

          // set content of own website area
          $.setContent( self.element, main_elem );

          // has individual 'start' callback? => perform it
          self.onstart && self.onstart( self );

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
            const keywords_elem = main_elem.querySelector( '#keywords' );

            // rendering of given keywords not wanted? => abort and remove container for keywords and abort
            if ( !my.keywords ) return $.removeElement( keywords_elem );

            /**
             * contains inner container for each keyword
             * @type {Array}
             */
            const entries = [];

            // prepare keyword containers
            ( my.keywords === true ? keywords : my.keywords ).map( keyword => {
              entries.push( $.html( my.html.keyword, {
                keyword: my.keywords === true ? keyword[ 0 ].word : keyword,
                click: function () { this.classList.toggle( 'marked' ); }
              } ) );
            } );

            // generated keyword list? => sort keywords lexicographical (keyword order gives no hint about correct solution)
            if ( my.keywords === true )
              entries.sort( ( a, b ) => a.innerHTML.localeCompare( b.innerHTML ) );

            // add each inner keyword container to container for keywords
            entries.map( entry => keywords_elem.appendChild( entry ) );

          }

          /** renders the fill-in-the-blank text */
          function renderText() {

            // render text with containing gaps
            text_elem.innerHTML = my.text;

            let size = 0;
            keywords.map( keyword => keyword.map( keyword => {
              if ( keyword.word.length > size ) size = keyword.word.length;
            } ) );

            // iterate over all gap => render input field into each gap
            [ ...main_elem.querySelectorAll( '.gap' ) ].map( ( gap_elem, i ) => {

              // prepare ccm HTML data for the input field
              const input = $.html( my.html.input, { oninput: onInput, onchange: onChange } );

              // resizing of the input field
              input.onkeypress = input.onkeydown = function () { this.size = this.value.length > 10 ? this.value.length : 10; };
              input.onpaste = function () { $.wait( 0, () => this.size = this.value.length > 10 ? this.value.length : 10 ); };

              // no blank input fields? => set placeholder attribute (gives informations about the characters of the searched word)
              if ( !my.blank ) {
                const keyword = keywords[ i ][ 0 ].word;
                input.placeholder = '';
                for ( let j = 0; j < keyword.length; j++ )
                  input.placeholder += Math.pow( 2, j ) & keywords[ i ][ 0 ].givens ? keyword.charAt( j ) : '_';
              }

              // render input field in the current gap
              gap_elem.appendChild( $.html( input ) );

              /** callback for 'input' event */
              function onInput() {

                /**
                 * event data (contains informations about the input field)
                 * @type {object}
                 */
                const event_data = { gap: 1 + i, input: this.value };

                // has logger instance? => log 'input' event
                self.logger && self.logger.log( 'input', $.clone( event_data ) );

                // has individual 'input' callback? => perform it
                self.oninput && self.oninput( self, $.clone( event_data ) );

              }

              /** callback for 'change' event */
              function onChange() {

                /**
                 * event data (contains informations about the input field)
                 * @type {object}
                 */
                const event_data = { gap: 1 + i, input: this.value };

                // has logger instance? => log 'change' event
                self.logger && self.logger.log( 'change', $.clone( event_data ) );

                // has individual 'change' callback? => perform it
                self.onchange && self.onchange( self, $.clone( event_data ) );

              }

            } );
          }

          /** renders the buttons */
          function renderInitialButtons() {

            // render 'cancel' button (if needed)
            my.cancel_button && renderButton( cancel_elem, my.captions.cancel, () => self.oncancel ? self.oncancel( self ) : self.start( callback ) );

            // render 'submit' button (if needed)
            my.feedback && renderButton( submit_elem, my.captions.submit, evaluate );

            // render 'finish' button (if needed)
            self.onfinish && renderButton( finish_elem, my.captions.finish, onFinish );

          }

          /** renders the timer */
          function renderTimer() {

            // no limited time? => remove timer button and abort
            if ( !my.time || ( !self.onfinish && !my.feedback ) ) return $.removeElement( timer_elem );

            /**
             * given seconds for working with the quiz
             * @type {number}
             */
            let timer_value = my.time;

            // start timer
            timer();

            /** updates countdown timer (recursive function) */
            function timer() {

              // no existing finish button? => stop timer
              if ( !finish_elem ) return;

              // (re)render timer value
              $.setContent( timer_elem, $.html( my.html.timer, timer_value ) );

              // countdown
              if ( timer_value-- )
                $.wait( 1000, timer );    // recursive call
              else
                my.feedback ? evaluate() : onFinish();  // finish at timeout

            }

          }

          /** evaluates the fill-in-the-blank text and shows feedback */
          function evaluate() {

            // set initial state for detail informations of the gap results
            results.details = [];

            // iterate over all gap input fields
            [ ...main_elem.querySelectorAll( '.gap input' ) ].map( ( gap, i ) => {

              /**
               * event data (contains informations about the input field)
               * @type {object}
               */
              const event_data = {
                gap:      1 + i,      // number of the text gap
                input:    gap.value,  // user input
                solution: [],         // list of correct solution words
                correct:  false,      // true: correct user input value
                nearly:   false       // true: almost correct user input value
              };

              // add solution information to event data
              event_data.solution = [];
              keywords[ i ].map( keyword => {
                event_data.solution.push( keyword.word );

                // determine correctness of the user input value
                if ( keyword.used ) return;
                gap.value = gap.value.trim();
                if ( gap.value === keyword.word ) event_data.correct = true;
                if ( gap.value.toLowerCase() === keyword.word.toLowerCase() ) { event_data.nearly = true; keyword.used = true; }
                self.onvalidation && !self.onvalidation( self, event_data );  // has individual 'validation' callback? => perform it
              } );

              // give visual feedback for correctness
              gap.disabled = true;
              if ( !event_data.nearly && my.solutions ) gap.value = '';
              if ( my.solutions ) {
                let placeholder = '';
                for ( let j = 0; j < keywords[ i ].length; j++ )
                  if ( !keywords[ i ][ j ].used ) { placeholder = keywords[ i ][ j ].word; break; }
                gap.setAttribute( 'placeholder', placeholder );
                placeholder.length <= 0 ? gap.size = gap.value.length : gap.size = placeholder.length;
              }
              gap.parentNode.classList.add( event_data.correct ? 'correct' : ( event_data.nearly ? 'nearly' : 'wrong' ) );

              // set detail informations for current gap result
              results.details.push( event_data );

            } );

            // restore original keywords information data
            keywords.map( keyword => keyword.map( keyword => delete keyword.used ) );

            // no evaluation results? => abort
            if ( results.details.length === 0 ) return;

            // has logger instance? => log 'feedback' event
            self.logger && self.logger.log( 'feedback', $.clone( results ) );

            // has individual 'feedback' callback? => perform it
            self.onfeedback && self.onfeedback( self, $.clone( results ) );

            // change buttons
            updateButtons( true );

          }

          /** removes the feedback and enables the input fields */
          function retry() {

            // iterate over all gap input fields
            [ ...self.element.querySelectorAll( '.gap' ) ].map( gap => {

              // remove visual feedback
              gap.classList.remove( 'correct', 'nearly', 'wrong' );
              const input = gap.querySelector( 'input' );
              input.disabled = false;

            } );

            // has logger instance? => log 'retry' event
            self.logger && self.logger.log( 'retry' );

            // change buttons
            updateButtons( false );

          }

          /**
           * (re)renders the buttons
           * @param {boolean} evaluated - fill-in-the-blank text is evaluated
           */
          function updateButtons( evaluated ) {

            // no visual feedback? => abort
            if ( !my.feedback ) return;

            // the fill-in-the-blank text is not evaluated? => render 'submit' button
            if ( !evaluated )
              renderButton( submit_elem, my.captions.submit, evaluate );
            // evaluated and retry is allowed? => render 'retry' button
            else if ( my.retry && !my.solutions )
              renderButton( submit_elem, my.captions.retry, retry );
            // evaluated without retry? => disable 'submit' button
            else
              submit_elem.querySelector( 'button' ).disabled = true;

          }

          /** renders a single button */
          function renderButton( element, caption, click ) {

            $.setContent( element, $.html( my.html.button, {
              caption: caption,
              click: click
            } ) );

          }

          /** finishes the fill-in-the-blank text */
          function onFinish() {

            // no finish button? => abort
            if ( !self.onfinish ) return;

            // has user instance? => login user (if not already logged in)
            if ( self.user ) self.user.login( proceed ); else proceed();

            function proceed() {

              // no evaluation results? => evaluate fill-in-the-blank text
              results.details.length === 0 && evaluate();

              // make sure that user could not use 'finish' button again
              $.removeElement( finish_elem );
              $.removeElement(  timer_elem );

              // finalize result data
              if ( self.user ) results.user = self.user.data().name;

              // has logger instance? => log 'finish' event
              self.logger && self.logger.log( 'finish', $.clone( results ) );

              // perform 'finish' actions and provide result data
              $.onFinish( self, results );

            }

          }

        }

      };

      /**
       * returns the current result data
       * @returns {object} current result data
       */
      this.getValue = () => results;

    }

  };

  function p(){window.ccm[v].component(component)}const f="ccm."+component.name+(component.version?"-"+component.version.join("."):"")+".js";if(window.ccm&&null===window.ccm.files[f])window.ccm.files[f]=component;else{const n=window.ccm&&window.ccm.components[component.name];n&&n.ccm&&(component.ccm=n.ccm),"string"==typeof component.ccm&&(component.ccm={url:component.ccm});var v=component.ccm.url.split("/").pop().split("-");if(v.length>1?(v=v[1].split("."),v.pop(),"min"===v[v.length-1]&&v.pop(),v=v.join(".")):v="latest",window.ccm&&window.ccm[v])p();else{const e=document.createElement("script");document.head.appendChild(e),component.ccm.integrity&&e.setAttribute("integrity",component.ccm.integrity),component.ccm.crossorigin&&e.setAttribute("crossorigin",component.ccm.crossorigin),e.onload=function(){p(),document.head.removeChild(e)},e.src=component.ccm.url}}
}