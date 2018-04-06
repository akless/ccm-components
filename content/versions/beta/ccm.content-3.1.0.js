/**
 * @overview ccm component for rendering a predefined content
 * @author André Kless <andre.kless@web.de> 2016-2018
 * @license The MIT License (MIT)
 * @version 3.1.0
 * @changes
 * version 3.1.0 (06.04.2018):
 * - standard configurations specified in component dependencies are considered
 * version 3.0.0 (07.03.2018):
 * - uses ccm v15.0.2
 * - uses ES6 syntax
 * - dynamic replacement of placeholders
 * - dependencies are solved in parallel
 * version 2.0.0 (18.10.2017):
 * - uses ccm v11.5.0 instead of v8.1.0
 * - shortened component backbone
 * - use fragment instead of empty container as default Light DOM
 * - Light DOM can be given as HTML string via 'inner' config property
 * - removed no more needed ccm.helper.protect calls
 * - <source> tag for URL of inner used ccm elements
 * - accept ccm HTML data for config property "inner"
 * version 1.0.0 (28.07.2017)
 */

{
  var component = {

    /**
     * unique component name
     * @type {string}
     */
    name: 'content',

    /**
     * component version
     * @type {number[]}
     */
    version: [ 3, 1, 0 ],

    /**
     * reference to used framework version
     * @type {object}
     */
    ccm: {
      url: 'https://akless.github.io/ccm/version/ccm-15.0.2.min.js',
      integrity: 'sha384-4X0IFdACgz2SAKu0knklA+SRQ6OVU4GipKhm7p6l7e7k/CIM8cjCFprWmM4qkbQz',
      crossorigin: 'anonymous'
    },

    /**
     * default instance configuration
     * @type {Object}
     */
    config: {

  //  inner: 'Hello, World!',       // Light DOM (could also be given as HTML string or ccm HTML data)
  //  placeholder: { foo: 'bar' }   // replaces all '%foo%' with 'bar'

    },

    /**
     * for creating instances out of this component
     * @constructor
     */
    Instance: function () {

      /**
       * own reference for inner functions
       * @type {Instance}
       */
      const self = this;

      /**
       * privatized instance members
       * @type {Object}
       */
      let my;

      /**
       * shortcut to help functions
       * @type {Object.<string,function>}
       */
      let $;

      /**
       * is called once after all dependencies are solved and is then deleted
       * @param {function} callback - called after all synchronous and asynchronous operations are complete
       */
      this.init = callback => {

        // set shortcut to help functions
        $ = self.ccm.helper;

        // no Light DOM? => use empty fragment
        if ( !self.inner ) self.inner = document.createDocumentFragment();

        // Light DOM is given as HTML string? => use fragment with HTML string as innerHTML
        if ( typeof self.inner === 'string' ) self.inner = document.createRange().createContextualFragment( self.inner );

        // Light DOM is given as ccm HTML data? => convert to HTML DOM Elements
        if ( $.isObject( self.inner ) && !$.isElementNode( self.inner ) )
          self.inner = $.html( self.inner );

        // dynamic replacement of placeholders
        if ( self.placeholder ) self.inner.innerHTML = $.format( self.inner.innerHTML, self.placeholder );

        // collect all ccm dependencies in Light DOM
        if ( !self.dependencies ) self.dependencies = []; collectDependencies( self.inner );

        callback();

        /**
         * collects all dependencies in given DOM Element Node (recursive)
         * @param {Element} node - DOM Element Node
         */
        function collectDependencies( node ) {

          // iterate over all child DOM Element Nodes
          [ ...node.children ].map( child => {

            // no ccm Custom Element? => abort and collect dependencies inside of it
            if ( child.tagName.indexOf( 'CCM-' ) !== 0 ) return collectDependencies( child );  // recursive call

            // generate ccm dependency out of founded ccm Custom Element
            const component = getComponent(); if ( !component ) return;
            const config = $.generateConfig( child );
            config.parent = self;
            config.root = document.createElement( 'div' );
            self.dependencies.push( $.isComponent( component ) ? [ component, config ] : [ 'ccm.start', component, config ] );

            // replace founded ccm Custom Element with empty container for later embedding
            child.parentNode.replaceChild( config.root, child );

            /**
             * gets object, index or URL of ccm component that corresponds to founded ccm Custom Element
             * @returns {Object|string}
             */
            function getComponent() {

              /**
               * index of ccm component
               * @type {string}
               */
              const index = child.tagName.substr( 4 ).toLowerCase();

              // has dependency to ccm component? => result is component object
              if ( $.isComponent( self[ index ] ) ) return self[ index ];

              // ccm component is already registered? => index is enough for embedding (otherwise URL is needed)
              if ( self.ccm.component( index ) ) return index;

              // search inner HTML of own Custom Element for a source tag that contains the ccm component URL
              const sources = self.inner.querySelectorAll( 'source' );
              for ( let i = 0; i < sources.length; i++ )
                if ( $.getIndex( sources[ i ].getAttribute( 'src' ) ) === index )
                  return sources[ i ].getAttribute( 'src' );

            }

          } );

        }

      };

      /**
       * is called once after initialization and is then deleted
       * @param {function} callback - called after all synchronous and asynchronous operations are complete
       */
      this.ready = callback => {

        // privatize all possible instance members
        my = $.privatize( self );

        callback();
      };

      /**
       * starts the instance
       * @param {function} [callback] - called after all synchronous and asynchronous operations are complete
       */
      this.start = callback => {

        // render content that is given via Light DOM
        $.setContent( self.element, my.inner );

        // embed dependent components
        let counter = my.dependencies.length + 1;
        my.dependencies.map( ( dependency, i ) => {
          if ( $.isComponent( my.dependencies[ i ][ 0 ] ) )
            my.dependencies[ i ][ 0 ].start( my.dependencies[ i ][ 1 ], check );
          else
            $.solveDependency( my.dependencies, i, check )
        } );
        check();
        function check() { !--counter && callback && callback(); }

      };

    }

  };

  function p(){window.ccm[v].component(component)}const f="ccm."+component.name+(component.version?"-"+component.version.join("."):"")+".js";if(window.ccm&&null===window.ccm.files[f])window.ccm.files[f]=component;else{const n=window.ccm&&window.ccm.components[component.name];n&&n.ccm&&(component.ccm=n.ccm),"string"==typeof component.ccm&&(component.ccm={url:component.ccm});var v=component.ccm.url.split("/").pop().split("-");if(v.length>1?(v=v[1].split("."),v.pop(),"min"===v[v.length-1]&&v.pop(),v=v.join(".")):v="latest",window.ccm&&window.ccm[v])p();else{const e=document.createElement("script");document.head.appendChild(e),component.ccm.integrity&&e.setAttribute("integrity",component.ccm.integrity),component.ccm.crossorigin&&e.setAttribute("crossorigin",component.ccm.crossorigin),e.onload=function(){p(),document.head.removeChild(e)},e.src=component.ccm.url}}
}