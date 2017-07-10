/**
 * @overview <i>ccm</i> component for rendering a kanban board
 * @author André Kless <andre.kless@web.de> 2016-2017
 * @license The MIT License (MIT)
 * @version latest (1.0.0)
 * TODO: modernisation -in progress-
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

  var ccm_version = '9.0.0';
  var ccm_url     = 'https://akless.github.io/ccm/ccm.min.js';

  var component_name = 'kanban_board';
  var component_obj  = {

    name: component_name,

    config: {

      html_templates: {
        "lane": {
          "class": "lane",
          "inner": [
            {
              "class": "title",
              "inner": "%title%"
            },
            { "class": "cards" }
          ]
        }
      },
      css_layout: [ 'ccm.load', 'layouts/default.css' ],
      kanban_card: [ 'ccm.component', 'https://akless.github.io/ccm-components/kanban_card/ccm.kanban_card.min.js' ],
      data: {
        store: [ 'ccm.store', 'kanban_board_datastore.min.js' ],
        key: 'demo'
      },
      sortable: [ 'ccm.load', '//cdnjs.cloudflare.com/ajax/libs/Sortable/1.6.0/Sortable.min.js' ]
      //jquery_ui: [ 'ccm.load', [ 'https://code.jquery.com/jquery-3.2.1.min.js', 'https://code.jquery.com/ui/1.12.1/jquery-ui.min.js' ] ]
      //jquery_ui_sortable: [ 'ccm.load', './lib/jquery-ui/sortable/jquery-ui.min.js' ]

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

          var counter = 1;
          if ( !dataset.lanes ) dataset.lanes = [];

          self.element.innerHTML = '';
          dataset.lanes.map( renderLane );
          check();

          function renderLane( lane, i, lanes ) {

            if ( typeof lane === 'string' ) lanes[ i ] = lane = { title: lane };
            if ( !lane.cards ) lane.cards = [];

            var lane_elem = self.ccm.helper.html( my.html_templates.lane, { title: lane.title } );
            var cards_elem = lane_elem.querySelector( '.cards' );

            lane.cards.map( renderCard );
            self.element.appendChild( self.ccm.helper.protect( lane_elem ) );

            function renderCard( card_cfg ) {

              counter++;
              card_cfg = self.ccm.helper.clone( card_cfg );
              cards_elem.appendChild( card_cfg.element = document.createElement( 'div' ) );
              card_cfg.element.classList.add( 'card' );
              my.kanban_card.start( card_cfg, check );

            }

          }

          function check() {

            counter--;
            if ( counter !== 0 ) return;

            //sortable( self.element.querySelectorAll( '.card' ), self.element.querySelectorAll( '.placeholder' ), function () { console.log( 'drag!' ); }, function () { console.log( 'drop!' ); } );
            sortable();

            if ( callback ) callback();

            /*
            function sortable( drag, drop, ondrag, ondrop ) {

              self.ccm.helper.makeIterable( drag ).map( function ( elem ) {
                elem.ondragstart = function () {
                  ondrag();
                }
              } );

            }*/

          }

          function sortable() {

            var cards_elems = self.ccm.helper.makeIterable( self.element.querySelectorAll( '.cards' ) );
            var start_lane, start_pos, end_lane, end_pos;

            cards_elems.map( function ( cards_elem ) {

              Sortable.create( cards_elem, {

                group: 'cards',
                animation: 150,
                onStart: function ( evt ) {

                  start_lane = cards_elems.indexOf( evt.item.parentNode );
                  start_pos = evt.oldIndex;

                },
                onEnd: function ( evt ) {

                  end_lane = cards_elems.indexOf( evt.item.parentNode );
                  end_pos = evt.newIndex;

                  var card = dataset.lanes[ start_lane ].cards[ start_pos ];
                  dataset.lanes[ end_lane ].cards.splice( end_pos, 0, card );
                  dataset.lanes[ start_lane ].cards.splice( start_pos, 1 );

                  my.data.store.set( dataset );

                }

              } );

            } );

          }

          function add_del( task_div ) {

            var max_empties = 5;

            if ( task_div ) del( task_div ); else ccm.helper.find( self, '.task' ).each( function () { del( jQuery( this ) ); } );

            add();

            function add() {

              var task_div = ccm.helper.find( self, '.lane:first .task:last' );

              if ( ccm.helper.find( self, task_div, '.empty' ).length < max_empties ) {

                dataset.lanes[ 0 ].tasks.push( {} );
                renderTask( ccm.helper.find( self, '.lane:first .tasks' ), 0, dataset.lanes[ 0 ].tasks.length - 1 );

              }

            }

            function del( task_div ) {

              if ( ccm.helper.find( self, task_div, '.empty' ).length < max_empties ) return;

              var i = ccm.helper.find( self, '.lane' ).index( task_div.parent().parent() );
              var j = task_div.index();

              if ( i === 0 && j === dataset.lanes[ 0 ].tasks[ dataset.lanes[ 0 ].tasks.length - 1 ] ) return;

              task_div.remove();
              dataset.lanes[ i ].tasks.splice( j, 1 );

            }

          }

        } );

      };

    }

  };

  var namespace = window.ccm && ccm.components[ component_name ]; if ( namespace ) { if ( namespace.ccm_version ) ccm_version = namespace.ccm_version; if ( namespace.ccm_url ) ccm_url = namespace.ccm_url; }
  if ( !window.ccm || !ccm[ ccm_version ] ) { var tag = document.createElement( 'script' ); document.head.appendChild( tag ); tag.onload = register; tag.src = ccm_url; } else register();
  function register() { ccm[ ccm_version ].component( component_obj ); }
}() );