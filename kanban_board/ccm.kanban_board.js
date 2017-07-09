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

      //css_layout: [ 'ccm.load', 'https://akless.github.io/ccm-components/kanban_board/layout/default.css' ],
      kanban_card: [ 'ccm.component', 'https://akless.github.io/ccm-components/kanban_card/ccm.kanban_card.min.js' ],
      data: {
        store: [ 'ccm.store', 'https://akless.github.io/ccm-components/kanban_board/kanban_board_datastore.min.js' ],
        key: 'demo'
      }
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

        // get dataset for rendering
        self.ccm.helper.dataset( my.data, function ( dataset ) {

          var lanes_div = ccm.helper.find( self, '.lanes' );

          for ( var i = 0; i < dataset.lanes.length; i++ )
            renderLane( i );

          sortable();

          // translate own content
          if ( self.lang ) self.lang.render();

          // perform callback
          if ( callback ) callback();

          function renderLane( i ) {

            if ( typeof dataset.lanes[ i ] === 'string' ) dataset.lanes[ i ] = { title: dataset.lanes[ i ] };
            if ( !dataset.lanes[ i ].tasks ) dataset.lanes[ i ].tasks = i === 0 ? [ {} ] : [];

            lanes_div.append( ccm.helper.html( self.html.lane, { title: ccm.helper.val( dataset.lanes[ i ].title ) } ) );

            var lane_div  = ccm.helper.find( self, lanes_div, '.lane:last' );
            var tasks_div = ccm.helper.find( self, lane_div,  '.tasks'     );

            for ( var j = 0; j < dataset.lanes[ i ].tasks.length; j++ )
              renderTask( tasks_div, i, j );

          }

          function sortable() {

            var start_lane;
            var start_task;
            var end_lane;
            var end_task;

            ccm.helper.find( self, '.tasks' ).sortable( {

              connectWith: ccm.helper.find( self, '.tasks' ),
              forcePlaceholderSize: true,
              placeholder: 'placeholder',
              cancel: '.task > div *',
              start: function ( event, ui ) {

                start_lane = ccm.helper.find( self, '.lane' ).index( ui.item.parent().parent() );
                start_task = ui.item.index();

              },
              update: function ( event, ui ) {

                if ( ui.sender !== null ) return;

                var div = ui.item;
                var task = dataset.lanes[ start_lane ].tasks[ start_task ];

                end_lane = ccm.helper.find( self, '.lane' ).index( div.parent().parent() );
                end_task = div.index();

                dataset.lanes[ start_lane ].tasks.splice( start_task, 1 );
                dataset.lanes[ end_lane ].tasks.splice( end_task, 0, task );

                add_del();

                div = ccm.helper.find( self, div, '.status' ).stop().html( '' ).fadeTo( 0, 1 );
                ccm.helper.loading( div );
                self.store.set( dataset, function () { div.fadeOut(); } );

              }

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