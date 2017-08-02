/**
 * @overview <i>ccm</i> component for data logging
 * @author André Kless <andre.kless@web.de> 2016-2017
 * @license The MIT License (MIT)
 * TODO: docu comments -> API
 * TODO: unit tests
 * TODO: factory
 * TODO: multilingualism
 */

( function () {

  var ccm_version = '9.0.0';
  var ccm_url     = 'https://akless.github.io/ccm/ccm.js';

  var component_name = 'log';
  var component_obj  = {

    name: component_name,

    config: {

      logging: {}

  //  events: {string[]} logged events, default: all
  //  logging.data:    {boolean|string[]} log event specific informations (string[] -> log informations only for these events)
  //  logging.browser: {boolean|string[]} log browser informations
  //  logging.parent:  {boolean|string[]} log ccm context parent information
  //  logging.root:    {boolean|string[]} log ccm context root information
  //  logging.user:    {boolean|string[]} log user informations
  //  logging.website: {boolean|string[]} log website informations
  //  hash: [ 'ccm.load', 'https://akless.github.io/ccm-components/libs/md5/md5.min.js' ],
  //  onfinish: function ( instance, results ) { console.log( results ); }

    },

    Instance: function () {

      var self = this;
      var my;           // contains privatized instance members
      var id;           // global unique id of this instance

      this.init = function ( callback ) {

        arrToObj( self, 'events' );
        for ( var key in self.logging )
          arrToObj( self.logging[ key ] );

        callback();

        function arrToObj( obj, key ) {

          if ( !Array.isArray( obj[ key ] ) ) return;

          var result = {};
          obj[ key ].map( function ( value ) { result[ value ] = true; } );
          obj[ key ] = result;

        }

      };

      this.ready = function ( callback ) {

        // privatize all possible instance members
        my = self.ccm.helper.privatize( self );

        // generate global unique instance id
        id = self.ccm.helper.generateKey();

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
        var results = { session: id, event: event };

        // add event specific informations
        if ( data !== undefined && ( self.ccm.helper.isObject( my.logging.data ) ? my.logging.data[ event ] : my.logging.data ) ) results.data = self.ccm.helper.clone( data );

        // add browser informations
        if ( self.ccm.helper.isObject( my.logging.browser ) ? my.logging.browser[ event ] : my.logging.browser ) results.browser = {
          appCodeName: navigator.appCodeName,
          appName: navigator.appName,
          appVersion: navigator.appVersion,
          language: navigator.language,
          oscpu: navigator.oscpu,
          platform: navigator.platform,
          userAgent: navigator.userAgent
        };

        // add ccm context parent informations
        if ( self.parent && ( self.ccm.helper.isObject( my.logging.parent ) ? my.logging.parent[ event ] : my.logging.parent ) ) results.parent = {
          name:    self.parent.component.name,
          version: self.parent.component.version
        };

        // add ccm context root informations
        if ( self.parent && ( self.ccm.helper.isObject( my.logging.root ) ? my.logging.root[ event ] : my.logging.root ) ) {
          var root = self.ccm.context.root( self );
          results.root = {
            name:    root.component.name,
            version: root.component.version
          };
        }

        // add user informations
        if ( self.ccm.helper.isObject( my.logging.user ) ? my.logging.user[ event ] : my.logging.user ) {
          var user = self.ccm.context.find( self, 'user' );
          if ( user ) results.user = {
            key:     user.isLoggedIn() ? ( window.md5 ? md5( md5( user.data().key ) ) : user.data().key ) : null,
            sign_on: user.getSignOn()
          };
        }

        // add website informations
        if ( self.ccm.helper.isObject( my.logging.website ) ? my.logging.website[ event ] : my.logging.website ) results.website = window.location.href;

        // provide result data
        self.ccm.helper.onFinish( self, results );

      };

    }

  };

  var namespace = window.ccm && ccm.components[ component_name ]; if ( namespace ) { if ( namespace.ccm_version ) ccm_version = namespace.ccm_version; if ( namespace.ccm_url ) ccm_url = namespace.ccm_url; }
  if ( !window.ccm || !ccm[ ccm_version ] ) { var tag = document.createElement( 'script' ); document.head.appendChild( tag ); tag.onload = register; tag.src = ccm_url; } else register();
  function register() { ccm[ ccm_version ].component( component_obj ); }
}() );