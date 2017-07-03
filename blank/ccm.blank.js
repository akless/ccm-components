/**
 * @overview blank template for a ccm component
 * @author André Kless <andre.kless@web.de> 2017
 * @license The MIT License (MIT)
 */

( function () {

  var ccm_version = '8.1.0';
  var ccm_url     = 'https://akless.github.io/ccm/version/ccm-8.1.0.min.js';

  var component_name = 'blank';
  var component_obj  = {

    name: component_name,

    Instance: function () {

      var self = this;

      this.start = function ( callback ) {

        self.element.innerHTML = 'Hello, World!';

        if ( callback ) callback();
      };

    }

  };

  var namespace = window.ccm && ccm.components[ component_name ]; if ( namespace ) { if ( namespace.ccm_version ) ccm_version = namespace.ccm_version; if ( namespace.ccm_url ) ccm_url = namespace.ccm_url; }
  if ( !window.ccm || !ccm[ ccm_version ] ) { var tag = document.createElement( 'script' ); document.head.appendChild( tag ); tag.onload = register; tag.src = ccm_url; } else register();
  function register() { ccm[ ccm_version ].component( component_obj ); }
}() );