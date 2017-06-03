/**
 * @overview ccm component for user authentication
 * @author André Kless <andre.kless@web.de> 2015-2017
 * @license The MIT License (MIT)
 */

( function () {

  var ccm_version = '8.0.0';
  var ccm_url     = 'https://akless.github.io/ccm/version/ccm-8.0.0.min.js';

  var component_name = 'user';
  var component_obj  = {

    name: component_name,

    config: {

      html_templates: {
        logged_in: {
          id: 'logged_in',
          inner: [
            {
              id: 'username',
              inner: '%user%',
              title: '%user_title%'
            },
            {
              id: 'button',
              inner: {
                tag: 'button',
                inner: '%logout%',
                title: '%logout_title%',
                onclick: '%click%'
              }
            }
          ]
        },
        logged_out: {
          id: 'logged_out',
          inner: {
            id: 'button',
            inner: {
              tag: 'button',
              inner: '%login%',
              title: '%title%',
              onclick: '%click%'
            }
          }
        }
      },
      css_layout: [ 'ccm.load', './../../ccm-components/user/layouts/default.css' ],
      context: true,
      logged_in: false,
      sign_on: 'guest',
      texts: {
        login:        'Login',
        login_title:  'click here for login',
        logout:       'Logout',
        logout_title: 'click here for logout',
        user_title:   'this is your username'
      },
      guest: {
        key:   'guest',
        name:  'Guest User'
      }

    },

    Instance: function () {

      /**
       * own context
       * @type {Instance}
       */
      var self = this;

      /**
       * privatized instance members
       * @type {object}
       */
      var my;

      /**
       * dataset of the current logged in user
       * @type {ccm.components.user.types.dataset}
       */
      var dataset = null;

      /**
       * observers for login and logout event
       * @type {function[]}
       */
      var observers = [];

      /**
       * true during a login or logout request
       * @type {boolean}
       */
      var loading = false;

      /**
       * @summary waitlist during a login or logout request
       * @description Waitlist of actions that must be performed after a successful login or logout request.
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

        // context mode? => delegate function call
        if ( my.context ) return my.context.start( callback );

        // prepare main HTML structure
        var main_elem = self.isLoggedIn() ? self.ccm.helper.html( my.html_templates.logged_in, {
              user:           self.data().key,
              user_title: my.texts.user_title,
              logout:         my.texts.logout,
              logout_title:   my.texts.logout_title,
              click:          function () { self.logout( self.start ); }
            } ) : self.ccm.helper.html( my.html_templates.logged_out, {
              login: my.texts.login,
              title: my.texts.login_title,
              click: function () { self.login( self.start ); }
            } );

        // set content of own website area
        self.ccm.helper.setContent( self.element, self.ccm.helper.protect( main_elem ) );

        if ( callback ) callback();
      };

      /**
       * login user
       * @param {function} [callback] will be called after login (or directly if user is already logged in)
       * @returns {ccm.instance} <i>ccm</i> user instance
       */
      this.login = function ( callback ) {

        // context mode? => delegate function call
        if ( my.context ) return my.context.login( callback );

        // user already logged in? => perform callback directly
        if ( self.isLoggedIn() ) { if ( callback ) callback(); return self; }

        // prevent more than one request on parallel login/logout calls
        if ( loading ) return waitlist.push( [ self.login, callback ] ); loading = true;

        // choose sign on and proceed login
        switch ( my.sign_on ) {
          case 'guest':
            success( my.guest.key, '', my.guest.name );
            break;
          case 'demo':
            self.ccm.load( [ 'https://kaul.inf.h-brs.de/login/demo_login.php', { realm: 'hbrsinfkaul' } ], function ( response ) { success( response.user, response.token ); } );
            break;
          case 'hbrsinfkaul':
            self.ccm.load( [ 'https://kaul.inf.h-brs.de/login/login.php', { realm: 'hbrsinfkaul' } ], function ( response ) { success( response.user, response.token, response.name ); } );
            break;
          case 'VCRP_OpenOLAT':
            var username = prompt( 'Please enter your OpenOLAT username' );
            var password = prompt( 'Please enter your OpenOLAT password' );
            self.ccm.load( [ 'https://olat.vcrp.de/restapi/auth/' + username, { password: password } ], function () { success( username ); } );
            break;
        }

        return self;

        /**
         * callback when login was successful
         * @param {string} key - dataset key and username, respectively
         * @param {string} [token] - security token
         * @param {string} [name] - full name of user
         */
        function success( key, token, name ) {

          dataset = { key: key, token: token, name: name };  // hold user data
          loading = false;                                   // request is finished

          // perform waiting functions
          while ( waitlist.length > 0 ) self.ccm.helper.action( waitlist.shift() );

          if ( self.element ) self.start();  // (re)render own content
          if ( callback ) callback();         // perform callback
          notify( true );                     // notify observers about login event

        }

      };

      /**
       * logout user
       * @param {function} [callback] will be called after logout (or directly if user is already logged out)
       * @returns {ccm.instance} <i>ccm</i> user instance
       */
      this.logout = function ( callback ) {

        // context mode? => delegate function call
        if ( my.context ) return my.context.logout( callback );

        // user already logged out? => perform callback directly
        if ( !self.isLoggedIn() ) { if ( callback ) callback(); return self; }

        // prevent more than one request on parallel login/logout calls
        if ( loading ) return waitlist.push( [ self.logout, callback ] ); loading = true;

        // choose sign on and proceed logout
        switch ( my.sign_on ) {
          case 'guest':
            success();
            break;
          case 'demo':
            self.ccm.load( [ 'https://logout@kaul.inf.h-brs.de/login/demo_logout.php', { realm: 'hbrsinfkaul' } ], success );
            break;
          case 'hbrsinfkaul':
            self.ccm.load( [ 'https://logout@kaul.inf.h-brs.de/login/logout.php', { realm: 'hbrsinfkaul' } ], success );
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
          if ( callback ) callback();         // perform callback
          notify( false );                    // notify observers about logout event

        }

      };

      /**
       * checks if user is logged in
       * @returns {boolean}
       */
      this.isLoggedIn = function () {

        // context mode? => delegate function call
        if ( my.context ) return my.context.isLoggedIn();

        // user is logged in if user data exists
        return !!dataset;

      };

      /**
       * returns user dataset
       * @returns {object}
       * @example { key: 'john_doe', name: 'John Doe', token: 'd41d8cd98f00b204e9800998ecf8427e' }
       */
      this.data = function () {

        // context mode? => delegate function call
        if ( my.context ) return my.context.data();

        return dataset;
      };

      /**
       * returns sign-on
       * @returns {string}
       * @example 'guest'
       * @example 'demo'
       * @example 'hbrsinfkaul'
       */
      this.getSignOn = function () {

        // context mode? => delegate function call
        if ( my.context ) return my.context.getSignOn();

        return my.sign_on;
      };

      /**
       * adds an observer for login and logout events
       * @param {function} observer - will be performed when event fires (first parameter is kind of event -> true: login, false: logout)
       * @returns {ccm.instance} <i>ccm</i> user instance
       */
      this.addObserver = function ( observer ) {

        // context mode? => delegate function call
        if ( my.context ) return my.context.addObserver( observer );

        // add function to observers
        observers.push( observer );

        return self;

      };

      /**
       * notify observers
       * @param {boolean} event - true: login, false: logout
       * @private
       */
      function notify( event ) {

        // perform observer functions
        observers.map( function ( observer ) { observer( event ); } );

      }

    }

  };

  var namespace = window.ccm && ccm.components[ component_name ]; if ( namespace ) { if ( namespace.ccm_version ) ccm_version = namespace.ccm_version; if ( namespace.ccm_url ) ccm_url = namespace.ccm_url; }
  if ( !window.ccm || !ccm[ ccm_version ] ) { var tag = document.createElement( 'script' ); document.head.appendChild( tag ); tag.onload = register; tag.src = ccm_url; } else register();
  function register() { ccm[ ccm_version ].component( component_obj ); }
}() );