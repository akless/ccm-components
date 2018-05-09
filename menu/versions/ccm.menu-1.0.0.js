/**
 * @overview ccm component for rendering a menu
 * @author André Kless <andre.kless@web.de> 2015-2016, 2018
 * @license The MIT License (MIT)
 * @version 1.0.0
 * @changes
 * version 1.0.0 (09.05.2018): modernisation of old menu component
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
    ccm: 'https://ccmjs.github.io/ccm/ccm.js',

    /**
     * default instance configuration
     * @type {Object}
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
          "onclick": "%click%",
          "inner": {
            "class": "title"
          }
        }
      },
      "css": [ "ccm.load", "../menu/resources/default.css" ],
      "data": { "store": [ "ccm.store" ] }

  //  "selected": 2,
  //  "onclick": function ( event_data, instance ) { console.log( event_data, instance ); },
  //  "logger": [ "ccm.instance", "https://ccmjs.github.io/akless-components/log/versions/ccm.log-3.1.0.js", [ "ccm.get", "https://ccmjs.github.io/akless-components/log/resources/configs.js", "greedy" ] ]

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

        // no given Light DOM? => abort
        if ( !self.inner ) return callback();

        // determine dataset for rendering via Light DOM
        const entries = [];
        [ ...self.inner.children ].map( child => {
          if ( child.tagName && child.tagName === 'ENTRY' )
            entries.push( { title: child.getAttribute( 'title' ), content: child.innerHTML } );
        } );
        self.data = { entries: entries };

        callback();
      };

      /**
       * is called once after the initialization and is then deleted
       * @param {function} callback - called after all synchronous and asynchronous operations are complete
       */
      this.ready = callback => {

        // set shortcut to help functions
        $ = self.ccm.helper;

        // privatize all possible instance members
        my = $.privatize( self );

        // has logger instance? => log 'ready' event
        self.logger && self.logger.log( 'ready', $.clone( my ) );

        callback();
      };

      /**
       * starts the instance
       * @param {function} [callback] - called after all synchronous and asynchronous operations are complete
       */
      this.start = callback => {

        // has logger instance? => log 'start' event
        self.logger && self.logger.log( 'start' );

        // get dataset for rendering
        $.dataset( my.data, dataset => {

          /**
           * contains main HTML structure
           * @type {Element}
           */
          const main_elem = $.html( my.html.main );

          /**
           * contains menu entries
           * @type {Element}
           */
          const entries_elem = main_elem.querySelector( '#entries' );

          /**
           * contains menu entry content
           * @type {Element}
           */
          const content_elem = main_elem.querySelector( '#content' );

          // render menu entries
          if ( dataset.entries ) dataset.entries.map( renderMenuEntry );

          // put main HTML structure into frontend
          $.setContent( self.element, main_elem );

          // want specific preselected menu entry?  => trigger click event
          my.selected && entries_elem.querySelectorAll( '.entry' )[ my.selected - 1 ].click();

          // rendering completed => perform callback
          callback && callback();

          /**
           * render menu entry
           * @param {Object|string} entry_data - menu entry data or title
           * @param {number} i - array index of menu entry
           */
          function renderMenuEntry( entry_data, i ) {

            /**
             * menu entry
             * @type {Element}
             */
            const entry_elem = $.html( my.html.entry, { click: onClick } );

            // entry is given as string? => use it as menu entry title without content
            if ( typeof entry_data === 'string' ) entry_data = { title: entry_data };

            // add menu entry title
            $.setContent( entry_elem.querySelector( '.title' ), $.html( entry_data.title ) );

            // add menu entry to other entries
            entries_elem.appendChild( entry_elem );

            /** when menu entry is clicked */
            function onClick() {

              /**
               * clicked entry is already selected entry
               * @type {boolean}
               */
              const selected = entry_elem.classList.contains( 'selected' );

              /**
               * clicked menu entry event data
               * @type {Object}
               */
              const event_data = { title: entry_elem.textContent, nr: i + 1, selected: selected };

              // has logger instance? => log 'click' event
              self.logger && self.logger.log( 'click', $.clone( event_data ) );

              // unselect selected menu entry (if any)
              const selected_entry = entries_elem.querySelector( '.entry.selected' );
              if ( selected_entry ) selected_entry.classList.remove( 'selected' );

              // clear menu entry content
              $.setContent( content_elem, '' );

              // clicked already selected entry? => abort
              if ( selected ) return;

              // mark selected menu entry
              entry_elem.classList.add( 'selected' );

              // content is given as ccm dependency? => solve dependency
              $.isDependency( entry_data.content ) ? $.solveDependency( entry_data.content, result => entry_data.content = result ) : proceed();

              function proceed() {

                // render menu entry content
                if ( entry_data.content ) {

                  // content is ccm instance? => start instance
                  if ( $.isInstance( entry_data.content ) ) {
                    entry_data.content.root = content_elem;
                    entry_data.content.parent = self;
                    return entry_data.content.start();
                  }

                  // has content component? => render content via content component
                  if ( my.content ) return my.content.start( { root: content_elem, inner: entry_data.content } );

                  // render content
                  $.setContent( content_elem, $.html( entry_data.content ) );

                }

                // perform menu entry action(s)
                if ( entry_data.actions )
                  if ( typeof ( entry_data.actions ) === 'function' )
                    entry_data.actions();
                  else
                    entry_data.actions.map( action => $.action( action ) );

                // perform callback for clicked menu entry
                self.onclick && $.action( my.onclick, $.clone( event_data ), self );

              }

            }

          }

        } );

      };

    }

  };

  function p(){window.ccm[v].component(component)}const f="ccm."+component.name+(component.version?"-"+component.version.join("."):"")+".js";if(window.ccm&&null===window.ccm.files[f])window.ccm.files[f]=component;else{const n=window.ccm&&window.ccm.components[component.name];n&&n.ccm&&(component.ccm=n.ccm),"string"==typeof component.ccm&&(component.ccm={url:component.ccm});var v=component.ccm.url.split("/").pop().split("-");if(v.length>1?(v=v[1].split("."),v.pop(),"min"===v[v.length-1]&&v.pop(),v=v.join(".")):v="latest",window.ccm&&window.ccm[v])p();else{const e=document.createElement("script");document.head.appendChild(e),component.ccm.integrity&&e.setAttribute("integrity",component.ccm.integrity),component.ccm.crossorigin&&e.setAttribute("crossorigin",component.ccm.crossorigin),e.onload=function(){p(),document.head.removeChild(e)},e.src=component.ccm.url}}
}