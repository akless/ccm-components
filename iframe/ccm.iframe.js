/**
 * @overview <i>ccm</i> component for iFrames
 * @author André Kless <andre.kless@web.de> 2016
 * @license The MIT License (MIT)
 */

ccm.component( /** @lends ccm.components.iframe */ {

  /*-------------------------------------------- public component members --------------------------------------------*/

  /**
   * @summary component index
   * @type {ccm.types.index}
   */
  index: 'iframe',

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
     * @type {ccm.components.iframe.types.config}
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
      my = ccm.helper.privatize( self, 'bigdata', 'embed', 'source' );

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

      // render main HTML structure
      $element.html( '<div class="iframe"><iframe></iframe></div><div class="source"></div>' );

      // has given embed code for the iFrame? => render iFrame by embed code
      if ( my.embed ) ccm.helper.find( self, '.iframe' ).html( my.embed );

      /**
       * iFrame HTML tag
       * @type {ccm.types.element}
       */
      var iframe = ccm.helper.find( self, 'iframe' );

      // integrate priority data for HTML attributes in the iFrame
      for ( var key in self )
        switch ( key ) {
          case 'component':
          case 'element':
          case 'id':
          case 'index':
          case 'init':
          case 'ready':
          case 'render':
            break;
          default:
            iframe.attr( key, self[ key ] );
        }

      // set CSS for own HTML structure to make the iFrame responsive
      setCSS();

      /**
       * source of the embedded content of the iFrame
       * @type {string}
       */
      var source = my.source === true ? iframe.attr( 'src' ) : my.source;

      // render link to source of the embedded content
      if ( source ) ccm.helper.find( self, '.source' ).html( '<a href="' + source + '" target="_blank">' + source + '</a>' );

      // set additional click action for the link
      ccm.helper.find( self, 'a' ).click( function () {

        // log click event
        if ( my.bigdata ) my.bigdata.log( 'link', { src: iframe.attr( 'src' ), link: source } );

      } );

      // log render event
      if ( my.bigdata ) my.bigdata.log( 'render', { src: iframe.attr( 'src' ), link: source } );

      // perform callback
      if ( callback ) callback();

      /**
       * set CSS for own HTML structure to make the iFrame responsive
       */
      function setCSS() {

        $element.css( 'overflow', 'hidden' );

        ccm.helper.find( self, '.iframe' ).css( {
          position: 'relative',
          'padding-bottom': '55%',
          'padding-top': '15px',
          height: 0,
          overflow: 'hidden'
        } );

        ccm.helper.find( self, 'iframe' ).css( {
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%'
        } );

        var value;
        if ( value = iframe.attr( 'width'  ) ) $element.css( 'max-width',  value + 'px' );
        if ( value = iframe.attr( 'height' ) ) $element.css( 'max-height', value + 'px' );

      }

    };

  }

  /*------------------------------------------------ type definitions ------------------------------------------------*/

  /**
   * @namespace ccm.components.iframe
   */

  /**
   * @namespace ccm.components.iframe.types
   */

  /**
   * @summary <i>ccm</i> instance configuration
   * @typedef {ccm.types.config} ccm.components.iframe.types.config
   * @property {ccm.types.element} element - <i>ccm</i> instance website area
   * @property {ccm.types.dependency} style - CSS for own website area
   * @property {string} classes - HTML classes for own website area
   * @property {ccm.types.dependency} bigdata - <i>ccm</i> instance for big data
   * @property {string} embed - embed code for the iFrame
   * @property {string} source - source of the embedded content of the iFrame
   * @example {
   *   element: jQuery( 'body' ),
   *   style:   [ ccm.load, '../iframe/default.css' ],
   *   classes: 'ccm-iframe'
   *   bigdata: [ ccm.instance, '../bigdata/ccm.bigdata.js' ],
   *   embed:   '<iframe src="https://docs.google.com/presentation/d/196o7rEZGyKnRVivqJfFiUF3ey8O5Iq0mbguKDQWCOms/embed?start=false&loop=false&delayms=3000" frameborder="0" width="480" height="299" allowfullscreen="true" mozallowfullscreen="true" webkitallowfullscreen="true"></iframe>',
   *   source:  'https://docs.google.com/presentation/d/196o7rEZGyKnRVivqJfFiUF3ey8O5Iq0mbguKDQWCOms/pub?start=false&loop=false&delayms=3000'
   *   // any other properties will be set as html attributes for the iframe HTML tag
   * }
   */

  /**
   * @external ccm.types
   * @see {@link http://akless.github.io/ccm-developer/api/ccm/ccm.types.html}
   */

} );

