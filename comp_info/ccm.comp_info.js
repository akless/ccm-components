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
                  "id": "info",
                  "inner": [
                    {
                      "id": "name",
                      "class": "entry",
                      "inner": [
                        {
                          "class": "label",
                          "inner": "Name"
                        },
                        {
                          "class": "value",
                          "inner": "%name%"
                        }
                      ]
                    },
                    {
                      "id": "version",
                      "class": "entry",
                      "inner": [
                        {
                          "class": "label",
                          "inner": "Version"
                        },
                        {
                          "class": "value",
                          "inner": "%version%"
                        }
                      ]
                    },
                    {
                      "id": "url",
                      "class": "entry",
                      "inner": [
                        {
                          "class": "label",
                          "inner": "URL"
                        },
                        {
                          "class": "value",
                          "inner": "%url%"
                        }
                      ]
                    },
                    {
                      "id": "developer",
                      "class": "entry",
                      "inner": [
                        {
                          "class": "label",
                          "inner": "Developer"
                        },
                        {
                          "class": "value",
                          "inner": "%developer%"
                        }
                      ]
                    },
                    {
                      "id": "licence",
                      "class": "entry",
                      "inner": [
                        {
                          "class": "label",
                          "inner": "Licence"
                        },
                        {
                          "class": "value",
                          "inner": "%licence%"
                        }
                      ]
                    }
                  ]
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
        }
      },
      data: { store: [ 'ccm.store' ] }

  //  compact: true

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

          var main_templ = self.ccm.helper.clone( my.html_templates.main );

          if ( my.compact ) main_templ = main_templ.inner[ 0 ];

          var main_elem = self.ccm.helper.html( main_templ, dataset );

          if ( my.compact ) { self.ccm.helper.setContent( self.element, main_elem ); if ( callback ) callback(); return; }

          self.ccm.start( dataset.url, dataset.demo, function ( instance ) {

            self.ccm.helper.setContent( main_elem.querySelector( '#demo' ), instance.root );

            self.ccm.helper.setContent( self.element, main_elem );

            if ( callback ) callback();

          } );

        } );

      };

    }

  };

  var namespace = window.ccm && ccm.components[ component_name ]; if ( namespace ) { if ( namespace.ccm_version ) ccm_version = namespace.ccm_version; if ( namespace.ccm_url ) ccm_url = namespace.ccm_url; }
  if ( !window.ccm || !ccm[ ccm_version ] ) { var tag = document.createElement( 'script' ); document.head.appendChild( tag ); tag.onload = register; tag.src = ccm_url; } else register();
  function register() { ccm[ ccm_version ].component( component_obj ); }
}() );