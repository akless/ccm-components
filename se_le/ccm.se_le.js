/**
 * @overview <i>ccm</i> component for lecture units of the course 'Software Engineering I'
 * @author André Kless <andre.kless@h-brs.de> 2016
 * @license The MIT License (MIT)
 */

ccm.component( {
  index: 'se_le',
  config: {
    style:      [ ccm.load, '../se_le/default.css' ],
    exercise:   [ ccm.component, '../exercise/ccm.exercise.js', {
      user:     [ ccm.instance, 'https://kaul.inf.h-brs.de/ccm/components/user.js' ],
      data: {
        store:  [ ccm.store, 'https://kaul.inf.h-brs.de/ccm/jsonp/se_ws16_exercises.json' ]
      },
      edit: {
        store:  [ ccm.store, { url: 'https://ccm.inf.h-brs.de', store: 'inputs_se_bcs_ws16' } ]
      },
      bigdata:  [ ccm.instance, '../bigdata/ccm.bigdata.js', {
        store:  [ ccm.store, { url: 'https://ccm.inf.h-brs.de', store: 'bigdata_se_bcs_ws16_input' } ]
      } ]
    } ],
    input_list: [ ccm.component, '../input_list/ccm.input_list.js', {
      data: {
        store:  [ ccm.store, 'https://kaul.inf.h-brs.de/ccm/jsonp/se_ws16_exercises.json' ]
      },
      edit: {
        store:  [ ccm.store, { url: 'https://ccm.inf.h-brs.de', store: 'inputs_se_bcs_ws16' } ]
      }
    } ],
    user:       [ ccm.instance, 'https://kaul.inf.h-brs.de/ccm/components/user.js' ],
    point:      [ ccm.component, 'https://kaul.inf.h-brs.de/ccm/components/point.js' ],
    bigdata:    [ ccm.component, '../bigdata/ccm.bigdata.js' ],
    deadline:   [ ccm.load, [ 'https://kaul.inf.h-brs.de/data/get_deadline.php', { store: 'hbrs_se1_ws16', key: 'le01_a1' } ] ],
    highlight:  [ ccm.load, 'https://kaul.inf.h-brs.de/ccm/lib/highlight/agate.css', 'https://kaul.inf.h-brs.de/ccm/lib/highlight/highlight.pack.java.js' ]
  },
  Instance: function () {
    var self = this;
    var my;
    this.init = function ( callback ) {
      if ( self.deadline && Array.isArray( self.deadline ) && typeof self.deadline[ 0 ] === 'string' && typeof self.deadline[ 1 ] === 'string' )
        ccm.load( [ 'https://kaul.inf.h-brs.de/data/get_deadline.php', { store: self.deadline[ 0 ], key: self.deadline[ 1 ] } ], proceed );
      else
        proceed( self.deadline );

      function proceed( deadline ) {
        if ( deadline ) self.deadline = typeof deadline === 'object' ? deadline.deadline : deadline;
        if ( !self.semester ) return callback();
        self.exercise.config.data.store.push( 'https://kaul.inf.h-brs.de/ccm/jsonp/se_' + self.semester + '_exercises.json' );
        self.input_list.config.data.store.push( 'https://kaul.inf.h-brs.de/ccm/jsonp/se_' + self.semester + '_exercises.json' );
        if ( !self.course ) return callback();
        self.exercise.config.edit.store[ 1 ].store = 'inputs_se_' + self.course + '_' + self.semester;
        self.input_list.config.edit.store[ 1 ].store = 'inputs_se_' + self.course + '_' + self.semester;
        self.bigdata.instance( {
          store: [ ccm.store, { url: 'https://ccm.inf.h-brs.de', store: 'bigdata_se_' + self.course + '_' + self.semester + '_input' } ]
        }, function ( instance ) {
          self.exercise.config.bigdata = instance;
          callback();
        } );
      }
    };
    this.ready = function ( callback ) {
      my = ccm.helper.privatize( self, 'exercise', 'input_list', 'user', 'point', 'deadline', 'highlight', 'semester', 'course' );
      callback();
    };
    this.render = function ( callback ) {
      var node = ccm.helper.element( self ).html( '' )[ 0 ];
      var counter = 1;
      self.childNodes.map( function ( child, i ) {
        if ( child.tagName ) {
          if ( child.tagName === 'CCM-SE_LE-EXERCISE' )
            renderExercise( child, i );
          else if ( child.tagName === 'CCM-SE_LE-DEADLINE' )
            renderDeadline();
          else
            node.appendChild( child );
        }
        else
          node.appendChild( child );
      } );
      check();

      function renderExercise( child, i ) {
        counter++;
        var deadline = new Date( my.deadline.replace( /-/g, '/' ) ).getTime();
        var id = 'ccm_' + self.index + '_' + i;
        var div = document.createElement( 'div' );
        div.setAttribute( 'id', id + '_exercise' );
        node.appendChild( div );
        var childNodes = [];
        ccm.helper.makeIterable( child.childNodes ).map( function ( inner ) {
          childNodes.push( inner );
        } );
        var key = child.getAttribute( 'key' );
        var data_key = child.getAttribute( 'data_key'  ) || key;
        var edit_key = child.getAttribute( 'edit_key'  ) || key;
        if ( deadline < Date.now() ) renderSolutions();
        my.exercise.render( {
          element:    jQuery( '#' + id + '_exercise' ),
          childNodes: childNodes,
          'data.key': data_key,
          'edit.key': edit_key,
          point:      [ ccm.instance, 'point', { keyword: child.getAttribute( 'point_key' ) || key } ],
          deadline:   deadline
        }, check );

        function renderSolutions() {
          console.log( my );
          counter++;
          var box = document.createElement( 'div' );
          box.setAttribute( 'class', 'box' );
          box.innerHTML = '<input id="' + data_key + '" type="checkbox"><label for="' + data_key + '">Zeige Liste aller eingereichten Lösungen</label>';
          node.appendChild( box );
          var list = document.createElement( 'div' );
          list.setAttribute( 'id', id + '_solutions' );
          box.appendChild( list );
          my.input_list.render( {
            element:    jQuery( '#' + id + '_solutions' ),
            'data.key': data_key,
            'edit.key': edit_key
          }, check );
        }
      }

      function renderDeadline() {
        var div = document.createElement( 'div' );
        div.innerHTML = '<p class="hint"><b>DEADLINE:</b> <span class="deadline">' + my.deadline + '</span></p>';
        node.appendChild( div );
      }

      function check() {
        counter--;
        if ( counter > 0 ) return;
        hljs.initHighlighting();
        if ( callback ) callback();
      }
    };
  }
} );