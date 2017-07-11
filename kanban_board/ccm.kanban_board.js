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
      lanes: [ 'ToDo', 'Doing', 'Done' ],
      sortable: [ 'ccm.load', '//cdnjs.cloudflare.com/ajax/libs/Sortable/1.6.0/Sortable.min.js' ]

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

        self.ccm.helper.setContent( self.element, self.ccm.helper.loading( self ) );

        self.ccm.helper.dataset( my.data, function ( dataset ) {

          if ( !dataset.lanes ) dataset.lanes = [];
          my.lanes.map( function ( lane, i ) {
            if ( !dataset.lanes[ i ] ) dataset.lanes[ i ] = { cards: [] };
          } );

          var element = document.createDocumentFragment();
          var counter = 1;
          dataset.lanes.map( renderLane );
          check();

          function renderLane( lane, i ) {

            var lane_elem = self.ccm.helper.html( my.html_templates.lane, { title: my.lanes[ i ] } );
            var cards_elem = lane_elem.querySelector( '.cards' );

            lane.cards.map( renderCard );
            element.appendChild( self.ccm.helper.protect( lane_elem ) );

            function renderCard( card_cfg ) {

              counter++;
              var card_elem = document.createElement( 'div' );
              cards_elem.appendChild( card_elem );
              my.kanban_card.start( card_cfg, function ( card_inst ) {
                card_inst.root.classList.add( 'card' );
                cards_elem.replaceChild( card_inst.root, card_elem );
                check();
              } );

            }

          }

          function check() {

            counter--;
            if ( counter !== 0 ) return;

            sortable();
            self.ccm.helper.setContent( self.element, element );

            if ( callback ) callback();

          }

          function sortable() {

            var cards_elems = self.ccm.helper.makeIterable( element.querySelectorAll( '.cards' ) );
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