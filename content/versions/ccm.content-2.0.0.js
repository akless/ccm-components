/**
 * @overview ccm component for rendering a predefined content
 * @author André Kless <andre.kless@web.de> 2016-2017
 * @license The MIT License (MIT)
 * @version 2.0.0
 * @changes
 * version 2.0.0 (22.08.2017):
 * - uses ccm v10.0.0 instead of v8.1.0
 * - shortened component backbone
 * - use fragment instead of empty container as default Light DOM
 * - Light DOM can be given as HTML string via 'inner' config property
 * - removed no more needed ccm.helper.protect calls
 * version 1.0.0 (28.07.2017)
 */

( function () {

  var component = {

    name: 'content',
    version: [ 2, 0, 0 ],

    ccm: {
      url: 'https://akless.github.io/ccm/version/ccm-10.0.0.min.js',
      integrity: 'sha384-jAuOhbZgSNsyipeVp3ya2ApRISKQl6yeGQaJTY0SBLLl3MCJ610m6MthwchxHHFM',
      crossorigin: 'anonymous'
    },

    Instance: function () {

      var self = this;
      var my;           // contains privatized instance members

      this.init = function ( callback ) {

        // no Light DOM? => use empty fragment
        if ( !self.inner ) self.inner = document.createDocumentFragment();

        // Light DOM is given as HTML string? => use fragment with HTML string as innerHTML
        if ( typeof self.inner === 'string' ) self.inner = document.createRange().createContextualFragment( self.inner );

        // collect all ccm dependencies inside the Light DOM
        self.dependencies = []; collectDependencies( self.inner );

        callback();

        /**
         * collects all dependencies inside the given DOM Element Node (recursive function)
         * @param {Element} node
         */
        function collectDependencies( node ) {

          // iterate over all child DOM Element Nodes
          self.ccm.helper.makeIterable( node.children ).map( function ( child ) {

            // no ccm Custom Element? => abort and collect dependencies inside of it
            if ( child.tagName.indexOf( 'CCM-' ) !== 0 ) return collectDependencies( child );  // recursive call

            // generate ccm dependency out of founded ccm Custom Element
            var component = getComponent();
            var config = self.ccm.helper.generateConfig( child );
            config.parent = self;
            config.root = document.createElement( 'div' );
            self.dependencies.push( [ 'ccm.start', component, config ] );

            // replace founded ccm Custom Element with empty container for later embedding
            child.parentNode.replaceChild( config.root, child );

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
              var scripts = self.inner.querySelectorAll( 'script' );
              for ( var i = 0; i < scripts.length; i++ )
                if ( self.ccm.helper.getIndex( scripts[ i ].getAttribute( 'src' ) ) === index )
                  return scripts[ i ].getAttribute( 'src' );

            }

          } );

        }

      };

      this.ready = function ( callback ) {

        // privatize all possible instance members
        my = self.ccm.helper.privatize( self );

        callback();
      };

      this.start = function ( callback ) {

        // render content that is given via own ccm Custom Element
        self.ccm.helper.setContent( self.element, my.inner );

        // embed dependent components
        var i = 0; solveDependencies();

        /** solves all collected dependencies */
        function solveDependencies() {
          if ( i === my.dependencies.length ) { if ( callback ) callback(); return; }
          self.ccm.helper.solveDependency( my.dependencies, i++, solveDependencies );
        }

      };

    }

  };

  function p(){window.ccm[v].component(component)}var f="ccm."+component.name+(component.version?"-"+component.version.join("."):"")+".js";if(window.ccm&&null===window.ccm.files[f])window.ccm.files[f]=component;else{var n=window.ccm&&window.ccm.components[component.name];n&&n.ccm&&(component.ccm=n.ccm),"string"==typeof component.ccm&&(component.ccm={url:component.ccm});var v=component.ccm.url.split("/").pop().split("-");if(v.length>1?(v=v[1].split("."),v.pop(),"min"===v[v.length-1]&&v.pop(),v=v.join(".")):v="latest",window.ccm&&window.ccm[v])p();else{var e=document.createElement("script");document.head.appendChild(e),component.ccm.integrity&&e.setAttribute("integrity",component.ccm.integrity),component.ccm.crossorigin&&e.setAttribute("crossorigin",component.ccm.crossorigin),e.onload=function(){p(),document.head.removeChild(e)},e.src=component.ccm.url}}
}() );