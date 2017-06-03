/**
 * @overview <i>ccm</i> component for [youtube player]{@link https://developers.google.com/youtube/iframe_api_reference}
 * @author André Kless <andre.kless@web.de> 2016
 * @license The MIT License (MIT)
 */

ccm.component( /** @lends ccm.components.youtube */ {

  /*-------------------------------------------- public component members --------------------------------------------*/

  /**
   * @summary component index
   * @type {ccm.types.index}
   */
  index: 'youtube',

  /**
   * @summary default instance configuration
   * @type {ccm.components.youtube.types.config}
   */
  config: {

    data:  { key: 'M7lc1UVf-VE' }

  },

  /**
   * @summary waitlist of init callbacks from own instances that wait for loaded youtube iframe api
   * @description This property will be removed by <i>ccm</i> after initialisation.
   * @type {function[]}
   */
  waiter: [],

  /*-------------------------------------------- public component methods --------------------------------------------*/

  /**
   * @summary initialize <i>ccm</i> component
   * @description
   * Called one-time when this <i>ccm</i> component is registered and before any ccm instance is created out of this component.
   * There is no guarantee that a asynchron operation in this init function is finished before the call of own instance init functions.
   * This method will be removed by <i>ccm</i> after the one-time call.
   * @param {function} callback - callback when this instance is initialized
   */
  init: function ( callback ) {

    /**
     * reference to this component
     * @type {ccm.component}
     */
    var self = this;

    // set global ready callback of youtube iframe api
    window.onYouTubeIframeAPIReady = function () {

      // finish initialisation of waiting own instances
      for ( var i = 0; i < self.waiter.length; i++ )
        self.waiter[ i ]();

      // delete waitlist property
      delete self.waiter;

      // perform callback
      if ( callback ) callback();

    };

    // load youtube iframe api
    jQuery.getScript( 'https://www.youtube.com/iframe_api' );

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
     * @type {ccm.components.youtube.types.config}
     * @private
     */
    var my;

    /**
     * @summary player settings
     * @type {object}
     * @private
     */
    var settings;

    /**
     * @summary player event listener
     * @type {Object.<string,function>}
     * @private
     */
    var events;

    /**
     * @summary [youtube player]{@link https://developers.google.com/youtube/iframe_api_reference#Playback_controls}
     * @type {object}
     */
    this.player = null;

    /*------------------------------------------- public instance methods --------------------------------------------*/

    /**
     * @summary initialize <i>ccm</i> instance
     * @description
     * Called one-time when this <i>ccm</i> instance is created, all dependencies are solved and before dependent <i>ccm</i> components, instances and datastores are initialized.
     * This method will be removed by <i>ccm</i> after the one-time call.
     * @param {function} callback - callback when this instance is initialized
     */
    this.init = function ( callback ) {

      // loading of youtube iframe api not finished? => wait for finish
      if ( self.component.waiter ) self.component.waiter.push( callback ); else callback();

    };

    /**
     * @summary when <i>ccm</i> instance is ready
     * @description
     * Called one-time when this <i>ccm</i> instance and dependent <i>ccm</i> components, instances and datastores are initialized and ready.
     * This method will be removed by <i>ccm</i> after the one-time call.
     * @param {function} callback - callback when this instance is ready
     * @ignore
     */
    this.ready = function ( callback ) {

      // privatize security relevant config members
      my = ccm.helper.privatize( self, 'data', 'user', 'bigdata' );

      // privatize player settings relevant config members
      settings = ccm.helper.privatize( self, 'height', 'width', 'playerVars' );
      settings.events = ccm.helper.privatize( self, 'onReady', 'onStateChange', 'onPlaybackQualityChange', 'onPlaybackRateChange', 'onError', 'onApiChange' );

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
      ccm.helper.dataset( self, function ( dataset ) {

        // add video ID in player settings
        settings.videoId = dataset.id || dataset.key;

        /**
         * HTML ID of website area for own content
         * @type {string}
         */
        var html_id = ccm.helper.getElementID( self );

        // render main HTML structure
        $element.html( '<div class="iframe"><div id="' + html_id + '_iframe"></div></div>' );

        // set CSS for own HTML structure to make the Player responsive
        setCSS();

        // embed youtube player
        self.player = new YT.Player( html_id + '_iframe', settings );

        // perform callback
        if ( callback ) callback();

        /**
         * set CSS for own HTML structure to make the iFrame responsive
         */
        function setCSS() {

          /**
           * iFrame HTML tag
           * @type {ccm.types.element}
           */
          var $iframe = jQuery( '#' + html_id + '_iframe' );

          $element.css( 'overflow', 'hidden' );

          ccm.helper.find( self, '.iframe' ).css( {
            position: 'relative',
            'padding-bottom': '55%',
            'padding-top': '15px',
            height: 0,
            overflow: 'hidden'
          } );

          $iframe.css( {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%'
          } );

          var value;
          if ( value = $iframe.attr( 'width'  ) ) $element.css( 'max-width',  value + 'px' );
          if ( value = $iframe.attr( 'height' ) ) $element.css( 'max-height', value + 'px' );

        }

      } );

    };

  }

  /*------------------------------------------------ type definitions ------------------------------------------------*/

  /**
   * @namespace ccm.components.youtube
   */

  /**
   * @summary <i>ccm</i> instance configuration
   * @typedef {ccm.config} ccm.components.youtube.config
   * @property {string} classes - css classes for own website area
   * @property {ccm.element} element - own website area
   * @property {ccm.key} key - key of [youtube dataset]{@link ccm.components.youtube.dataset} for rendering
   * @property {ccm.store} store - <i>ccm</i> datastore that contains the [youtube dataset]{@link ccm.components.youtube.dataset} for rendering
   * @property {ccm.style} style - css for own content
   * @property {ccm.instance} user - <i>ccm</i> instance for user authentication
   *
   * @property {number} width - player width (default: 640)
   * @property {number} height - player height (default: 390)
   * @property {object} vars - [player parameter]{@link https://developers.google.com/youtube/player_parameters#Parameters}
   * @property {function} onReady - [onReady]{@link https://developers.google.com/youtube/iframe_api_reference#onReady} callback
   * @property {function} onStateChange - [onStateChange]{@link https://developers.google.com/youtube/iframe_api_reference#onStateChange} callback
   * @property {function} onPlaybackQualityChange - [onPlaybackQualityChange]{@link https://developers.google.com/youtube/iframe_api_reference#onPlaybackQualityChange} callback
   * @property {function} onPlaybackRateChange - [onPlaybackRateChange]{@link https://developers.google.com/youtube/iframe_api_reference#onPlaybackRateChange} callback
   * @property {function} onError - [onError]{@link https://developers.google.com/youtube/iframe_api_reference#onError} callback
   * @property {function} onApiChange - [onApiChange]{@link https://developers.google.com/youtube/iframe_api_reference#onApiChange} callback
   */

  /**
   * @summary chat dataset for rendering
   * @typedef {ccm.dataset} ccm.components.youtube.dataset
   * @property {ccm.key} key - dataset key
   * @property {string} id - youtube video id
   */

  /**
   * @external ccm.types
   * @see {@link http://akless.github.io/ccm-developer/api/ccm/ccm.types.html}
   */

} );