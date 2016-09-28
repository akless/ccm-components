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
     * @summary initialize <i>ccm</i> instance
     * @description
     * Called one-time when this <i>ccm</i> instance is created, all dependencies are solved and before dependent <i>ccm</i> components, instances and datastores are initialized.
     * This method will be removed by <i>ccm</i> after the one-time call.
     * @param {function} callback - callback when this instance is initialized
     */
    this.init = function ( callback ) {

      // privatize security relevant config members
      my = ccm.helper.privatize( self, 'innerHTML' );

      // perform callback
      callback();

    };

    /**
     * @summary render content in own website area
     * @param {function} [callback] - callback when content is rendered
     */
    this.render = function ( callback ) {

      /**
       * already existing inner HTML structure of own website area
       * @type {ccm.types.element}
       */
      var $html = self.element.contents();

      /**
       * website area for own content
       * @type {ccm.types.element}
       */
      var $element = ccm.helper.element( self );

      // render call for ccm instances of inner website areas
      callRender( $html );

      function callRender( $html ) {
        $html.each( function () {
          if ( this.tagName && this.tagName.indexOf( 'CCM-' ) === 0 ) {
            var split = this.tagName.toLowerCase().split( '-' );
            switch ( split[ 1 ] ) {
              case 'load':
              case 'component':
              case 'instance':
              case 'proxy':
              case 'store':
              case 'dataset':
              case 'list':
                return;
            }
            self[ split.length < 3 ? split[ 1 ] : split[ 2 ] ].render();
          }
          else
            callRender( jQuery( this ).children() );
        } );
      }

      // put already existing inner HTML structure in website area for own content
      $element.html( $html );

      // append content for own website area
      if ( my.innerHTML )
        if ( Array.isArray( my.innerHTML ) )
          my.innerHTML.map( function ( content ) {
            $element.append( ccm.helper.isElement( content ) ? content : ccm.helper.html( content ) );
          } );
        else
          $element.append( ccm.helper.isElement( my.innerHTML ) ? my.innerHTML : ccm.helper.html( my.innerHTML ) );

      // perform callback
      if ( callback ) callback();

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