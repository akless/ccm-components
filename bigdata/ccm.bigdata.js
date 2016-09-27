/**
 * @overview <i>ccm</i> component for big data
 * @author André Kless <andre.kless@web.de> 2016
 * @license The MIT License (MIT)
 */

ccm.component( /** @lends ccm.components.bigdata */ {

  /*-------------------------------------------- public component members --------------------------------------------*/

  /**
   * @summary component index
   * @type {ccm.types.index}
   */
  index: 'bigdata',

  /**
   * @summary default instance configuration
   * @type {ccm.components.bigdata.types.config}
   */
  config: {

    store:   [ ccm.store ],
    hash:    [ ccm.load, '../libs/md5/md5.min.js' ],
    logging: {
      browser: true,
      parent:  true,
      root:    true,
      user:    true,
      website: true
    }

  },

  /*-------------------------------------------- public component classes --------------------------------------------*/

  /**
   * @summary constructor for creating <i>ccm</i> instances out of this component
   * @class
   */
  Instance: function () {

    /*------------------------------------- private and public instance members --------------------------------------*/

    /**
     * @summary contains privatized config members
     * @type {ccm.components.bigdata.types.config}
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
      my = ccm.helper.privatize( this, 'store' );

      // perform callback
      callback();

    };

    /**
     * @summary log data in ccm datastore
     * @param {string} event - fired event
     * @param {*} [data] - relevant data
     */
    this.log = function ( event, data ) {

      // ignored event? => abort
      if ( my.events && !my.events[ event ] ) return;

      /**
       * dataset with event and data informations
       * @type {object}
       */
      var dataset = { event: event, data: data };

      // add browser informations
      if ( this.logging.browser ) dataset.browser = {
        appCodeName: navigator.appCodeName,
        appName: navigator.appName,
        appVersion: navigator.appVersion,
        language: navigator.language,
        oscpu: navigator.oscpu,
        platform: navigator.platform,
        userAgent: navigator.userAgent
      };

      // add ccm context parent informations
      if ( this.logging.parent && this.parent ) dataset.parent = {
        name:    this.parent.component.name,
        version: this.parent.component.version
      };

      // add ccm context root informations
      if ( this.logging.root ) {
        var root = ccm.context.root( this );
        if ( root.component.name !== this.component.name ) dataset.root = {
          name:    root.component.name,
          version: root.component.version
        };
      }

      // add user informations
      if ( this.logging.user ) {
        var user    = ccm.context.find( this, 'user' );
        if ( user ) dataset.user = {
          key:     user.isLoggedIn() ? ( md5 ? md5( md5( user.key ) ) : user.key ) : null,
          sign_on: user.getSignOn()
        };
      }

      // add website informations
      if ( this.logging.website ) dataset.website = window.location.href;

      // log dataset
      my.store.set( dataset, console.log );

    };

  }

  /*------------------------------------------------ type definitions ------------------------------------------------*/

  /**
   * @namespace ccm.components.bigdata
   */

  /**
   * @namespace ccm.components.bigdata.types
   */

  /**
   * @summary <i>ccm</i> instance configuration
   * @typedef {ccm.types.config} ccm.components.bigdata.types.config
   * @property {ccm.types.dependency} store - <i>ccm</i> datastore that contains the [big data]{@link ccm.components.bigdata.types.dataset}
   * @property {ccm.types.dependency} hash - javascript library for JavaScript MD5 implementation for pseudonymization
   * @property {Object.<string,boolean>} logging - contains flags to choose which kind of data will be logged automatically
   * @property {boolean} logging.browser - log browser informations
   * @property {boolean} logging.parent - log <i>ccm</i> context parent informations
   * @property {boolean} logging.root - log <i>ccm</i> context root informations
   * @property {boolean} logging.user - log user informations
   * @property {boolean} logging.website - log website informations
   * @property {string[]} events - events that will be logged (default: all events will be logged)
   * @example {
   *   store:   [ ccm.store ],
   *   hash:    [ ccm.load, '../libs/md5/md5.min.js' ],
   *   logging: {
   *     browser: true,
   *     parent:  true,
   *     root:    true,
   *     user:    true
   *   }
   * }
   */

  /**
   * @summary dataset for big data
   * @typedef {ccm.types.dataset} ccm.components.bigdata.types.dataset
   * @property {ccm.types.key} key - dataset key
   * @example {
   *   "key": "demo"
   * }
   */

  /**
   * @external ccm.types
   * @see {@link http://akless.github.io/ccm-developer/api/ccm/ccm.types.html}
   */

} );

