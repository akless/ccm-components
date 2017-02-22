/**
 * @overview <i>ccm</i> component for clozes
 * @author André Kless <andre.kless@web.de> 2017
 * @license The MIT License (MIT)
 *
 * Notes
 * - text with gaps could be given in 3 possible ways
 * - keywords for gaps could be given in 3 possible ways
 * - disadvantage of bit operation: possible positions for given letters in a word are 0-31
 */

ccm.component( {

  name: 'cloze',

  config: {
  //blank: true
  //button: 'submit',
    data: {
      store: [ ccm.store, '../cloze/datastore.json' ],
      key: 'default'
    },
    html:  [ ccm.store, '../cloze/templates.json' ],
  //keywords: [ 'keyword1', 'keyword2', ... ]
    style: [ ccm.load, '../cloze/layout.css' ]
  },

  Instance: function () {

    var self = this;
    var my;

    var dataset;        // dataset for rendering
    var keywords = [];  // information data for each keyword

    this.init = function ( callback ) {

      // privatize all possible instance members
      my = ccm.helper.privatize( self );

      callback();
    };

    this.ready = function ( callback ) {

      // get dataset for rendering
      ccm.helper.dataset( my.data, function ( result ) {
        dataset = result;

        // determine text with containing gaps
        if ( dataset ) my.text = dataset.text;
        if ( self.node.innerHTML.trim() ) my.text = self.node.innerHTML;

        var regex_keyword = /\[\[.+?\]\]/g;   // regular expression for finding all gaps/keywords in the text
        var regex_given = /\(.+?\)/g;         // regular expression for finding all given characters of a keyword

        // iterate all keywords in the text
        my.text.match( regex_keyword ).map( function ( keyword ) {

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
        my.text = my.text.replace( regex_keyword, '<span class="cloze_gap"></span>' );

        // preload HTML templates
        my.html.get( callback );

      } );

    };

    this.render = function ( callback ) {

      // render main HTML structure
      self.element.innerHTML = '';
      self.element.appendChild( ccm.helper.html( my.html.get( 'main' ) ) );
      var elem_main = self.element.querySelector( '.main' );

      renderKeywords();
      renderText();
      renderButton();

      if ( callback ) callback();

      /** renders given keywords for text gaps */
      function renderKeywords() {

        var elem_keywords = self.element.querySelector( '.keywords' );  // container for keywords
        var entries = [];                                               // inner container for each keyword

        // has given keywords? => create inner container for each keyword
        if ( my.keywords )
          ( Array.isArray( my.keywords ) ? my.keywords : keywords ).map( addKeyword );
        else
          return elem_main.removeChild( elem_keywords );  // no given keywords? => remove container for keywords

        // generated keyword list? => sort keywords lexicographical (keyword order gives no hint about correct solution)
        if ( my.keywords === true ) entries.sort( function ( a, b ) { return a.innerHTML.localeCompare( b.innerHTML ) } );

        // add each inner keyword container to container for keywords
        entries.map( function ( entry ) { elem_keywords.appendChild( entry ); } );

        /** adds a inner container for a keyword */
        function addKeyword( keyword ) {
          entries.push( ccm.helper.html( { class: 'keyword', inner: Array.isArray( my.keywords ) ? keyword : keyword.word } ) );
        }

      }

      /** renders the text with containing gaps */
      function renderText() {

        // render text with containing gaps
        self.element.querySelector( '.text' ).innerHTML = my.text;

        // render input field in each gap
        ccm.helper.makeIterable( self.element.querySelectorAll( '.cloze_gap' ) ).map( function ( gap, i ) {

          // blank input fields and shown keywords? => input fields should give no hint for the length of the searched word
          if ( my.blank && my.keywords ) return gap.appendChild( ccm.helper.html( { tag: 'input', type: 'text' } ) );

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
          gap.appendChild( ccm.helper.html( input ) );

        } );

      }

      /** renders the submit button */
      function renderButton() {

        self.element.querySelector( '.button' ).appendChild( ccm.helper.html( my.html.get( 'button' ), {
          button: my.button || dataset.button,
          click: submit
        } ) );

        /** onclick callback for the submit button */
        function submit() {

          // give visual feedback for correctness
          ccm.helper.makeIterable( self.element.querySelectorAll( '.cloze_gap input' ) ).map( function ( gap, i ) {
            gap.removeAttribute( 'placeholder' );
            gap.style.backgroundColor = gap.value === keywords[ i ].word ? 'lime' : 'red';
          } );

        }

      }

    };

  }

} );