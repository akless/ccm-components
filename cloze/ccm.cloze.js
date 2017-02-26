/**
 * @overview <i>ccm</i> component for fill-in-the-blank texts
 * @author André Kless <andre.kless@web.de> 2017
 * @license The MIT License (MIT)
 *
 * Notes
 * - disadvantage of bit operation: possible positions for given letters in a word are 0-31
 * - onFinish could also be a destination object
 */

ccm.component( {

  name: 'cloze',

  config: {

    text: 'Hello, [[(W)o(rl)d]]!',
    html_templates: {
      "main": {
        "key": "main",
        "class": "main",
        "inner": [
          { "class": "keywords" },
          { "class": "text" },
          { "class": "button" },
          { "class": "timer" }
        ]
      },
      "keyword": {
        "class": "keyword",
        "inner": "%%"
      },
      "button": {
        "key": "button",
        "tag": "button",
        "inner": "%caption%",
        "onclick": "%click%"
      },
      "timer": {
        "key": "timer",
        "tag": "span",
        "inner": "%%"
      }
    },
    css_layout: [ ccm.load, '../cloze/layouts/default.css' ],
    ccm_helper: [ ccm.load, '../../ccm-developer-no-jquery/ccm/ccm-helper.js' ],
    button_caption: 'finish',
    onFinish: function ( instance, result ) { console.log( result ); }

//  blank: true,
//  ignore_case: true,
//  keywords: [ 'keyword1', 'keyword2', ... ],
//  points_per_gap: 1,
//  time: 60,
//  user: [ ccm.instance, '../user/ccm.user.js' ]

  },

  Instance: function () {

    var self = this;
    var my;

    var keywords = [];  // information data for each keyword

    this.init = function ( callback ) {

      // privatize all possible instance members
      my = ccm.helper.privatize( self );

      callback();
    };

    this.ready = function ( callback ) {

      // fill-in-the-blank text is given via inner HTML? => use it with higher priority
      if ( self.node && self.node.innerHTML.trim() ) my.text = self.node.innerHTML;

      var regex_keyword = /\[\[.+?\]\]/g;   // regular expression for finding all gaps/keywords in the text
      var regex_given = /\(.+?\)/g;         // regular expression for finding all given characters of a keyword

      // iterate all keywords in the text
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

    this.render = function ( callback ) {

      // initial result data
      var result = { points: 0, max_points: 0, details: [] };

      // render main HTML structure
      ccm.helper.setContent( self.element, ccm.helper.protect( ccm.helper.html( my.html_templates.main ) ) );

      var   main_elem  = self.element.querySelector( '.main'   );  // main container
      var button_elem  = self.element.querySelector( '.button' );  // container for finish button
      var  timer_elem  = self.element.querySelector( '.timer'  );  // container for timer
      var  timer_value = my.time;                                  // timer value

      // render content for inner containers
      renderKeywords();
      renderText();
      renderButton();
      if ( my.time ) renderTimer(); else ccm.helper.removeElement( timer_elem );

      // remember start time
      var time = new Date().getTime();

      if ( callback ) callback();

      /** renders given keywords for text gaps */
      function renderKeywords() {

        var keywords_elem = self.element.querySelector( '.keywords' );  // container for keywords
        var entries = [];                                               // inner container for each keyword

        // has given keywords? => create inner container for each keyword
        if ( my.keywords )
          ( Array.isArray( my.keywords ) ? my.keywords : keywords ).map( addKeyword );
        else
          return main_elem.removeChild( keywords_elem );  // no given keywords? => remove container for keywords

        // generated keyword list? => sort keywords lexicographical (keyword order gives no hint about correct solution)
        if ( my.keywords === true ) entries.sort( function ( a, b ) { return a.innerHTML.localeCompare( b.innerHTML ) } );

        // add each inner keyword container to container for keywords
        entries.map( function ( entry ) { keywords_elem.appendChild( ccm.helper.protect( entry ) ); } );

        /** adds a inner container for a keyword */
        function addKeyword( keyword ) {
          entries.push( ccm.helper.html( my.html_templates.keyword, Array.isArray( my.keywords ) ? keyword : keyword.word ) );
        }

      }

      /** renders the text with containing gaps */
      function renderText() {

        // render text with containing gaps
        self.element.querySelector( '.text' ).innerHTML = ccm.helper.protect( my.text );

        // render input field in each gap
        ccm.helper.makeIterable( self.element.querySelectorAll( '.gap' ) ).map( function ( gap_elem, i ) {

          // blank input fields and shown keywords? => input fields should give no hint for the length of the searched word
          if ( my.blank && my.keywords ) return gap_elem.appendChild( ccm.helper.html( { tag: 'input', type: 'text' } ) );

          // shorter access to keyword
          var keyword = keywords[ i ].word;

          // prepare ccm HTML data for input field
          var input = {
            tag: 'input',
            type: 'text',
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

        } );

      }

      /** renders the finish button */
      function renderButton() {

        ccm.helper.setContent( button_elem, ccm.helper.protect( ccm.helper.html( my.html_templates.button, {
          caption: my.button_caption,
          click:   onFinish
        } ) ) );

      }

      /** renders the timer */
      function renderTimer() {

        timer();  // start timer

        /** updates countdown timer */
        function timer() {

          // already finished? => remove timer
          if ( !self.element.querySelector( '.timer' ) ) return;

          // (re)render timer value
          ccm.helper.setContent( timer_elem, ccm.helper.protect( ccm.helper.html( my.html_templates.timer, timer_value ) ) );

          // countdown
          if ( timer_value-- )
            ccm.helper.wait( 1000, timer );
          else if ( button_elem )
            onFinish();           // perform finish callback at timeout

        }

      }

      /** onclick callback for finish button */
      function onFinish() {

        time = new Date().getTime() - time;       // calculate result time
        button_elem.innerHTML = '';               // remove button
        ccm.helper.removeElement( timer_elem  );  // remove timer container

        // has user instance? => login user
        if ( self.user ) self.user.login( proceed ); else proceed();

        function proceed() {

          // give visual feedback for correctness
          ccm.helper.makeIterable( self.element.querySelectorAll( '.gap input' ) ).map( function ( gap, i ) {
            var correct = my.ignore_case ? gap.value.toLowerCase() === keywords[ i ].word.toLowerCase() : gap.value === keywords[ i ].word;
            gap.removeAttribute( 'placeholder' );
            gap.parentNode.className += correct ? ' correct' : ' wrong';

            // correct input? => give points
            if ( my.points_per_gap ) {
              result.max_points += my.points_per_gap;
              if ( correct ) result.points += my.points_per_gap;
            }

            // set details for current gap result
            result.details.push( { input: gap.value, solution: keywords[ i ].word, correct: correct } );

          } );

          // finalize result data
          if ( !my.points_per_gap ) { delete result.points; delete result.max_points; }
          if ( self.user ) result.user = self.user.data().key;
          if (   my.time ) result.time_left = timer_value + 1;
          result.time = time;

          // provide result data
          if ( ccm.helper.isObject( self.onFinish ) )
            ccm.helper.setDataset( result, self.onFinish, self.user );
          else
            self.onFinish( self, result );

        }

      }

    };

  }

} );