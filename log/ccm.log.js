/**
 * @overview <i>ccm</i> component for data logging
 * @author André Kless <andre.kless@web.de> 2016-2017
 * @license The MIT License (MIT)
 */

ccm.component( {

  name: 'log',

  config: {

    hash:     [ ccm.load, '../libs/md5/md5.min.js' ],
    logging:  {},
    onfinish: function ( instance, results ) { console.log( results ); }

    // events: {string[]} logged events, default: all
    // logging.browser: {boolean} log browser informations
    // logging.parent:  {boolean} log ccm context parent information
    // logging.root:    {boolean} log ccm context root information
    // logging.user:    {boolean} log user informations
    // logging.website: {boolean} log website informations

  },

  Instance: function () {

    var self = this;
    var my;           // contains privatized instance members
    var id;           // global unique id of this instance

    this.ready = function ( callback ) {

      // privatize all possible instance members
      my = ccm.helper.privatize( self );

      // determine global unique instance id
      id = ccm.helper.generateKey();

      callback();
    };

    /**
     * logs event data
     * @param {string} event - unique event index
     * @param {object} [data] - event specific informations
     */
    this.log = function ( event, data ) {

      // ignored event? => abort
      if ( my.events && !my.events[ event ] ) return;

      /**
       * result data
       * @type {object}
       */
      var results = { instance: id, event: event };

      // add event specific informations
      if ( data !== undefined ) results.data = ccm.helper.clone( data );

      // add browser informations
      if ( self.logging.browser ) results.browser = {
        appCodeName: navigator.appCodeName,
        appName: navigator.appName,
        appVersion: navigator.appVersion,
        language: navigator.language,
        oscpu: navigator.oscpu,
        platform: navigator.platform,
        userAgent: navigator.userAgent
      };

      // add ccm context parent informations
      if ( self.logging.parent && self.parent ) results.parent = {
        name:    self.parent.component.name,
        version: self.parent.component.version
      };

      // add ccm context root informations
      if ( self.logging.root ) {
        var root = ccm.context.root( self );
        if ( root.component.name !== self.component.name ) results.root = {
          name:    root.component.name,
          version: root.component.version
        };
      }

      // add user informations
      if ( self.logging.user ) {
        var user = ccm.context.find( self, 'user' );
        if ( user ) results.user = {
          key:     user.isLoggedIn() ? ( md5 ? md5( md5( user.data().key ) ) : user.data().key ) : null,
          sign_on: user.getSignOn()
        };
      }

      // add website informations
      if ( self.logging.website ) results.website = window.location.href;

      // provide result data
      ccm.helper.onFinish( self, results );

    };

  }

} );