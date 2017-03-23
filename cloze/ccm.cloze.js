/**
 * @overview <i>ccm</i> component for fill-in-the-blank texts
 * @author André Kless <andre.kless@web.de> 2017
 * @license The MIT License (MIT)
 *
 * Notes
 * - disadvantage of bit operation: possible positions for given letters in a word are 0-31
 */

ccm.component( {

  name: 'cloze',

  config: {

    text: 'Hello, [[(W)o(rl)d]]!',
    html_templates: {
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
    css_layout: [ ccm.load, '../cloze/layouts/default.css' ],
    ccm_helper: [ ccm.load, '../../ccm-developer-no-jquery/ccm/ccm-helper.js' ],
    onfinish: function ( instance, results ) { console.log( results ); }

//  blank: true,
//  ignore_case: true,
//  keywords: [ 'keyword1', 'keyword2', ... ],
//  points_per_gap: 1,
//  time: 60,
//  button_caption: 'finish',
//  user: [ ccm.instance, '../user/ccm.user.js' ],
//  logger: [ ccm.instance, '../log/ccm.log.js', [ ccm.get, '../log/configs.json', 'greedy' ] ],
//  onchange: function ( instance, data ) { console.log( data ); }
//  oninput: function ( instance, data ) { console.log( data ); }

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
      my = ccm.helper.privatize( self );

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

        // determine given characters and hold this information in a single number (use of bit operations)
        var givens = 0;
        for ( var i = 0; i < keyw__d.length; i++ )
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

      // initial result data
      var results = { points: 0, max_points: 0, details: [] };

      // prepare main HTML structure
      var main_elem = ccm.helper.html( my.html_templates.main, onFinish );

      var   text_elem  = main_elem.querySelector( '#text'   );  // container for text with containing gaps
      var button_elem  = main_elem.querySelector( '#button' );  // container for finish button
      var  timer_elem  = main_elem.querySelector( '#timer'  );  // container for timer
      var  timer_value = my.time;                               // timer value

      // add content for inner containers
      renderKeywords();
      renderText();
      renderButton();
      if ( my.time ) renderTimer(); else ccm.helper.removeElement( timer_elem );

      // remember start time
      var time = new Date().getTime();

      // set content of own website area
      ccm.helper.setContent( self.element, ccm.helper.protect( main_elem ) );

      // has logger instance? => log start event
      if ( self.logger ) self.logger.log( 'start', my );

      if ( callback ) callback();

      /** renders given keywords for text gaps */
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
          entries.push( ccm.helper.html( my.html_templates.keyword, Array.isArray( my.keywords ) ? keyword : keyword.word ) );
        }

      }

      /** renders the text with containing gaps */
      function renderText() {

        // render text with containing gaps
        text_elem.innerHTML = my.text;

        // render input field in each gap
        ccm.helper.makeIterable( main_elem.querySelectorAll( '.gap' ) ).map( function ( gap_elem, i ) {

          // blank input fields and shown keywords? => input fields should give no hint for the length of the searched word
          if ( my.blank && my.keywords ) return gap_elem.appendChild( ccm.helper.html( { tag: 'input', type: 'text', oninput: onInput, onchange: onChange } ) );

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
          gap_elem.appendChild( ccm.helper.html( input ) );

          /** onchange callback for input fields */
          function onChange() {

            var data = { gap: 1 + i, input: this.value };  // input field informations

            // has logger instance? => log change event
            if ( self.logger ) self.logger.log( 'change', data );

            // has individual change callback? => perform it
            if ( my.onchange ) my.onchange( self, data );

          }

          /** oninput callback for input fields */
          function onInput() {

            var data = { gap: 1 + i, input: this.value };  // input field informations

            // has logger instance? => log input event
            if ( self.logger ) self.logger.log( 'input', data );

            // has individual input callback? => perform it
            if ( my.oninput ) my.oninput( self, data );

          }

        } );

      }

      /** renders the finish button */
      function renderButton() {

        ccm.helper.setContent( button_elem, ccm.helper.html( my.html_templates.button, {
          caption: my.button_caption,
          click:   onFinish
        } ) );
        if ( !my.button_caption ) button_elem.querySelector( 'input[type=submit]' ).removeAttribute( 'value' );

      }

      /** renders the timer */
      function renderTimer() {

        timer();  // start timer

        /** updates countdown timer */
        function timer() {

          // already finished? => remove timer
          if ( !main_elem.querySelector( '#timer' ) ) return;

          // (re)render timer value
          ccm.helper.setContent( timer_elem, ccm.helper.html( my.html_templates.timer, timer_value ) );

          // countdown
          if ( timer_value-- )
            ccm.helper.wait( 1000, timer );
          else if ( button_elem )
            onFinish();           // perform finish callback at timeout

        }

      }

      /** onclick callback for finish button */
      function onFinish( event ) {

        // prevent page reload
        if ( event ) event.preventDefault();

        time = new Date().getTime() - time;       // calculate result time
        button_elem.innerHTML = '';               // remove button
        ccm.helper.removeElement( timer_elem  );  // remove timer container

        // has user instance? => login user
        if ( self.user ) self.user.login( proceed ); else proceed();

        function proceed() {

          // give visual feedback for correctness
          ccm.helper.makeIterable( main_elem.querySelectorAll( '.gap input' ) ).map( function ( gap, i ) {
            var correct = my.ignore_case ? gap.value.toLowerCase() === keywords[ i ].word.toLowerCase() : gap.value === keywords[ i ].word;
            gap.removeAttribute( 'placeholder' );
            gap.parentNode.className += correct ? ' correct' : ' wrong';

            // correct input? => give points
            if ( my.points_per_gap ) {
              results.max_points += my.points_per_gap;
              if ( correct ) results.points += my.points_per_gap;
            }

            // set details for current gap result
            results.details.push( { input: gap.value, solution: keywords[ i ].word, correct: correct } );

          } );

          // finalize result data
          if ( !my.points_per_gap ) { delete results.points; delete results.max_points; }
          if ( self.user ) results.user = self.user.data().key;
          if (   my.time ) results.time_left = timer_value + 1;
          results.time = time;

          // has logger instance? => log finish event
          if ( self.logger ) self.logger.log( 'finish', results );

          // provide result data
          ccm.helper.onFinish( self, results );

        }

      }

    };

  }

} );