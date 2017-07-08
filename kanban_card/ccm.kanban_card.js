/**
 * @overview <i>ccm</i> component for rendering a kanban card
 * @author André Kless <andre.kless@web.de> 2016-2017
 * @license The MIT License (MIT)
 * @version latest (1.0.0)
 * TODO: declarative way
 * TODO: docu comments
 * TODO: permission settings
 * TODO: logging
 * TODO: realtime update
 */

( function () {

  var ccm_version = '9.0.0';
  var ccm_url     = 'https://akless.github.io/ccm/ccm.min.js';

  var component_name = 'kanban_card';
  var component_obj  = {

    name: component_name,

    config: {

      html_templates: {
        "main": {
          "id": "main",
          "inner": [
            {
              "id": "header",
              "inner": [
                {
                  "id": "title",
                  "class": "entry",
                  "inner": [
                    { "id": "status" },
                    {
                      "class": "value",
                      "inner": "%title%",
                      "contenteditable": true,
                      "oninput": "%input_title%"
                    }
                  ]
                },
                {
                  "id": "owner",
                  "class": "entry",
                  "inner": [
                    {
                      "class": "value",
                      "inner": "%owner%",
                      "onclick": "%click_owner%"
                    },
                    { "class": "fa fa-user" }
                  ]
                }
              ]
            },
            {
              "id": "content",
              "inner": {
                "id": "summary",
                "class": "entry",
                "inner": {
                  "class": "value",
                  "inner": "%summary%",
                  "contenteditable": true,
                  "oninput": "%input_summary%"
                }
              }
            },
            {
              "id": "footer",
              "inner": [
                {
                  "id": "priority",
                  "class": "entry",
                  "inner": {
                    "class": "value",
                    "inner": "%priority%",
                    "onclick": "%click_priority%"
                  }
                },
                {
                  "id": "deadline",
                  "class": "entry",
                  "inner": [
                    {
                      "class": "value",
                      "inner": "%deadline%",
                      "onclick": "%click_deadline%"
                    },
                    { "class": "fa fa-calendar-check-o" }
                  ]
                }
              ]
            }
          ]
        }
      },
      css_layout: [ 'ccm.load',  'layouts/default.css' ],
      data: {
        store: [ 'ccm.store', { /*local: 'https://akless.github.io/ccm-components/kanban_card/kanban_card_datastore.min.js',*/ store: 'kanban_cards', url: 'wss://ccm.inf.h-brs.de' } ],
        key: 'homework'
      },
      icons: [ 'ccm.load', 'https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css', { url: 'https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css', context: document.head } ],
      members: [ 'John', 'Jane' ],
      priorities: [ 'A', 'B', 'C' ]

    },

    Instance: function () {

      var self = this;
      var my;           // contains privatized instance members

      this.ready = function ( callback ) {

        // privatize all possible instance members
        my = self.ccm.helper.privatize( self );

        // listen to datastore change event => update own content
        my.data.store.onChange = function () { console.log( 'update', arguments ); self.start(); };

        callback();
      };

      this.start = function ( callback ) {

        // get dataset for rendering
        self.ccm.helper.dataset( my.data, function ( dataset ) {

          self.ccm.helper.setContent( self.element, self.ccm.helper.protect( self.ccm.helper.html( my.html_templates.main, self.ccm.helper.integrate( {

            title: '',
            owner: '',
            summary: '',
            priority: '',
            deadline: '',
            input_title:    inputTitle,
            click_owner:    clickOwner,
            input_summary:  inputSummary,
            click_priority: clickPriority,
            click_deadline: clickDeadline

          }, self.ccm.helper.clone( dataset ), true ) ) ) );

          self.ccm.helper.makeIterable( self.element.querySelectorAll( '.value' ) ).map( empty );

          if ( callback ) callback();

          function inputTitle() {

            empty( this );
            update( 'title', this.innerHTML.trim() );

          }

          function clickOwner() { console.log( 'owner' ); }

          function inputSummary() {

            empty( this );
            update( 'summary', this.innerHTML.trim() );

          }

          function clickPriority() { console.log( 'priority' ); }

          function clickDeadline() { console.log( 'deadline' ); }

          function empty( elem ) {

            if ( elem.innerHTML.trim().replace( /<br>/g, '' ) === '' ) elem.innerHTML = '';

          }

          function update( prop, value ) {

            status();
            dataset[ prop ] = value;
            my.data.store.set( dataset, status );

            function status( finished ) {

              self.ccm.helper.setContent( self.element.querySelector( '#status' ), finished ? '' : self.ccm.helper.loading( self ) );

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