/**
 * @overview <i>ccm</i> component for rendering a component list
 * @author André Kless <andre.kless@web.de> 2017
 * @license The MIT License (MIT)
 */

( function () {

  var ccm_version = '9.0.0';
  var ccm_url     = 'https://akless.github.io/ccm/ccm.min.js';

  var component_name = 'comp_list';
  var component_obj  = {

    name: component_name,

    config: {

      html_templates: {
        "main": {
          "tag": "main",
          "inner": [ { "tag": "nav" }, { "tag": "article" } ]
        }
      },
      comp_info: [ 'ccm.component', 'https://akless.github.io/ccm-components/comp_info/ccm.comp_info.min.js', { compact: true } ],
      comp_info_configs: [],
      bootstrap: [ 'ccm.load', 'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css', { context: 'head', url: 'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css' } ]

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

        var main_elem = self.ccm.helper.html( my.html_templates.main );
        var nav_elem = main_elem.querySelector( 'nav' );
        var article_elem = main_elem.querySelector( 'article' );

        var counter = 1;
        my.comp_info_configs.map( render );
        check();

        function render( config ) {

          var child = document.createElement( 'div' );
          nav_elem.appendChild( child );
          counter++;
          my.comp_info.start( config, function ( instance ) {
            config.compact = false;
            child.appendChild( instance.root );
            child.addEventListener( 'click', function () {
              self.ccm.helper.setContent( article_elem, self.ccm.helper.loading( self ) );
              my.comp_info.start( config, function ( instance ) {
                self.ccm.helper.setContent( article_elem, instance.root );
              } );
            } );
            check();
          } );

        }

        function check() {
          counter--;
          if ( counter !== 0 ) return;

          self.ccm.helper.setContent( self.element, main_elem );

          if ( callback ) callback();
        }

      };

    }

  };

  var namespace = window.ccm && ccm.components[ component_name ]; if ( namespace ) { if ( namespace.ccm_version ) ccm_version = namespace.ccm_version; if ( namespace.ccm_url ) ccm_url = namespace.ccm_url; }
  if ( !window.ccm || !ccm[ ccm_version ] ) { var tag = document.createElement( 'script' ); document.head.appendChild( tag ); tag.onload = register; tag.src = ccm_url; } else register();
  function register() { ccm[ ccm_version ].component( component_obj ); }
}() );