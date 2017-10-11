/**
 * @overview <i>ccm</i> component for user authentication
 * @author André Kless <andre.kless@web.de> 2015-2017
 * @license The MIT License (MIT)
 * @version 1.1.0
 * @changes
 * version 1.1.0 (18.09.2017):
 * - no observer notification if observer is parent of publisher
 * version 1.0.0 (09.09.2017)
 */

( function () {

  var component = {

    name: 'user',
    version: [ 1, 1, 0 ],

    ccm: {
      url: 'https://akless.github.io/ccm/version/ccm-11.1.0.min.js',
      integrity: 'sha384-JLPNKaFhjb0/a3rdhTadUNJB01aw/uBqHFx9+hGrxS8mTG8kQuszsEdnig8++LX4',
      crossorigin: 'anonymous'
    },

    config: {
      "html": {
        "logged_in": {
          "id": "logged_in",
          "inner": [
            {
              "id": "user",
              "inner": "%user%",
              "title": "%name%"
            },
            {
              "id": "button",
              "inner": {
                "tag": "button",
                "inner": "Logout",
                "onclick": "%click%"
              }
            }
          ]
        },
        "logged_out": {
          "id": "logged_out",
          "inner": {
            "id": "button",
            "inner": {
              "tag": "button",
              "inner": "Login",
              "onclick": "%click%"
            }
          }
        }
      },
      "context": true,
      "logged_in": false,
      "sign_on": "guest",
      "guest": "guest"
    },

    /** @class */
    Instance: function () {

      var self = this;
      var my;           // contains privatized instance members

      /**
       * data of the current logged in user
       * @private
       * @type {ccm.components.user.types.dataset}
       */
      var dataset = null;

      /**
       * @summary observers for login and logout event
       * @description List of observer functions that must be performed on a login and logout event.
       * @private
       * @type {Object.<string,function>}
       */
      var observers = {};

      /**
       * true during a login or logout request
       * @private
       * @type {boolean}
       */
      var loading = false;

      /**
       * @summary waitlist during a login or logout request
       * @description Waitlist of actions that must be performed after a successful login or logout request.
       * @private
       * @type {ccm.types.action[]}
       */
      var waitlist = [];

      this.init = function ( callback ) {

        // context mode? => set context to highest ccm instance for user authentication in current ccm context
        if ( self.context ) { var context = self.ccm.context.find( self, 'user' ); self.context = context && context.context || context || false; }

        callback();
      };

      this.ready = function ( callback ) {

        // privatize all possible instance members
        my = self.ccm.helper.privatize( self );

        // immediate login? => login user
        if ( my.logged_in ) self.login( callback ); else callback();

      };

      this.start = function ( callback ) {

        // context mode? => delegate method call
        if ( my.context ) return my.context.start( callback );

        // prepare main HTML structure
        var main_elem = self.isLoggedIn() ? self.ccm.helper.html( my.html.logged_in, {
          user: self.data().user,
          name: self.data().name,
          click: function () { self.logout( self.start ); }
        } ) : self.ccm.helper.html( my.html.logged_out, {
          click: function () { self.login( self.start ); }
        } );

        // set own content
        self.ccm.helper.setContent( self.element, self.ccm.helper.protect( main_elem ) );

        if ( callback ) callback(); return self;
      };

      /**
       * login user
       * @param {function} [callback] - will be called after login (or directly if user is already logged in)
       * @param {boolean} propagated - propagated call (intern parameter)
       * @returns {self}
       */
      this.login = function ( callback, propagated ) {

        // context mode? => delegate method call
        if ( my.context ) return my.context.login( callback, true );

        // user already logged in? => perform callback directly
        if ( self.isLoggedIn() ) { if ( callback ) callback(); return self; }

        // prevent more than one request on parallel login/logout calls
        if ( loading ) { waitlist.push( [ self.login, callback ] ); return self; }

        // choose sign on and proceed login
        switch ( my.sign_on ) {
          case 'guest':
            success( { user: my.guest } );
            break;
          case 'demo':
            self.ccm.load( { url: 'https://ccm.inf.h-brs.de', params: { realm: 'ccm' } }, success );
            break;
          case 'hbrsinfkaul':
            self.ccm.load( { url: 'https://kaul.inf.h-brs.de/login/login.php', params: { realm: 'hbrsinfkaul' } }, success);
            break;
          case 'VCRP_OpenOLAT':  // experimental (not working yet)
            var username = prompt( 'Please enter your OpenOLAT username' );
            var password = prompt( 'Please enter your OpenOLAT password' );
            self.ccm.load( { url: 'https://olat.vcrp.de/restapi/auth/' + username, params: { password: password } }, success );
            break;
        }

        return self;

        /**
         * callback when login was successful
         * @param {ccm.components.user.types.dataset} response - server response with user data
         */
        function success( response ) {

          // hold user data
          dataset = self.ccm.helper.filterProperties( response, 'user', 'token' );

          // request is finished
          loading = false;

          // perform waiting functions
          while ( waitlist.length > 0 ) self.ccm.helper.action( waitlist.shift() );

          if ( self.element ) self.start();  // (re)render own content
          if ( callback ) callback();        // perform callback
          notify( true, propagated );        // notify observers about login event

        }

      };

      /**
       * logout user
       * @param {function} [callback] will be called after logout (or directly if user is already logged out)
       * @param {boolean} propagated - propagated call (intern parameter)
       * @returns {self}
       */
      this.logout = function ( callback, propagated ) {

        // context mode? => delegate method call
        if ( my.context ) return my.context.logout( callback, true );

        // user already logged out? => perform callback directly
        if ( !self.isLoggedIn() ) { if ( callback ) callback(); return self; }

        // prevent more than one request on parallel login/logout calls
        if ( loading ) { waitlist.push( [ self.logout, callback ] ); return self; }

        // choose sign on and proceed logout
        switch ( my.sign_on ) {
          case 'guest':
            success();
            break;
          case 'demo':
            self.ccm.load( { url: 'https://ccm.inf.h-brs.de', params: { realm: 'ccm', token: dataset.token } } );
            success();
            break;
          case 'hbrsinfkaul':
            self.ccm.load( { url: 'https://kaul.inf.h-brs.de/login/logout.php', params: { realm: 'hbrsinfkaul' } } );
            success();
            break;
        }

        return self;

        /** callback when logout was successful */
        function success() {

          dataset = null;   // forget user data
          loading = false;  // request is finished

          // perform waiting functions
          while ( waitlist.length > 0 ) self.ccm.helper.action( waitlist.shift() );

          if ( self.element ) self.start();  // (re)render own content
          if ( callback ) callback();        // perform callback
          notify( false, propagated );       // notify observers about logout event

        }

      };

      /**
       * checks if user is logged in
       * @returns {boolean}
       */
      this.isLoggedIn = function () {

        // context mode? => delegate method call
        if ( my.context ) return my.context.isLoggedIn();

        // user is logged in if user data exists
        return !!dataset;

      };

      /**
       * returns user data
       * @returns {ccm.components.user.types.dataset}
       */
      this.data = function () {

        // context mode? => delegate method call
        if ( my.context ) return my.context.data();

        return dataset;
      };

      /**
       * returns sign-on
       * @returns {ccm.components.user.types.config.sign_on}
       */
      this.getSignOn = function () {

        // context mode? => delegate method call
        if ( my.context ) return my.context.getSignOn();

        return my.sign_on;
      };

      /**
       * adds an observer for login and logout event
       * @param {string} observer - observer index
       * @param {function} callback - will be performed when event fires (first parameter is kind of event -> true: login, false: logout)
       * @returns {self}
       */
      this.addObserver = function ( observer, callback ) {

        // context mode? => delegate method call
        if ( my.context ) return my.context.addObserver( observer, callback );

        // add function to observers
        observers[ observer ] = callback;

        return self;
      };

      /**
       * notifies observers
       * @param {boolean} event - true: login, false: logout
       * @param {boolean} propagated - propagated call (intern parameter)
       * @private
       */
      function notify( event, propagated ) {

        for ( var index in observers ) {
          if ( !propagated && self.parent && self.parent.index === index ) continue;  // skip if observer is parent of publisher
          observers[ index ]( event );
        }

      }

    }

    /**
     * @namespace ccm.components.user.types
     */

    /**
     * @summary possible configuration members
     * @typedef {object} ccm.components.user.types.config
     * @property {ccm.types.element} element - contains own content
     * @property {Object.<string,ccm.types.html>} html - contains HTML templates
     * @property {ccm.types.dependency} css - layout CSS file
     * @property {boolean} context - context mode: if enabled, all method calls will be delegated to the highest <i>ccm</i> instance for user authentication in the current <i>ccm</i> context
     * @property {boolean} logged_in - if enabled, user will be directly logged in
     * @property {string} sign_on - <table>
     *   <tr><th>sign-on</th><th>description</th></tr>
     *   <tr><td>"guest"</td><td>guest mode: every user has the same username and full name without a password</td></tr>
     *   <tr><td>"demo"</td><td>demo mode: login with any username and password; full name is equal to the username</td></tr>
     *   <tr><td>"hbrsinfkaul"</td><td>login with an account of the department of computer science of the Hochschule Bonn-Rhein-Sieg (University of Applied Sciences)</td></tr>
     * </table>
     * @property {string} guest - username for guest mode
     */

    /**
     * @summary contains user data
     * @typedef {object} ccm.components.user.types.dataset
     * @property {string} user - unique user key and username, respectively
     * @property {string} name - full name of user
     * @property {string} token - security token (contains encrypted password)
     * @example { user: 'john_doe', name: 'John Doe', token: 'd41d8cd98f00b204e9800998ecf8427e' }
     */

    /**
     * @external ccm.types
     * @see {@link https://akless.github.io/ccm/api/ccm.types.html}
     */

  };

  function p(){window.ccm[v].component(component)}var f="ccm."+component.name+(component.version?"-"+component.version.join("."):"")+".js";if(window.ccm&&null===window.ccm.files[f])window.ccm.files[f]=component;else{var n=window.ccm&&window.ccm.components[component.name];n&&n.ccm&&(component.ccm=n.ccm),"string"==typeof component.ccm&&(component.ccm={url:component.ccm});var v=component.ccm.url.split("/").pop().split("-");if(v.length>1?(v=v[1].split("."),v.pop(),"min"===v[v.length-1]&&v.pop(),v=v.join(".")):v="latest",window.ccm&&window.ccm[v])p();else{var e=document.createElement("script");document.head.appendChild(e),component.ccm.integrity&&e.setAttribute("integrity",component.ccm.integrity),component.ccm.crossorigin&&e.setAttribute("crossorigin",component.ccm.crossorigin),e.onload=function(){p(),document.head.removeChild(e)},e.src=component.ccm.url}}
}() );