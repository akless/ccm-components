/**
 * @overview <i>ccm</i> component for menus
 * @author André Kless <andre.kless@web.de> 2015-2016
 * @license The MIT License (MIT)
 */

ccm.component( /** @lends ccm.components.menu */ {

  /*-------------------------------------------- public component members --------------------------------------------*/

  /**
   * @summary component index
   * @type {ccm.types.index}
   */
  index: 'menu',

  /**
   * @summary default instance configuration
   * @type {ccm.components.menu.types.config}
   */
  config: {

    style: [ ccm.load,  '../menu/layouts/default.css' ],
    html:  [ ccm.store, '../menu/templates.json' ],
    data:  {
      store: [ ccm.store, '../menu/datastore.json' ],
      key:   'demo'
    },
    onClick: function ( entry, $content, instance ) { console.log( entry, $content, instance ); }
  },

  /*-------------------------------------------- public component classes --------------------------------------------*/

  /**
   * @summary constructor for creating <i>ccm</i> instances out of this component
   * @class
   */
  Instance: function () {

    /*------------------------------------- private and public instance members --------------------------------------*/

    /**
     * @summary own context
     * @private
     */
    var self = this;

    /**
     * @summary contains privatized config members
     * @type {ccm.components.menu.types.config}
     * @private
     */
    var my;

    /*------------------------------------------- public instance methods --------------------------------------------*/

    /**
     * @summary initialize <i>ccm</i> instance
     * @description
     * Called one-time when this <i>ccm</i> instance is created, all dependencies are solved and before dependent <i>ccm</i> components, instances and datastores are initialized.
     * This method will be removed by <i>ccm</i> after the one-time call.
     * @param {function} callback - callback when this instance is initialized
     * @ignore
     */
    this.init = function ( callback ) {

      // privatize security relevant config members
      my = ccm.helper.privatize( self, 'html', 'data', 'selected', 'onClick' );

      // perform callback
      callback();

    };

    /**
     * @summary render content in own website area
     * @param {function} [callback] - callback when content is rendered
     */
    this.render = function ( callback ) {

      /**
       * website area for own content
       * @type {ccm.types.element}
       */
      var $element = ccm.helper.element( self );

      // get dataset for rendering
      ccm.helper.dataset( my.data, function ( dataset ) {

        // render main HTML structure
        $element.html( ccm.helper.html( my.html.get( 'main' ) ) );

        /**
         * website area for menu entries
         * @type {ccm.type.element}
         */
        var $entries = ccm.helper.find( self, '.entries' );

        /**
         * website area for menu entry content
         * @type {ccm.type.element}
         */
        var $content = ccm.helper.find( self, '.content' );

        // render menu entries
        dataset.entries.map( renderMenuEntry );

        // prevent click event for not clickable parts of an menu entry
        ccm.helper.find( self, '.noclick' ).click( function ( event ) { event.stopPropagation(); } );

        // click pre-selected menu entry
        if ( my.selected ) ccm.helper.find( self, '.entry' ).get( my.selected - 1 ).click();

        // perform callback
        if ( callback ) callback();

        /**
         * render menu entry
         * @param {ccm.components.menu.types.entry|string} entry - menu entry dataset or label
         * @param {number} i - array index of the menu entry
         */
        function renderMenuEntry( entry, i ) {

          if ( typeof entry === 'string' )
            entry = { label: entry };

          // content is a ccm dependency? => solve dependency
          if ( ccm.helper.isDependency( entry.content ) )
            ccm.helper.solveDependency( entry, 'content', callback );

          // render menu entry HTML structure
          $entries.append( ccm.helper.html( my.html.get( 'entry' ), {
            label: entry.label,
            onclick: click
          } ) );

          /**
           * callback when ccm dependency is solved
           */
          function callback( result ) {

            // content is a ccm instance or component? => set website area
            if ( ccm.helper.isInstance( result ) || ccm.helper.isComponent( result ) ) {
              result.element = $content;
              if ( ccm.helper.isInstance( result ) )
                result.parent = self;
            }

          }

          /**
           * callback when menu entry is clicked
           */
          function click() {

            /**
             * website area of menu entry
             * @type {ccm.types.element}
             */
            var $entry = jQuery( this );

            // clicked selected entry? => clear content
            if ( $entry.hasClass( 'selected' ) ) {
              $content.html( '' );
              $entry.removeClass( 'selected' );
              return;
            }

            // highlight selected menu entry
            ccm.helper.find( self, '.entry' ).removeClass( 'selected' );
            $entry.addClass( 'selected' );

            // clear website area for menu entry content
            $content.html( '' );

            // render menu entry content
            if ( entry.content ) {

              // content is ccm instance? => render content by ccm instance
              if ( ccm.helper.isInstance( entry.content ) || ccm.helper.isComponent( entry.content ) ) entry.content.render();

              // content is ccm HTML data? => render content by ccm HTML data
              else if ( typeof ( entry.content ) === 'object' ) return $content.html( ccm.helper.html( entry.content ) );

              // render content
              else $content.html( ccm.helper.val( entry.content ) );

            }

            // perform menu entry action(s)
            if ( entry.actions )
              if ( typeof ( entry.actions ) === 'function' )
                entry.actions();
              else
                entry.actions.map( function ( action ) { ccm.helper.action( action ); } );

            // add menu entry number to entry dataset
            entry.nr = i + 1;

            // perform callback for clicked menu entry
            if ( my.onClick ) my.onClick( entry, $content, self );

          }

        }

      } );

    };

  }

  /*------------------------------------------------ type definitions ------------------------------------------------*/

  /**
   * @namespace ccm.components.menu
   */

  /**
   * @namespace ccm.components.menu.types
   */

  /**
   * @summary <i>ccm</i> instance configuration
   * @typedef {ccm.types.config} ccm.components.menu.types.config
   * @property {ccm.types.element} element - <i>ccm</i> instance website area
   * @property {ccm.types.dependency} style - CSS for own website area
   * @property {string} classes - HTML classes for own website area
   * @property {ccm.types.dependency} data.store - <i>ccm</i> datastore that contains the [dataset for rendering]{@link ccm.components.menu.types.dataset}
   * @property {ccm.types.key} data.key - key of [dataset for rendering]{@link ccm.components.menu.types.dataset}
   * @property {number} selected - pre-selected menu entry
   * @property {ccm.components.menu.types.onClick} onClick - callback for click event of the menu entries
   * @example {
   *   style: [ ccm.load,  '../menu/layouts/default.css' ],
   *   html:  [ ccm.store, '../menu/templates.json' ],
   *   data:  {
   *     store: [ ccm.store, '../menu/datastore.json' ],
   *     key:   'demo'
   *   },
   *   onClick: function ( entry ) { console.log( entry ); }
   * }
   */

  /**
   * @summary dataset for rendering
   * @typedef {ccm.types.dataset} ccm.components.menu.types.dataset
   * @property {ccm.types.key} key - dataset key
   * @property {ccm.components.menu.types.entry[]|string[]} entries - menu entry datasets or labels
   * @example {
   *   "key": "demo",
   *   "entries": [
   *     {
   *       "label": "ccm.input.js",
   *       "content": [ "ccm.instance", "../input/ccm.input.js" ],
   *       "actions": [ [ "console.log", "clicked: ccm.input.js" ] ]
   *     },
   *     {
   *       "label": "ccm.config.js",
   *       "content": [ "ccm.instance", "../config/ccm.config.js" ],
   *       "actions": [ [ "console.log", "clicked: ccm.config.js" ] ]
   *     }
   *   ]
   * }
   */

  /**
   * @summary menu entry dataset
   * @typedef {object} ccm.components.menu.types.entry
   * @property {string} label - menu entry label
   * @property {string|ccm.types.html|ccm.types.instance|ccm.types.component} content - menu entry content
   * @property {function|ccm.types.action[]} action - menu entry click actions
   * @property {number} nr - menu entry number (only set in dataset via onClick callback)
   * @example {
   *   "label": "ccm.input.js",
   *   "content": [ "ccm.instance", "../input/ccm.input.js" ],
   *   "actions": [ [ "console.log", "clicked: ccm.input.js" ] ],
   *   "nr": 1
   * }
   */

  /**
   * @callback ccm.components.menu.types.onClick
   * @summary callback for menu entry click event
   * @param {ccm.components.menu.types.entry} entry - dataset of clicked menu entry (with included menu entry number)
   * @param {ccm.types.element} $content - website area for menu entry content
   * @param {ccm.types.instance} instance - <i>ccm</i> instance for this menu
   * @example function ( entry, $content, instance ) { console.log( entry, $content, instance ); }
   */

  /**
   * @external ccm.types
   * @see {@link http://akless.github.io/ccm-developer/api/ccm/ccm.types.html}
   */

} );