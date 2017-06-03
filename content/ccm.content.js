/**
 * @overview ccm component for composed content
 * @author André Kless <andre.kless@web.de> 2016-2017
 * @license The MIT License (MIT)
 */

( function () {

  var ccm_version = '8.0.0';
  var ccm_url     = 'https://akless.github.io/ccm/version/ccm-8.0.0.min.js';

  var component_name = 'content';
  var component_obj  = {

    name: component_name,

    Instance: function () {

      var self = this;

      this.init = function ( callback ) {

        // no container for inner HTML of own ccm Custom Element? => use empty container
        if ( !self.node ) self.node = document.createElement( 'div' );

        // inner HTML of own ccm Custom Element is given via 'innerHTML' config property? => use it with higher priority
        if ( self.innerHTML ) self.node.innerHTML = self.innerHTML;

        delete self.innerHTML;  // remove no more needed config property

        // collect all ccm dependencies inside the inner HTML of own ccm Custom Element
        self.dependencies = []; collectDependencies( self.node );

        callback();

        /**
         * collects all dependencies inside given DOM Element Node (recursive function)
         * @param {Element} node
         */
        function collectDependencies( node ) {

          // iterate over all child DOM Element Nodes
          self.ccm.helper.makeIterable( node.children ).map( function ( child ) {

            // no ccm Custom Element? => abort and collect dependencies inside of it
            if ( child.tagName.indexOf( 'CCM-' ) !== 0 ) return collectDependencies( child );  // recursive call

            // generate ccm dependency for embedding out of founded ccm Custom Element
            var component = getComponent();
            var config = self.ccm.helper.generateConfig( child );
            config.parent = self;
            config.element = document.createElement( 'div' );
            self.dependencies.push( [ 'ccm.start', component, config ] );

            // replace founded ccm Custom Element with empty container for later embedding
            child.parentNode.replaceChild( config.element, child );

            /** gets index or URL of the ccm component that corresponds to the founded ccm Custom Element */
            function getComponent() {

              /**
               * index of the ccm component
               * @type {string}
               */
              var index = child.tagName.substr( 4 ).toLowerCase();

              // ccm component is already registered? => index is enough for embedding (otherwise URL is needed)
              if ( ccm.components[ index ] ) return index;

              // search inner HTML of own Custom Element for a script tag that contains the ccm component URL
              var scripts = self.node.getElementsByTagName( 'script' );
              for ( var i = 0; i < scripts.length; i++ )
                if ( self.ccm.helper.getIndex( scripts[ i ].getAttribute( 'src' ) ) === index )
                  return scripts[ i ].getAttribute( 'src' );

            }

          } );

        }

      };

      this.start = function ( callback ) {

        // render content that is given via own ccm Custom Element
        self.ccm.helper.setContent( self.element, self.ccm.helper.protect( self.node ) );
        self.node.id = 'main';

        // embed dependent components
        var i = 0; solveDependencies();

        /** solves all collected dependencies */
        function solveDependencies() {
          if ( i === self.dependencies.length ) { if ( callback ) callback(); return; }
          self.ccm.helper.solveDependency( self.dependencies, i++, solveDependencies );
        }

      };

    }

  };

  var namespace = window.ccm && ccm.components[ component_name ]; if ( namespace ) { if ( namespace.ccm_version ) ccm_version = namespace.ccm_version; if ( namespace.ccm_url ) ccm_url = namespace.ccm_url; }
  if ( !window.ccm || !ccm[ ccm_version ] ) { var tag = document.createElement( 'script' ); document.head.appendChild( tag ); tag.onload = register; tag.src = ccm_url; } else register();
  function register() { ccm[ ccm_version ].component( component_obj ); }
}() );