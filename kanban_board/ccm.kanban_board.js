/**
 * @overview ccm component for rendering a kanban board
 * @author André Kless <andre.kless@web.de> 2016-2017
 * @license The MIT License (MIT)
 * @version latest (1.0.0)
 * TODO: add and delete of a kanban card
 * TODO: declarative
 * TODO: user
 * TODO: logging
 * TODO: docu comments
 * TODO: unit tests
 * TODO: version file/folder
 * TODO: factory
 * TODO: multilingualism
 */

( function () {

  var component = {

    name: 'kanban_board',

    ccm: 'https://akless.github.io/ccm/ccm.js',

    config: {

      "html": {
        "main": {
          "tag": "main",
          "inner": {
            "id": "lanes"
          }
        },
        "lane": {
          "tag": "section",
          "class": "lane",
          "inner": [
            {
              "tag": "header",
              "inner": "%%"
            },
            {
              "tag": "article",
              "class": "cards"
            }
          ]
        },
        "add": {
          "tag": "footer",
          "onclick": "%%"
        }
      },
      "css": [ "ccm.load", "../kanban_board/resources/default.css" ],
      "data": {
        "store": [ "ccm.store" ],
        "key": "local"
      },
      "lanes": [ "ToDo", "Doing", "Done" ],
      "card": { "component": "../kanban_card/ccm.kanban_card.js", "config": {} }

    },

    Instance: function () {

      var self = this;
      var my;           // contains privatized instance members

      this.ready = function ( callback ) {

        // privatize all possible instance members
        my = self.ccm.helper.privatize( self );

        callback();
      };

      this.start = function ( callback ) {

        self.ccm.helper.dataset( my.data, function ( dataset ) {

          if ( !dataset.lanes ) dataset.lanes = [];
          my.lanes.map( function ( lane, i ) {
            if ( !dataset.lanes[ i ] ) dataset.lanes[ i ] = { cards: [] };
          } );

          var main_elem = self.ccm.helper.html( my.html.main );
          var lanes_elem = main_elem.querySelector( '#lanes' );

          var counter = 1;
          dataset.lanes.map( renderLane );
          check();

          function renderLane( lane, i ) {

            var lane_elem = self.ccm.helper.html( my.html.lane, my.lanes[ i ] );
            var cards_elem = lane_elem.querySelector( '.cards' );

            lane.cards.map( renderCard );
            if ( i === 0 ) addNewCardButton();
            lanes_elem.appendChild( lane_elem );

            function renderCard( card ) {

              counter++;
              var card_elem = document.createElement( 'div' );
              cards_elem.appendChild( card_elem );
              self.ccm.helper.solveDependency( card, function ( card ) {

                card.start( function () {

                  card.root.classList.add( 'card' );

                  makeDraggable( card.root );
                  makeDroppable( card.root );

                  cards_elem.replaceChild( card.root, card_elem );
                  check();

                  function makeDraggable( elem ) {

                    elem.setAttribute( 'draggable', 'true' );
                    elem.addEventListener( 'dragstart', function ( event ) {
                      event.dataTransfer.setData( 'text', getPosition( event.target ).join( ',' ) );
                      addPlaceholder( event.target );
                    } );
                    elem.addEventListener( 'dragend', removePlaceholder );

                    function addPlaceholder( card_elem ) {

                      self.ccm.helper.makeIterable( lanes_elem.querySelectorAll( '.cards' ) ).map( function ( cards_elem ) {
                        var placeholder = self.ccm.helper.html( { class: 'placeholder' } );
                        placeholder.style.width  = card_elem.offsetWidth  + 'px';
                        placeholder.style.height = card_elem.offsetHeight + 'px';
                        makeDroppable( placeholder );
                        cards_elem.appendChild( placeholder );
                      } );

                    }

                    function removePlaceholder() {
                      self.ccm.helper.makeIterable( lanes_elem.querySelectorAll( '.placeholder' ) ).map( function ( placeholder ) {
                        self.ccm.helper.removeElement( placeholder );
                      } );
                    }

                  }

                  function makeDroppable( elem ) {

                    elem.addEventListener( 'dragover', function ( event ) { event.preventDefault(); } );
                    elem.addEventListener( 'drop', function ( event ) {
                      moveCard( event.dataTransfer.getData( 'text' ).split( ',' ).map( function( value ) { return parseInt( value ); } ), getPosition( event.target ) );

                      function moveCard( from, to ) {

                        if ( from[ 0 ] === to[ 0 ] && ( from[ 1 ] === to[ 1 ] || from[ 1 ] === to[ 1 ] - 1 ) ) return;

                        var card = dataset.lanes[ from[ 0 ] ].cards[ from[ 1 ] ];
                        dataset.lanes[ from[ 0 ] ].cards[ from[ 1 ] ] = null;
                        dataset.lanes[ to[ 0 ] ].cards.splice( to[ 1 ], 0, card );
                        if ( dataset.lanes[ from[ 0 ] ].cards[ from[ 1 ] ] !== null ) from[ 1 ]++;
                        dataset.lanes[ from[ 0 ] ].cards.splice( from[ 1 ], 1 );

                        if ( my.data.store ) my.data.store.set( dataset, function () { self.start(); } );

                      }

                    } );

                  }

                  function getPosition( card_elem ) {

                    var lane_elem = self.ccm.helper.findParentElementByClass( card_elem, 'lane' );
                    var x = self.ccm.helper.makeIterable( lane_elem.parentNode.children ).indexOf( lane_elem );
                    var y = self.ccm.helper.makeIterable( card_elem.parentNode.children ).indexOf( card_elem );
                    return [ x, y ];

                  }

                } );

              } );

            }

            function addNewCardButton() {
              lane_elem.appendChild( self.ccm.helper.html( my.html.add, function () {
                var config = self.ccm.helper.clone( my.card.config );
                if ( config.data.store ) config.data.key = self.ccm.helper.generateKey();
                dataset.lanes[ i ].cards.push( [ 'ccm.instance', my.card.component, self.ccm.helper.toJSON( config ) ] );
                if ( my.data.store ) my.data.store.set( dataset, function () { self.start(); } );
              } ) );
            }

          }

          function check() {

            counter--;
            if ( counter !== 0 ) return;

            self.ccm.helper.setContent( self.element, main_elem );

            if ( callback ) callback();
          }

        } );

      };

    }

  };

  function p(){window.ccm[v].component(component)}var f="ccm."+component.name+(component.version?"-"+component.version.join("."):"")+".js";if(window.ccm&&null===window.ccm.files[f])window.ccm.files[f]=component;else{var n=window.ccm&&window.ccm.components[component.name];n&&n.ccm&&(component.ccm=n.ccm),"string"==typeof component.ccm&&(component.ccm={url:component.ccm});var v=component.ccm.url.split("/").pop().split("-");if(v.length>1?(v=v[1].split("."),v.pop(),"min"===v[v.length-1]&&v.pop(),v=v.join(".")):v="latest",window.ccm&&window.ccm[v])p();else{var e=document.createElement("script");document.head.appendChild(e),component.ccm.integrity&&e.setAttribute("integrity",component.ccm.integrity),component.ccm.crossorigin&&e.setAttribute("crossorigin",component.ccm.crossorigin),e.onload=function(){p(),document.head.removeChild(e)},e.src=component.ccm.url}}
}() );