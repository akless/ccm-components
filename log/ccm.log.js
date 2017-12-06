/**
 * @overview ccm component for data logging
 * @author André Kless <andre.kless@web.de> 2016-2017
 * @license The MIT License (MIT)
 * @version latest (2.0.0)
 * @changes
 * version 2.0.0 (06.12.2017)
 * - supports logging of specific subsets
 * - uses ECMAScript 6
 * - uses module instead of lib for md5
 * - for pseudonymization, md5 is applied only once
 * - uses ccm v12.8.0
 * version 1.0.0 (19.10.2017)
 * TODO: docu comments -> API
 * TODO: unit tests
 * TODO: factory
 * TODO: multilingualism
 */

{
  var component = {

    /**
     * unique component name
     * @type {string}
     */
    name: 'log',

    /**
     * recommended used framework version
     * @type {string}
     */
    ccm: 'https://akless.github.io/ccm/ccm.js',

    /**
     * default instance configuration
     * @type {object}
     */
    config: {

  //  events:  {string[]|Object.<string,string[]>} logged events, default: all (object -> individual setting which information should be recorded at which events)
  //  logging: {string[]|object} logged informations, default: all
  //  logging.data:    {boolean|string[]} log event specific informations (string[] -> log this only for these events)
  //  logging.browser: {boolean|string[]} log browser informations
  //  logging.parent:  {boolean|string[]} log ccm context parent information
  //  logging.root:    {boolean|string[]} log ccm context root information
  //  logging.user:    {boolean|string[]} log user informations
  //  logging.website: {boolean|string[]} log website informations
  //  only: {Object.<string,string[]|object>} settings for logging only specific subsets
  //  hash: [ 'ccm.module', 'https://akless.github.io/ccm-components/modules/md5.min.js' ]
  //  onfinish: function ( instance, results ) { console.log( results ); }

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
       * global unique id of this instance
       * @type {string}
       */
      let id;

      /**
       * is called once after the initialization and is then deleted
       * @param {function} callback - called after all synchronous and asynchronous operations are complete
       */
      this.ready = callback => {

        // set shortcut to help functions
        $ = self.ccm.helper;

        // privatize all possible instance members
        my = $.privatize( self );

        // generate global unique instance id
        id = $.generateKey();

        // support different forms of data structure
        uniformData();

        callback();

        /** brings given data to uniform data structure */
        function uniformData() {

          // accept arrays for event settings
          if ( my.events ) {
            $.arrToObj( my, 'events' );
            for ( const key in my.events )
              $.arrToObj( my.events, key );
          }

          // accept arrays for logging settings
          if ( my.logging ) {
            $.arrToObj( my, 'logging' );
            for ( const key in my.logging )
              $.arrToObj( my.logging, key );
          }

          // accept arrays for specific subset settings
          if ( my.only )
            for ( const key in my.only )
              $.arrToObj( my.only, key );

        }

      };

      /**
       * logs event data
       * @param {string} event - unique event index
       * @param {object} [data] - event specific informations
       */
      this.log = ( event, data ) => {

        // ignored event? => abort
        if ( my.events && !my.events[ event ] ) return;

        /**
         * result data
         * @type {object}
         */
        let results = { session: id, event: event };

        // log event specific informations
        if ( data !== undefined && check( 'data' ) )
          results.data = $.clone( data );

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
          const root = self.ccm.context.root( self );
          results.root = {
            name:    root.component.name,
            version: root.component.version
          };
        }

        // log user informations
        if ( check( 'user' ) ) {
          const user = self.ccm.context.find( self, 'user' );
          if ( user ) {
            const obj = { sign_on: user.getSignOn() };
            if ( user.isLoggedIn() ) {
              const userdata = user.data();
              obj.id = my.hash ? my.hash.md5( userdata.id ) : userdata.id;
              if ( obj.id !== userdata.name && !my.hash )
                obj.name = userdata.name;
            }
            results.user = obj;
          }
        }

        // log website informations
        if ( check( 'website' ) )
          results.website = window.location.href;

        // log only specific subsets
        if ( my.only )
          for ( const kind in my.only ) {
            const specific = {};
            for ( const key in my.only[ kind ] ) {
              const value = $.deepValue( results[ kind ], key );
              if ( value !== undefined )
                $.deepValue( specific, key, value );
            }
            results[ kind ] = specific;
          }

        // provide result data
        $.onFinish( self, results );

        /**
         * checks if an event must be logged
         * @param {string} kind - kind of event
         * @returns {boolean}
         */
        function check( kind ) {

          if ( my.events && $.isObject( my.events[ event ] ) && !my.events[ event ][ kind ] ) return false;
          if ( my.logging ) {
            if ( !my.logging[ kind ] ) return false;
            if ( $.isObject( my.logging[ kind ] ) && !my.logging[ kind ][ event ] ) return false;
          }
          return true;

        }

      };

    }

  };

  function p(){window.ccm[v].component(component)}const f="ccm."+component.name+(component.version?"-"+component.version.join("."):"")+".js";if(window.ccm&&null===window.ccm.files[f])window.ccm.files[f]=component;else{const n=window.ccm&&window.ccm.components[component.name];n&&n.ccm&&(component.ccm=n.ccm),"string"==typeof component.ccm&&(component.ccm={url:component.ccm});var v=component.ccm.url.split("/").pop().split("-");if(v.length>1?(v=v[1].split("."),v.pop(),"min"===v[v.length-1]&&v.pop(),v=v.join(".")):v="latest",window.ccm&&window.ccm[v])p();else{const e=document.createElement("script");document.head.appendChild(e),component.ccm.integrity&&e.setAttribute("integrity",component.ccm.integrity),component.ccm.crossorigin&&e.setAttribute("crossorigin",component.ccm.crossorigin),e.onload=function(){p(),document.head.removeChild(e)},e.src=component.ccm.url}}
}