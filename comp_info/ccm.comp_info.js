/**
 * @overview <i>ccm</i> component for rendering component informations
 * @author André Kless <andre.kless@web.de> 2017
 * @license The MIT License (MIT)
 */

( function () {

  var ccm_version = '9.0.0';
  var ccm_url     = 'https://akless.github.io/ccm/ccm.min.js';

  var component_name = 'comp_info';
  var component_obj  = {

    name: component_name,

    config: {

      html_templates: {
        "main": {
          "id": "main",
          "inner": [
            {
              "tag": "header",
              "inner": [
                {
                  "tag": "section",
                  "id": "logo",
                  "inner": {
                    "tag": "img",
                    "src": "%logo%"
                  }
                },
                {
                  "tag": "section",
                  "id": "trailer",
                  "inner": [
                    {
                      "id": "title",
                      "inner": "%title%"
                    },
                    {
                      "id": "developer",
                      "inner": "%developer%"
                    }
                  ]
                }
              ]
            },
            {
              "tag": "main",
              "inner": [
                {
                  "tag": "section",
                  "id": "abstract",
                  "inner": "%abstract%"
                },
                {
                  "tag": "section",
                  "id": "info"
                }
              ]
            },
            {
              "tag": "footer",
              "inner": [
                {
                  "tag": "fieldset",
                  "inner": [
                    {
                      "tag": "legend",
                      "inner": "Demo"
                    },
                    {
                      "tag": "section",
                      "id": "demo"
                    }
                  ]
                }
              ]
            }
          ]
        },
        "entry": {
          "id": "%key%",
          "class": "entry",
          "inner": [
            {
              "class": "label",
              "inner": "%label%"
            },
            {
              "class": "value",
              "inner": "%value%"
            }
          ]
        }
      },
      data: { store: [ 'ccm.store' ] },
      placeholder: {
        name: 'Name',
        url: 'URL',
        developer: 'Developer',
        licence: 'Licence'
      }

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

          var main_elem = self.ccm.helper.html( my.html_templates.main, {
            logo: dataset.logo,
            title: dataset.title,
            developer: dataset.developer,
            abstract: dataset.abstract
          } );

          var entries_data = self.ccm.helper.filterProperties( dataset, 'name', 'url', 'developer', 'licence' );
          var info_elem = main_elem.querySelector( '#info' );

          for ( var prop in entries_data ) renderEntry( prop, entries_data[ prop ] );

          self.ccm.start( dataset.url, dataset.demo, function ( instance ) {

            main_elem.querySelector( '#demo' ).appendChild( instance.root );

            self.ccm.helper.setContent( self.element, main_elem );

            if ( callback ) callback();

          } );

          function renderEntry( key, value ) {
            if ( key === 'url' ) value = '<a target="_blank" href="'+value+'">' + value + '</a>';
            info_elem.appendChild( self.ccm.helper.html( my.html_templates.entry, { key: key, label: my.placeholder[ key ], value: value } ) );
          }

        } );

        if ( callback ) callback();
      };

    }

  };

  var namespace = window.ccm && ccm.components[ component_name ]; if ( namespace ) { if ( namespace.ccm_version ) ccm_version = namespace.ccm_version; if ( namespace.ccm_url ) ccm_url = namespace.ccm_url; }
  if ( !window.ccm || !ccm[ ccm_version ] ) { var tag = document.createElement( 'script' ); document.head.appendChild( tag ); tag.onload = register; tag.src = ccm_url; } else register();
  function register() { ccm[ ccm_version ].component( component_obj ); }
}() );