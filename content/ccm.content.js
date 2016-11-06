/**
 * @overview <i>ccm</i> component for content
 * @author André Kless <andre.kless@web.de> 2016
 * @license The MIT License (MIT)
 */

ccm.component( /** @lends ccm.components.content */ {

  /*-------------------------------------------- public component members --------------------------------------------*/

  /**
   * @summary component index
   * @type {ccm.types.index}
   */
  index: 'content',

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
     * @type {ccm.components.config.types.config}
     */
    var my;

    /*------------------------------------------- public instance methods --------------------------------------------*/

    /**
     * @summary when <i>ccm</i> instance is ready
     * @description
     * Called one-time when this <i>ccm</i> instance and dependent <i>ccm</i> components, instances and datastores are initialized and ready.
     * This method will be removed by <i>ccm</i> after the one-time call.
     * @param {function} callback - callback when this instance is ready
     * @ignore
     */
    this.ready = function ( callback ) {

      // add inner custom ccm elements to own ccm context
      ccm.helper.catchComponentTags( self, function () {

        // privatize security relevant config members
        my = ccm.helper.privatize( self, 'childInstances', 'innerHTML' );

        // perform callback
        callback();

      } );

    };

    /**
     * @summary render content in own website area
     * @param {function} [callback] - callback when content is rendered
     */
    this.render = function ( callback ) {

      /**
       * website area for own content
       * @type {ccm.types.node}
       */
      var node = ccm.helper.element( self )[ 0 ];

      // clear website area for own content
      node.innerHTML = '';

      // append given content of innerHTML property
      appendInnerHTMLContent();

      // append given content of childNodes property
      appendChildNodesContent();

      // perform callback
      if ( callback ) callback();

      function appendInnerHTMLContent() {
        if ( my.innerHTML )
          if ( Array.isArray( my.innerHTML ) )
            my.innerHTML.map( append );
          else
            append( my.innerHTML );

        function append( content ) {
          if ( typeof content === 'object' && !ccm.helper.isElement( content ) && !ccm.helper.isNode( content ) )
            content = ccm.helper.html( content );
          if ( ccm.helper.isElement( content ) )
            content = content[ 0 ];
          if ( ccm.helper.isNode( content ) )
            node.appendChild( content );
          else
            node.innerHTML = content;
        }
      }

      function appendChildNodesContent() {
        if ( self.childNodes ) self.childNodes.map( function ( child ) {
          node.appendChild( child );
        } );
        for ( var key in my.childInstances )
          my.childInstances[ key ].render();
      }

    };

  }

  /*------------------------------------------------ type definitions ------------------------------------------------*/

  /**
   * @namespace ccm.components.content
   */

  /**
   * @namespace ccm.components.content.types
   */

  /**
   * @summary <i>ccm</i> instance configuration
   * @typedef {ccm.config} ccm.components.content.types.config
   * @property {ccm.types.element} element - <i>ccm</i> instance website area
   * @property {ccm.types.dependency} style - CSS for own website area
   * @property {string} classes - HTML classes for own website area
   * @property {string|ccm.types.html|ccm.types.element|Array.<string|ccm.types.html|ccm.types.element>} my.innerHTML - content for own website area
   * @example {
   *   element: jQuery( 'body' ),
   *   style:   [ ccm.load, '../config/layout.css' ],
   *   classes: 'ccm-config',
   *   innerHTML: [ 'Hello, <b>World</b>!', { tag: 'br' }, jQuery( '<i>this is example content</i>' ) ]
   * }
   */

  /**
   * @external ccm.types
   * @see {@link http://akless.github.io/ccm-developer/api/ccm/ccm.types.html}
   */

} );