/**
 * @overview ccm component for data logging
 * @author André Kless <andre.kless@web.de> 2016-2017
 * @license The MIT License (MIT)
 * @version 1.0.0
 */

( function () {

  var component = {

    name: 'log',
    version: [ 1, 0, 0 ],

    ccm: {
      url: 'https://akless.github.io/ccm/version/ccm-11.3.0.min.js',
      integrity: 'sha384-q+TLdWDHrZRfYaIRWjF/LD+unApU6U+3lJ+eNlYCFb4lunrwlwOPv7uwy2nJO4Aj',
      crossorigin: 'anonymous'
    },

    Instance: function () {

      var self = this;
      var my;           // contains privatized instance members
      var id;           // global unique id of this instance

      this.ready = function ( callback ) {

        // privatize all possible instance members
        my = self.ccm.helper.privatize( self );

        // generate global unique instance id
        id = self.ccm.helper.generateKey();

        // support different forms of data structure
        uniformData();

        callback();

        /** brings given data to uniform data structure */
        function uniformData() {

          // accept arrays for event settings
          if ( my.events ) {
            self.ccm.helper.arrToObj( my, 'events' );
            for ( var key in my.events )
              self.ccm.helper.arrToObj( my.events, key );
          }

          // accept arrays for logging settings
          if ( my.logging ) {
            self.ccm.helper.arrToObj( my, 'logging' );
            for ( var key in my.logging )
              self.ccm.helper.arrToObj( my.logging, key );
          }

        }

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

        // log event specific informations
        if ( data !== undefined && check( 'data' ) )
          results.data = self.ccm.helper.clone( data );

        // add browser informations
        if ( check( 'browser' ) )
          results.browser = {
            appCodeName: navigator.appCodeName,
            appName: navigator.appName,
            appVersion: navigator.appVersion,
            language: navigator.language,
            oscpu: navigator.oscpu,
            platform: navigator.platform,
            userAgent: navigator.userAgent
          };

        // log ccm context parent informations
        if ( self.parent && check( 'parent' ) )
          results.parent = {
            name:    self.parent.component.name,
            version: self.parent.component.version
          };

        // log ccm context root informations
        if ( self.parent && check( 'root' ) ) {
          var root = self.ccm.context.root( self );
          results.root = {
            name:    root.component.name,
            version: root.component.version
          };
        }

        // log user informations
        if ( check( 'user' ) ) {
          var user = self.ccm.context.find( self, 'user' );
          if ( user ) {
            var obj = { sign_on: user.getSignOn() };
            if ( user.isLoggedIn() ) {
              var userdata = user.data();
              obj.id = window.md5 ? md5( md5( userdata.id ) ) : userdata.id;
              if ( obj.id !== userdata.name && !md5 )
                obj.name = userdata.name;
            }
            results.user = obj;
          }
        }

        // log website informations
        if ( check( 'website' ) )
          results.website = window.location.href;

        // provide result data
        self.ccm.helper.onFinish( self, results );

        function check( kind ) {
          if ( my.events && self.ccm.helper.isObject( my.events[ event ] ) && !my.events[ event ][ kind ] ) return false;
          if ( my.logging ) {
            if ( !my.logging[ kind ] ) return false;
            if ( self.ccm.helper.isObject( my.logging[ kind ] ) && !my.logging[ kind ][ event ] ) return false;
          }
          return true;
        }

      };

    }

  };

  function p(){window.ccm[v].component(component)}var f="ccm."+component.name+(component.version?"-"+component.version.join("."):"")+".js";if(window.ccm&&null===window.ccm.files[f])window.ccm.files[f]=component;else{var n=window.ccm&&window.ccm.components[component.name];n&&n.ccm&&(component.ccm=n.ccm),"string"==typeof component.ccm&&(component.ccm={url:component.ccm});var v=component.ccm.url.split("/").pop().split("-");if(v.length>1?(v=v[1].split("."),v.pop(),"min"===v[v.length-1]&&v.pop(),v=v.join(".")):v="latest",window.ccm&&window.ccm[v])p();else{var e=document.createElement("script");document.head.appendChild(e),component.ccm.integrity&&e.setAttribute("integrity",component.ccm.integrity),component.ccm.crossorigin&&e.setAttribute("crossorigin",component.ccm.crossorigin),e.onload=function(){p(),document.head.removeChild(e)},e.src=component.ccm.url}}
}() );