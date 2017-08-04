/**
 * @overview example ccm component for the reuse of an unknown amount of ccm instances
 * @author André Kless <andre.kless@web.de> 2017
 * @license The MIT License (MIT)
 */

( function () {

  var ccm_version = '9.0.0';
  var ccm_url     = 'https://akless.github.io/ccm/ccm.js';

  var component_name = 'multi_blank';
  var component_obj  = {

    name: component_name,

    config:  {
      component_obj: [ 'ccm.component', 'https://akless.github.io/ccm-components/blank/ccm.blank.js' ],
      times: 5
    },

    Instance: function () {

      this.start = function ( callback ) {

        this.element.innerHTML = '';

        for ( var i = 1; i <= this.times; i++ ) {
          var root = document.createElement( 'div' );
          this.element.appendChild( root );
          this.component_obj.start( root );
        }

        if ( callback ) callback();
      }

    }

  };

  var namespace = window.ccm && ccm.components[ component_name ]; if ( namespace ) { if ( namespace.ccm_version ) ccm_version = namespace.ccm_version; if ( namespace.ccm_url ) ccm_url = namespace.ccm_url; }
  if ( !window.ccm || !ccm[ ccm_version ] ) { var tag = document.createElement( 'script' ); document.head.appendChild( tag ); tag.onload = register; tag.src = ccm_url; } else register();
  function register() { ccm[ ccm_version ].component( component_obj ); }
}() );