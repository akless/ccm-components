/**
 * @overview ccm component for responsive iframe
 * @author Andre Kless <andre.kless@h-brs.de>, 2015
 * @license The MIT License (MIT)
 */

ccm.component( {

  /*-------------------------------------------- public component members --------------------------------------------*/

  /**
   * component name
   * @type {string}
   * @ignore
   */
  name: 'iframe',

  /**
   * @summary default instance configuration
   * @type {ccm.components.video.config}
   * @ignore
   */
  config: {

    title:      'Animation Big Bunny',
    embed_code: '<iframe width="560" height="315" src="https://www.youtube.com/embed/YE7VzlLtp-4" frameborder="0" allowfullscreen></iframe>',
    style:      [ ccm.load, '../iframe/iframe.css' ]

  },

  /*-------------------------------------------- public component classes --------------------------------------------*/

  /**
   * @alias ccm.components.video
   * @class
   */
  Instance: function () {

    /*----------------------------------------------- instance members -----------------------------------------------*/

    /**
     * @summary own context
     * @private
     * @type {ccm.instance}
     * @this ccm.instance
     */
    var self = this;

    /*------------------------------------------- public instance methods --------------------------------------------*/

    /**
     * @summary render content in own website area
     * @param {function} [callback] - callback when instance is rendered
     */
    this.render = function ( callback ) {

      /**
       * website area for own content
       * @type {ccm.element}
       */
      var element = ccm.helper.element( self );

      /**
       * video source
       * @type {string}
       */
      var source = ccm.helper.val( /\"(http.+?)\"/.exec( self.embed_code )[ 1 ], 'url' );

      // render video into own website area
      element.html( '<div class="video_iframe">' + ccm.helper.noScript( self.embed_code ) + '</div><div class="video_source">Source: <a href="' + source + '" target="_blank">' + source + '</a></div>' );

      // select source link
      element.find( 'a' ).click( function () {

        // log event
        if ( self.bigdata ) self.bigdata.log( 'click-source-link', { title: self.title, source: source } );

      } );

      // render video title
      if ( self.title ) element.prepend( '<h2>' + ccm.helper.htmlEncode( self.title ) + '</h2>' );

      // perform callback
      if ( callback ) callback();

    };

  }
} );

