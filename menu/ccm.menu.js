/**
 * @overview ccm component for rendering a menu
 * @author André Kless <andre.kless@web.de> 2017
 * @license The MIT License (MIT)
 * @version latest (1.0.0)
 * TODO: default selected menu entry for menu component
 * TODO: routing
 * TODO: logging
 * TODO: docu comments -> API
 * TODO: unit tests
 * TODO: multilingualism
 */

{
  var component = {

    /**
     * unique component name
     * @type {string}
     */
    name: 'menu',

    /**
     * recommended used framework version
     * @type {string}
     */
    ccm: 'https://akless.github.io/ccm/ccm.js',

    /**
     * default instance configuration
     * @type {object}
     */
    config: {

      "html": {
        "main": {
          "id": "main",
          "inner": [
            { "id": "entries" },
            { "id": "content" }
          ]
        },
        "entry": {
          "class": "entry",
          "inner": "%label%",
          "onclick": "%click%"
        }
      },
      "css": [ "ccm.load", "../menu/resources/default.css" ],
      "data": { "entries": [] }

  //  user:   [ 'ccm.instance', 'https://akless.github.io/ccm-components/user/versions/ccm.user-2.0.0.min.js' ],
  //  logger: [ 'ccm.instance', 'https://akless.github.io/ccm-components/log/versions/ccm.log-1.0.0.min.js', [ 'ccm.get', 'https://akless.github.io/ccm-components/log/resources/configs.min.js', 'greedy' ] ],
  //  onchange: function ( instance, data ) { console.log( data ); }

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
       * @type {object}
       */
      let my;

      /**
       * shortcut to help functions
       * @type {Object.<string,function>}
       */
      let $;

      /**
       * @summary is called once after all dependencies are solved and is then deleted
       * @description
       * Called one-time when this <i>ccm</i> instance is created, all dependencies are solved and before dependent components, instances and datastores are initialized.
       * This method will be removed by <i>ccm</i> after the one-time call.
       * @param {function} callback - called after all synchronous and asynchronous operations are complete
       */
      this.init = callback => {

        // no given Light DOM? => abort
        if ( !self.inner ) return callback();

        // menu entries are given via inner HTML of own Custom Element? => use it with higher priority
        const entries = [];
        [ ...self.inner.querySelectorAll( 'entry' ) ].map( entry => {
          entries.push( { label: entry.getAttribute( 'label' ) || entry.querySelector( 'label' ).innerHTML, content: entry.innerHTML } );
        } );
        self.data = { entries: entries };

        callback();
      };

      /**
       * @summary is called once after the initialization and is then deleted
       * @description
       * Called one-time when this <i>ccm</i> instance and dependent components, instances and datastores are initialized and ready.
       * This method will be removed by <i>ccm</i> after the one-time call.
       * @param {function} callback - called after all synchronous and asynchronous operations are complete
       */
      this.ready = callback => {

        // set shortcut to help functions
        $ = self.ccm.helper;

        // privatize all possible instance members
        my = $.privatize( self );

        callback();
      };

      /**
       * starts the instance
       * @param {function} [callback] - called after all synchronous and asynchronous operations are complete
       */
      this.start = callback => {

        // get app-specific data
        $.dataset( my.data, dataset => {

          // prepare main HTML structure
          const main_elem = $.html( my.html.main );

          // prepare menu entries
          dataset.entries.map( renderMenuEntry );

        } );

        // rendering completed => perform callback
        callback && callback();

        /**
         * prepares a menu entry
         * @param {string|object} entry_data - data for menu entry
         * @param {string|object|Element} entry_data.label - menu entry label
         * @param {string|object|Element} entry_data.content - menu entry content
         * @param {function} entry_data.action - menu entry action
         */
        function renderMenuEntry( entry_data ) {

          //
          if ( typeof entry_data === 'string' ) entry_data = { label: entry_data };

          const enty_element = $.html( my.html.entry, { label: entry_data.label } );

        }

      };

    }

  };

  function p(){window.ccm[v].component(component)}const f="ccm."+component.name+(component.version?"-"+component.version.join("."):"")+".js";if(window.ccm&&null===window.ccm.files[f])window.ccm.files[f]=component;else{const n=window.ccm&&window.ccm.components[component.name];n&&n.ccm&&(component.ccm=n.ccm),"string"==typeof component.ccm&&(component.ccm={url:component.ccm});var v=component.ccm.url.split("/").pop().split("-");if(v.length>1?(v=v[1].split("."),v.pop(),"min"===v[v.length-1]&&v.pop(),v=v.join(".")):v="latest",window.ccm&&window.ccm[v])p();else{const e=document.createElement("script");document.head.appendChild(e),component.ccm.integrity&&e.setAttribute("integrity",component.ccm.integrity),component.ccm.crossorigin&&e.setAttribute("crossorigin",component.ccm.crossorigin),e.onload=function(){p(),document.head.removeChild(e)},e.src=component.ccm.url}}
}