/**
 * @overview <i>ccm</i> component for clozes
 * @author André Kless <andre.kless@web.de> 2017
 * @license The MIT License (MIT)
 */

ccm.component( {

  name: 'cloze',

  config: {
  //blank
    data: {
      store: [ ccm.store, '../cloze/datastore.json' ],
      key: 'default'
    },
    html:  [ ccm.store, '../cloze/templates.json' ],
  //keywords
    style: [ ccm.load, '../cloze/layout.css' ]
  },

  Instance: function () {

    var self = this;
    var my;
    var text;
    var keywords = [];

    this.init = function ( callback ) {
      console.log( ccm.helper.clone( self ) );

      my = ccm.helper.privatize( self );

      ccm.helper.dataset( my.data, function ( dataset ) {

        if ( dataset ) my.text = dataset.text;
        if ( self.node.innerHTML.trim() ) my.text = self.node.innerHTML;

        callback();

      } );

    };

    this.ready = function ( callback ) {

      var regex_keyword = /\[\[.+?\]\]/g;
      var regex_given = /\(.+?\)/g;

      my.text.match( regex_keyword ).map( function ( keyword ) {

        keyword = keyword.substr( 2, keyword.length - 4 );

        var keyw__d = keyword.replace( '*', '#' ).replace( regex_given, function ( given ) {
          var length = given.length - 2;
          given = '';
          for ( var i = 0; i < length; i++ ) given += '*';
          return given;
        } );

        var givens = 0;
        for ( var i = 0; i < keyw__d.length; i++ )
          if ( keyw__d.charAt( i ) === '*' ) givens += Math.pow( 2, i );

        keywords.push( {
          word: keyword.replace( regex_given, function ( given ) { return given.substr( 1, given.length - 2 ); } ),
          givens: givens
        } );

      } );

      text = my.text.replace( regex_keyword, '<span class="cloze_gap"></span>' );
      my.html.get( 'main', callback );

    };

    this.render = function ( callback ) {

      renderMain();

      if ( callback ) callback();

      function renderMain() {

        self.element.innerHTML = '';
        self.element.appendChild( ccm.helper.html( my.html.get( 'main' ) ) );

        renderKeywords();
        renderText();
      }

      function renderKeywords() {

        var elem_main     = self.element.querySelector( '.main' );
        var elem_keywords = self.element.querySelector( '.keywords' );
        var entries = [];

        if ( my.keywords )
          ( Array.isArray( my.keywords ) ? my.keywords : keywords ).map( addKeyword );
        else
          return elem_main.removeChild( elem_keywords );

        if ( my.keywords === true ) entries.sort( function ( a, b ) { return a.innerHTML.localeCompare( b.innerHTML ) } );

        entries.map( function ( entry ) { elem_keywords.appendChild( entry ); } );

        function addKeyword( keyword ) {
          entries.push( ccm.helper.html( { class: 'keyword', inner: Array.isArray( my.keywords ) ? keyword : keyword.word } ) );
        }

      }

      function renderText() {

        self.element.querySelector( '.text' ).innerHTML = text;
        addInputs();

        function addInputs() {

          ccm.helper.makeIterable( self.element.querySelectorAll( '.cloze_gap' ) ).map( function ( gap, i ) {

            if ( my.blank && my.keywords ) return gap.appendChild( ccm.helper.html( { tag: 'input', type: 'text' } ) );

            var keyword = keywords[ i ].word;

            var input = {
              tag: 'input',
              type: 'text',
              maxlength: keyword.length,
              size: keyword.length * 1.5
            };

            if ( !my.blank ) {
              input.placeholder = '';
              for ( var j = 0; j < keyword.length; j++ )
                input.placeholder += Math.pow( 2, j ) & keywords[ i ].givens ? keyword.charAt( j ) : '_';
            }

            gap.appendChild( ccm.helper.html( input ) );

          } );

        }
      }

    };

  }

} );