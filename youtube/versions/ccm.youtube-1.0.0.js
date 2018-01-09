/**
 * @overview ccm component for rendering a [YouTube Player]{@link https://developers.google.com/youtube/iframe_api_reference}
 * @author André Kless <andre.kless@web.de> 2016, 2018
 * @license The MIT License (MIT)
 * @version 1.0.0
 */

{
  var component = {

    /**
     * unique component name
     * @type {string}
     */
    name: 'youtube',

    /**
     * component version
     * @type {number[]}
     */
    version: [ 1, 0, 0 ],

    /**
     * reference to used framework version
     * @type {object}
     */
    ccm: {
      url: 'https://akless.github.io/ccm/version/ccm-14.0.3.min.js',
      integrity: 'sha384-bD0rTHnOlTmobIwFmxM+TORtE3XcgjRt7h9P7HGoxesXCtJC0dXq67IXZ0pY+uB3',
      crossorigin: 'anonymous'
    },

    /**
     * default instance configuration
     * @type {object}
     */
    config: {

      "html": {
        "id": "player",
        "inner": { "id": "iframe" }
      },
      "css": [ "ccm.load", "https://akless.github.io/ccm-components/youtube/resources/default.css" ],
      "videoId": "bHQqvYy5KYo"

  //  "height",                     {number} height - player height (default: 390)
  //  "width",                      {number} width - player width (default: 640)
  //  "playerVars",                 {object} params - [player parameter]{@link https://developers.google.com/youtube/player_parameters#Parameters}
  //  "onReady",                    {function} onReady - [onReady]{@link https://developers.google.com/youtube/iframe_api_reference#onReady} callback
  //  "onStateChange",              {function} onStateChange - [onStateChange]{@link https://developers.google.com/youtube/iframe_api_reference#onStateChange} callback
  //  "onPlaybackQualityChange",    {function} onPlaybackQualityChange - [onPlaybackQualityChange]{@link https://developers.google.com/youtube/iframe_api_reference#onPlaybackQualityChange} callback
  //  "onPlaybackRateChange",       {function} onPlaybackRateChange - [onPlaybackRateChange]{@link https://developers.google.com/youtube/iframe_api_reference#onPlaybackRateChange} callback
  //  "onError",                    {function} onError - [onError]{@link https://developers.google.com/youtube/iframe_api_reference#onError} callback
  //  "onApiChange",                {function} onApiChange - [onApiChange]{@link https://developers.google.com/youtube/iframe_api_reference#onApiChange} callback
  //  logger: [ 'ccm.instance', 'https://akless.github.io/ccm-components/log/versions/ccm.log-2.0.0.min.js', [ 'ccm.get', 'https://akless.github.io/ccm-components/log/resources/configs.min.js', 'greedy' ] ],
  //  user:   [ 'ccm.instance', 'https://akless.github.io/ccm-components/user/versions/ccm.user-2.0.1.min.js' ]

    },

    /**
     * waiting list of init callbacks of own instances waiting for the loaded YouTube iFrame API
     * @type {function[]}
     */
    waiter: [],

    /**
     * called once after the component is registered in the framework and is then deleted.
     * @param {function} callback - called after all synchronous and asynchronous operations are complete
     */
    init: function ( callback ) {

      /**
       * component reference
       * @type {object}
       */
      const self = this;

      // set global ready callback of YouTube iFrame API
      window.onYouTubeIframeAPIReady = () => {

        // completion of the waiting initializations
        self.waiter.map( callback => callback() );

        // delete the no more needed waiting list
        delete self.waiter;

        callback();
      };

      // start loading the YouTube iFrame API
      self.ccm.load( { url: 'https://www.youtube.com/iframe_api', type: 'js' } );

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
       * is called once after all dependencies are solved and is then deleted
       * @param {function} callback - called after all synchronous and asynchronous operations are complete
       */
      this.init = callback => {

        // is the loading of the API not finished yet? => wait for its completion
        if ( self.component.waiter ) return self.component.waiter.push( callback );

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
        self.logger && self.logger.log( 'ready', my );

        // prepare the YouTube Player settings
        my.settings = $.privatize( my, 'videoId', 'height', 'width', 'playerVars' );

        // prepare the YouTube Player event listeners
        my.settings.events = {};
        setEvent( 'onReady' );
        setEvent( 'onStateChange' );
        setEvent( 'onPlaybackQualityChange' );
        setEvent( 'onPlaybackRateChange' );
        setEvent( 'onError' );
        setEvent( 'onApiChange' );

        callback();

        /**
         * sets a YouTube Player event
         * @param {string} name - event name
         */
        function setEvent( name ) {

          // set event in the YouTube Player settings
          my.settings.events[ name ] = event => {

            // has logger instance? => log event
            self.logger && self.logger.log( name, event.data === null ? undefined : event.data );

            // perform individual event-specific callback
            my[ name ] && my[ name ]( event );

            // ending of the video? => perform 'finish' callback
            if ( name === 'onStateChange' && event.data === 0 ) $.onFinish( self );

          };

        }

      };

      /**
       * starts the instance
       * @param {function} [callback] - called after all synchronous and asynchronous operations are complete
       */
      this.start = callback => {

        // render main HTML structure
        $.setContent( self.element, $.html( my.html ) );

        // embed YouTube Player
        my.player = new YT.Player( self.element.querySelector( '#iframe' ), my.settings );

        // rendering completed => perform callback
        callback && callback();

      };

      /**
       * YouTube Player object
       * @returns {object}
       */
      this.get = () => my.player;

    }

  };

  function p(){window.ccm[v].component(component)}const f="ccm."+component.name+(component.version?"-"+component.version.join("."):"")+".js";if(window.ccm&&null===window.ccm.files[f])window.ccm.files[f]=component;else{const n=window.ccm&&window.ccm.components[component.name];n&&n.ccm&&(component.ccm=n.ccm),"string"==typeof component.ccm&&(component.ccm={url:component.ccm});var v=component.ccm.url.split("/").pop().split("-");if(v.length>1?(v=v[1].split("."),v.pop(),"min"===v[v.length-1]&&v.pop(),v=v.join(".")):v="latest",window.ccm&&window.ccm[v])p();else{const e=document.createElement("script");document.head.appendChild(e),component.ccm.integrity&&e.setAttribute("integrity",component.ccm.integrity),component.ccm.crossorigin&&e.setAttribute("crossorigin",component.ccm.crossorigin),e.onload=function(){p(),document.head.removeChild(e)},e.src=component.ccm.url}}
}