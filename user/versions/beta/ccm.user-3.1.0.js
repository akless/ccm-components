/**
 * @overview ccm component for user authentication
 * @author André Kless <andre.kless@web.de> 2017-2018
 * @license The MIT License (MIT)
 * @version 3.1.0
 * @changes
 * version 3.1.0 (26.02.2018):
 * - login form for LEA sign-on
 * version 3.0.0 (17.01.2018):
 * - uses ECMAScript 6 syntax
 * - uses ccm v15.0.2
 * - logging support
 * - add LEA authentication
 * version 2.0.1 (04.12.2017):
 * - use JSONP instead of CORS for authentication
 * version 2.0.0 (22.09.2017):
 * - changed structure of user dataset: id, token, name, email
 * version 1.1.0 (18.09.2017):
 * - no observer notification if observer is parent of publisher
 * version 1.0.0 (09.09.2017)
 */

{
  var component = {

    /**
     * unique component name
     * @type {string}
     */
    name: 'user',

    /**
     * component version
     * @type {number[]}
     */
    version: [ 3, 1, 0 ],

    /**
     * reference to used framework version
     * @type {object}
     */
    ccm: {
      url: 'https://akless.github.io/ccm/version/ccm-15.0.2.min.js',
      integrity: 'sha384-4X0IFdACgz2SAKu0knklA+SRQ6OVU4GipKhm7p6l7e7k/CIM8cjCFprWmM4qkbQz',
      crossorigin: 'anonymous'
    },

    /**
     * default instance configuration
     * @type {object}
     */
    config: {

      "html": {
        "login_form": {
          "id": "login-form",
          "class": "container",
          "inner": [
            {
              "id": "loginbox",
              "class": "mainbox col-md-6 col-md-offset-3 col-sm-8 col-sm-offset-2",
              "inner": {
                "class": "panel panel-info",
                "inner": [
                  {
                    "class": "panel-heading",
                    "inner": {
                      "class": "panel-title",
                      "inner": "Sign in"
                    }
                  },
                  {
                    "class": "panel-body",
                    "inner": [
                      {
                        "tag": "form",
                        "id": "loginform",
                        "class": "form-horizontal",
                        "role": "form",
                        "inner": [
                          {
                            "class": "input-group",
                            "inner": [
                              {
                                "tag": "span",
                                "class": "input-group-addon",
                                "inner": {
                                  "tag": "i",
                                  "class": "glyphicon glyphicon-user"
                                }
                              },
                              {
                                "tag": "input",
                                "id": "login-username",
                                "type": "text",
                                "class": "form-control",
                                "name": "username",
                                "placeholder": "username or email",
                                "required": true
                              }
                            ]
                          },
                          {
                            "class": "input-group",
                            "inner": [
                              {
                                "tag": "span",
                                "class": "input-group-addon",
                                "inner": {
                                  "tag": "i",
                                  "class": "glyphicon glyphicon-lock"
                                }
                              },
                              {
                                "tag": "input",
                                "id": "login-password",
                                "type": "password",
                                "class": "form-control",
                                "name": "password",
                                "placeholder": "password",
                                "required": true
                              }
                            ]
                          },
                          {
                            "class": "form-group",
                            "inner": {
                              "class": "col-sm-12 controls",
                              "inner": {
                                "tag": "a",
                                "id": "btn-login",
                                "class": "btn btn-success",
                                "onclick": "%login%",
                                "inner": "Login"
                              }
                            }
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            }
          ]
        },
        "logged_in": {
          "id": "logged_in",
          "inner": [
            {
              "id": "user",
              "inner": "%name%"
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

    //  "css": [ "ccm.load", "https://akless.github.io/ccm-components/user/resources/default.css" ],
    //  "logger": [ "ccm.instance", "https://akless.github.io/ccm-components/log/versions/ccm.log-2.0.1.js", [ "ccm.get", "https://akless.github.io/ccm-components/log/resources/configs.js", "greedy" ] ]

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
       * index of parent instance
       * @type {string}
       */
      let owner;

      /**
       * data of the current logged in user
       * @private
       * @type {ccm.components.user.types.dataset}
       */
      let dataset = null;

      /**
       * @summary observers for login and logout event
       * @description List of observer functions that must be performed on a login and logout event.
       * @private
       * @type {Object.<string,function>}
       */
      const observers = {};

      /**
       * true during a login or logout request
       * @private
       * @type {boolean}
       */
      let loading = false;

      /**
       * @summary waitlist during a login or logout request
       * @description Waitlist of actions that must be performed after a successful login or logout request.
       * @private
       * @type {ccm.types.action[]}
       */
      const waitlist = [];

      /**
       * is called once after all dependencies are solved and is then deleted
       * @param {function} callback - called after all synchronous and asynchronous operations are complete
       */
      this.init = callback => {

        // context mode? => set context to highest ccm instance for user authentication in current ccm context
        if ( self.context ) { const context = self.ccm.context.find( self, 'user' ); self.context = context && context.context || context || false; }

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

        // immediate login? => login user
        my.logged_in ? self.login( callback ) : callback();

      };

      /**
       * starts the instance
       * @param {function} [callback] - called after all synchronous and asynchronous operations are complete
       */
      this.start = callback => {

        // context mode? => delegate method call
        if ( my.context ) return my.context.start( callback );

        // has logger instance? => log 'start' event
        self.logger && self.logger.log( 'start', self.isLoggedIn() );

        // prepare main HTML structure
        const main_elem = self.isLoggedIn() ? $.html( my.html.logged_in, {
          name: self.data().name,
          click: () => self.logout( self.start )
        } ) : $.html( my.html.logged_out, {
          click: () => self.login( self.start )
        } );

        // set own content
        $.setContent( self.element, $.protect( main_elem ) );

        callback && callback(); return self;
      };

      /**
       * login user
       * @param {function} [callback] - will be called after login (or directly if user is already logged in)
       * @param {string} propagated - propagated call (intern parameter)
       * @returns {self}
       */
      this.login = ( callback, propagated ) => {

        // context mode? => delegate method call
        if ( my.context ) return my.context.login( callback, propagated || owner );

        // user already logged in? => perform callback directly
        if ( self.isLoggedIn() ) { callback && callback(); return self; }

        // prevent more than one request on parallel login/logout calls
        if ( loading ) { waitlist.push( [ self.login, callback ] ); return self; }

        // choose sign on and proceed login
        switch ( my.sign_on ) {
          case 'guest':
            success( { id: my.guest } );
            break;
          case 'demo':
            self.ccm.load( { url: 'https://ccm.inf.h-brs.de', method: 'JSONP', params: { realm: 'ccm' } }, success );
            break;
          case 'hbrsinfkaul':
            self.ccm.load( { url: 'https://kaul.inf.h-brs.de/login/login.php', method: 'JSONP', params: { realm: 'hbrsinfkaul' } }, success);
            break;
          case 'LEA':  // experimental
            lea();
            break;
          case 'VCRP_OpenOLAT':  // experimental
            const username = prompt( 'Please enter your OpenOLAT username' );
            const password = prompt( 'Please enter your OpenOLAT password' );
            self.ccm.load( { url: 'https://olat.vcrp.de/restapi/auth/' + username, params: { password: password } }, success );
            break;
        }

        return self;

        function lea() {

          // is a standalone instance? => abort
          if ( !self.parent || !self.parent.element || !self.parent.element.parentNode ) return;

          // hide content of the parent instance
          self.parent.element.style.display = "none";

          // remember parent element of own root element
          const parent = self.root.parentNode;

          // move own root element into the Shadow DOM of the parent instance
          self.parent.element.parentNode.appendChild( self.root );

          // render login form
          $.setContent( self.element, $.html( my.html.login_form, {

            login: () => {

              // get user credentials
              const username = self.element.querySelector( 'input[name="username"]' ).value;
              if ( username === null ) return;
              const password = self.element.querySelector( 'input[name="password"]' ).value;
              if ( password === null ) return;

              // perform login
              soap( {
                domain: 'http://ilias-ccm.bib.h-brs.de',
                url: 'http://ilias-ccm.bib.h-brs.de/webservice/soap/server.php',
                method: 'login',
                params: {
                  client: 'iliasccm',
                  username: username,
                  password: password
                }
              }, result => {

                // move own root element back to original position
                self.root.parentNode.removeChild( self.root );
                if ( parent ) parent.appendChild( self.root );

                // show content of the parent instance
                self.parent.element.style.display = "block";

                /**
                 * security token
                 * @type {string}
                 */
                const token = />([^>]+::.+)<\/sid>/.exec( result )[ 1 ];

                // perform success callback
                success( { name: username, token: token } );

              }, () => confirm( 'Try again?' ) && lea() );  // render login form again if user credentials are invalid

            }

          } ) );

        }

        /**
         * callback when login was successful
         * @param {object} response - server response with user data
         */
        function success( response ) {

          // hold user data
          dataset = $.filterProperties( response, 'id', 'token', 'name', 'email' );

          // missing user name or user identifier? => use default
          if ( !dataset.id   ) dataset.id = dataset.name;
          if ( !dataset.name ) dataset.name = dataset.id;

          // request is finished
          loading = false;

          // has logger instance? => log 'login' event
          self.logger && self.logger.log( 'login', dataset );

          // perform waiting functions
          while ( waitlist.length > 0 ) $.action( waitlist.shift() );

          self.element && self.start();         // (re)render own content
          callback     &&   callback();         // perform callback
          notify( true, propagated || owner );  // notify observers about login event

        }

      };

      /**
       * logout user
       * @param {function} [callback] will be called after logout (or directly if user is already logged out)
       * @param {string} propagated - propagated call (intern parameter)
       * @returns {self}
       */
      this.logout = ( callback, propagated ) => {

        // context mode? => delegate method call
        if ( my.context ) return my.context.logout( callback, propagated || owner );

        // user already logged out? => perform callback directly
        if ( !self.isLoggedIn() ) { callback && callback(); return self; }

        // prevent more than one request on parallel login/logout calls
        if ( loading ) { waitlist.push( [ self.logout, callback ] ); return self; }

        // choose sign on and proceed logout
        switch ( my.sign_on ) {
          case 'guest':
            success();
            break;
          case 'demo':
            self.ccm.load( { url: 'https://ccm.inf.h-brs.de', method: 'JSONP', params: { realm: 'ccm', token: dataset.token } } );
            success();
            break;
          case 'hbrsinfkaul':
            self.ccm.load( { url: 'https://kaul.inf.h-brs.de/login/logout.php', method: 'JSONP', params: { realm: 'hbrsinfkaul' } } );
            success();
            break;
          case 'LEA':   // experimental
            soap( {
              domain: 'http://ilias-ccm.bib.h-brs.de',
              url:    'http://ilias-ccm.bib.h-brs.de/webservice/soap/server.php',
              method: 'logout',
              params: {
                sid: self.data().token
              }
            }, success );
            break;
        }

        return self;

        /** callback when logout was successful */
        function success() {

          dataset = null;   // forget user data
          loading = false;  // request is finished

          // has logger instance? => log 'logout' event
          self.logger && self.logger.log( 'logout' );

          // perform waiting functions
          while ( waitlist.length > 0 ) $.action( waitlist.shift() );

          self.element && self.start();          // (re)render own content
          callback && callback();                // perform callback
          notify( false, propagated || owner );  // notify observers about logout event

        }

      };

      /**
       * checks if user is logged in
       * @returns {boolean}
       */
      this.isLoggedIn = () => {

        // context mode? => delegate method call
        if ( my.context ) return my.context.isLoggedIn();

        // user is logged in if user data exists
        return !!dataset;

      };

      /**
       * returns user data
       * @returns {object}
       */
      this.data = () => {

        // context mode? => delegate method call
        if ( my.context ) return my.context.data();

        return dataset;
      };

      /**
       * returns sign-on
       * @returns {string}
       */
      this.getSignOn = () => {

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
      this.addObserver = ( observer, callback ) => {

        // context mode? => delegate method call
        if ( my.context ) return my.context.addObserver( observer, callback );

        // add function to observers
        observers[ observer ] = callback;

        return self;
      };

      /**
       * notifies observers
       * @param {boolean} event - true: login, false: logout
       * @param {string} caller - index of the index that calls login/logout (intern parameter)
       * @private
       */
      function notify( event, caller ) {

        for ( const index in observers ) {
          if ( index === caller ) continue;  // skip if observer is caller
          observers[ index ]( event );
        }

      }

      /**
       * sends a HTTP request for communication via SOAP with XML
       * @param {object} settings - settings for the HTTP request
       * @param {function} success - success callback
       * @param {function} error - error callback
       */
      function soap( settings, success, error ) {

        // prepare parameters to be sent
        let params = '';
        for ( const key in settings.params )
          params += '<' + key + '>' + settings.params[ key ] + '</' + key + '>'

        // prepare request data for SOAP
        const xml = `<?xml version="1.0" encoding="utf-8"?>
<SOAP-ENV:Envelope
  xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/"
  SOAP-ENV:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
  <SOAP-ENV:Body>
    <m:${settings.method} xmlns:m="${settings.domain}">
      ${params}
    </m:${settings.method}>
  </SOAP-ENV:Body>
</SOAP-ENV:Envelope>`;

        // prepare request object for SOAP
        const request = new XMLHttpRequest();
        request.open( 'POST', settings.url, true );
        request.setRequestHeader( 'Content-Type', 'text/xml' );
        request.onreadystatechange = () => {
          if ( request.readyState !== 4 ) return;
          if ( request.status === 200 && success ) success( request.response );
          if ( request.status !== 200 && error   )   error( request.response, request.status );
        };

        // send request
        request.send( xml );

      }

    }

  };

  function p(){window.ccm[v].component(component)}const f="ccm."+component.name+(component.version?"-"+component.version.join("."):"")+".js";if(window.ccm&&null===window.ccm.files[f])window.ccm.files[f]=component;else{const n=window.ccm&&window.ccm.components[component.name];n&&n.ccm&&(component.ccm=n.ccm),"string"==typeof component.ccm&&(component.ccm={url:component.ccm});var v=component.ccm.url.split("/").pop().split("-");if(v.length>1?(v=v[1].split("."),v.pop(),"min"===v[v.length-1]&&v.pop(),v=v.join(".")):v="latest",window.ccm&&window.ccm[v])p();else{const e=document.createElement("script");document.head.appendChild(e),component.ccm.integrity&&e.setAttribute("integrity",component.ccm.integrity),component.ccm.crossorigin&&e.setAttribute("crossorigin",component.ccm.crossorigin),e.onload=function(){p(),document.head.removeChild(e)},e.src=component.ccm.url}}
}