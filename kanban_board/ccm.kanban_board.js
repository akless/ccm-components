/**
 * @overview <i>ccm</i> component for user authentication
 * @author André Kless <andre.kless@web.de> 2016-2017
 * @license The MIT License (MIT)
 * @version latest (1.0.0)
 */

( function () {

  var ccm_version = '9.0.0';
  var ccm_url     = 'https://akless.github.io/ccm/ccm.min.js';

  var component_name = 'kanban_board';
  var component_obj  = {

    name: component_name,

    config: {

      html_templates: {},
      data: {
        store: [ 'ccm.store', { store: 'kanban', url: 'wss://ccm.inf.h-brs.de' } ],
        key: 'demo'
      },
      icons: [ 'ccm.load', 'https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css', { url: 'https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css', context: document.head } ]
      //style:    [ 'ccm.load',  'https://akless.github.io/ccm-components/kanban_board/layout/default.css' ]

      //html:     [ ccm.load,  './json/kanban_html.json' ],
      //key:      'demo',
      //store:    [ ccm.store, { /*local: './json/kanban.json',*/ store: 'kanban', url: 'wss://ccm.inf.h-brs.de/index.js' } ],

      //ui_sort:  [ 'ccm.load',  './lib/jquery-ui/sortable/jquery-ui.min.js' ]

    },

    Instance: function () {

      var self = this;
      var my;           // contains privatized instance members

      this.init = function ( callback ) {

        // listen to datastore change event => update own content
        self.data.store.onChange = function () { self.start(); };

        callback();
      };

      this.ready = function ( callback ) {

        // privatize all possible instance members
        my = self.ccm.helper.privatize( self );

        callback();
      };

      this.start = function ( callback ) {

        // get dataset for rendering
        self.ccm.helper.dataset( my.data, function ( dataset ) {
          console.log( dataset );
          return;

          // render main html structure
          element.html( ccm.helper.html( self.html.main, {

            title:       ccm.helper.val( self.title       || dataset.title       ),
            description: ccm.helper.val( self.description || dataset.description )

          } ) );

          if ( !( self.title       || dataset.title       ) ) ccm.helper.find( self, '.title'       ).remove();
          if ( !( self.description || dataset.description ) ) ccm.helper.find( self, '.description' ).remove();

          if ( !dataset.members     ) dataset.members    = [ 'Adam', 'Eva', 'Romeo', 'Julia'  ];
          if ( !dataset.priorities  ) dataset.priorities = [ 'A', 'B', 'C' ];
          if ( !dataset.lanes       ) dataset.lanes      = [ 'ToDo', 'Doing', 'Done' ];

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

          function renderTask( tasks_div, i, j ) {

            var lane_div, task_div, entry_div, value_div, value, property;

            tasks_div.append( ccm.helper.html( self.html.task, {

              title:         ccm.helper.val( dataset.lanes[ i ].tasks[ j ].title    ).replace( /_quot_/g, "&quot;" ),
              owner:         ccm.helper.val( dataset.lanes[ i ].tasks[ j ].owner    ).replace( /_quot_/g, "&quot;" ),
              summary:       ccm.helper.val( dataset.lanes[ i ].tasks[ j ].summary  ).replace( /_quot_/g, "&quot;" ),
              priority:      ccm.helper.val( dataset.lanes[ i ].tasks[ j ].priority ).replace( /_quot_/g, "&quot;" ),
              deadline:      ccm.helper.val( dataset.lanes[ i ].tasks[ j ].deadline ).replace( /_quot_/g, "&quot;" ),

              inputTitle:    inputTitle,
              clickOwner:    clickOwner,
              inputSummary:  inputSummary,
              clickPriority: clickPriority,
              clickDeadline: clickDeadline

            } ) );

            task_div = ccm.helper.find( self, tasks_div, '.task:last' );

            ccm.helper.find( self, task_div, '.value' ).each( function () {

              value_div = jQuery( this );
              entry_div = value_div.closest( '.entry' );
              value = jQuery.trim( value_div.html() );
              empty();

            } );

            function inputTitle() {

              refresh( jQuery( this ), 'title' );
              editable();

            }

            function clickOwner() {

              refresh( jQuery( this ), 'owner' );
              select( 'members', clickOwner );

            }

            function inputSummary() {

              refresh( jQuery( this ), 'summary' );
              editable();

            }

            function clickPriority() {

              refresh( jQuery( this ), 'priority' );
              select( 'priorities', clickPriority );

            }

            function clickDeadline() {

              refresh( jQuery( this ), 'deadline' );
              input( 'date', clickDeadline );

            }

            function refresh( div, prop ) {

              lane_div  = div.closest( '.lane' );
              task_div  = div.closest( '.task' );
              entry_div = div.closest( '.entry' );
              value_div = div;
              value     = jQuery.trim( value_div.is( 'input' ) ? value_div.val() : value_div.html() );
              property  = prop;

              i = ccm.helper.find( self, '.lane' ).index( div.closest( '.lane' ) );
              j = ccm.helper.find( self, lane_div, '.task' ).index( task_div );

            }

            function editable() {

              empty();
              add_del( task_div );
              update();

            }

            function select( values, click ) {

              var temp = entry_div.html();
              var entries = [ { tag: 'option' } ];
              var entry_value;

              for ( var k = 0; k < dataset[ values ].length; k++ ) {

                entry_value = dataset[ values ][ k ];
                entries.push( { tag: 'option', value: entry_value, inner: entry_value, selected: entry_value === dataset.lanes[ i ].tasks[ j ][ property ] } );

              }

              entry_div.html( ccm.helper.html( { tag: 'select', inner: entries, onchange: onChange, onblur: onBlur } ) );

              ccm.helper.find( self, entry_div, 'select' ).focus();

              function onChange() {

                value = jQuery.trim( jQuery( this ).val() );
                restore( temp, click );
                update();

              }

              function onBlur() {

                restore( temp, click );

              }

            }

            function input( type, click ) {

              var temp = entry_div.html();

              entry_div.html( ccm.helper.html( { tag: 'input', type: type, value: dataset.lanes[ i ].tasks[ j ][ property ], oninput: onInput, onblur: onBlur } ) );

              ccm.helper.find( self, entry_div, 'input' ).focus();

              function onInput() {

                value_div = jQuery( this );
                value = jQuery.trim( value_div.val() );
                update();

              }

              function onBlur() {

                restore( temp, click );

              }

            }

            function restore( temp, click ) {

              entry_div.html( temp );
              value_div = ccm.helper.find( self, entry_div, '.value' ).click( click );

              if ( value !== undefined ) {

                value_div.html( value );
                empty();
                add_del( task_div );

              }

            }

            function empty() {

              if ( value === '' || value === '<br>' ) {
                entry_div.addClass( 'empty' );
                value_div.html( '' );
              }
              else
                entry_div.removeClass( 'empty' );

            }

            function update() {

              var status_div = ccm.helper.find( self, task_div, '.status' ).stop().html( '' ).fadeTo( 0, 1 );
              ccm.helper.loading( status_div );
              refresh( value_div, property );
              if ( i >= 0 && j >= 0 ) dataset.lanes[ i ].tasks[ j ][ property ] = ccm.helper.val( value ).replace( /"/g, '_quot_' );
              self.store.set( dataset, function () { status_div.fadeOut(); } );

            }

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