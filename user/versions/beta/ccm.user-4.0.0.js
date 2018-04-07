/**
 * @overview ccm component for user authentication
 * @author André Kless <andre.kless@web.de> 2017-2018
 * @license The MIT License (MIT)
 * @version 4.0.0
 * @changes
 * version 4.0.0 (07.04.2018):
 * - uses ccm v16.0.0
 * - uses ccm-cloud v3.0.0
 * - 'realm' instead of 'sign_on'
 * - updated LEA sign-on
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
    version: [ 4, 0, 0 ],

    /**
     * reference to used framework version
     * @type {object}
     */
    ccm: 'https://akless.github.io/ccm/version/beta/ccm-16.0.0.min.js',

    /**
     * default instance configuration
     * @type {object}
     */
    config: {

      "html": {
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
        },
        // HTML template 'login_form' by Tea Kless <tea.kless@web.de> 2018
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
                                "placeholder": "username",
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
                          }/*,
                          {
                            "class": "form-group",
                            "inner": {
                              "class": "col-md-12 control",
                              "inner":  {
                                "style": "border-top: 1px solid#888; padding-top:15px; font-size:85%",
                                "inner": [
                                  "Don't have an account!",
                                  {
                                    "tag": "a",
                                    "onclick": "%signup%",
                                    "inner": "&nbsp Sign Up Here"
                                  }
                                ]
                              }
                            }
                          }*/
                        ]
                      }
                    ]
                  }
                ]
              }
            },
            {
              "id": "signupbox",
              "style": "display:none; margin-top:50px",
              "class": "mainbox col-md-6 col-md-offset-3 col-sm-8 col-sm-offset-2",
              "inner": {
                "class": "panel panel-info",
                "inner": [
                  {
                    "class": "panel-heading",
                    "inner": [
                      {
                        "class": "panel-title",
                        "inner": "Sign Up"
                      },
                      {
                        "style": "float:right; font-size: 85%; position: relative; top:-10px",
                        "inner": {
                          "tag": "a",
                          "id": "signinlink",
                          "onclick": "%loginbox%",
                          "inner": "Sign In"
                        }
                      }
                    ]
                  },
                  {
                    "class": "panel-body",
                    "inner": {
                      "id": "signupform",
                      "class": "form-horizontal",
                      "role": "form",
                      "inner": [
                        {
                          "id": "signupalert",
                          "style": "display:none",
                          "class": "alert alert-danger",
                          "inner": [
                            {
                              "tag": "p",
                              "inner": "Error:"
                            },
                            {

                            }
                          ]
                        },
                        {
                          "class": "form-group",
                          "inner": [
                            {
                              "tag": "label",
                              "for": "email",
                              "class": "col-md-3 control-label",
                              "inner": "Email"
                            },
                            {
                              "class":" col-md-9",
                              "inner": {
                                "tag": "input",
                                "type": "text",
                                "class": "form-control",
                                "id": "email",
                                "name": "email",
                                "placeholder": "Email Address"
                              }
                            }
                          ]
                        },
                        {
                          "class": "form-group",
                          "inner": [
                            {
                              "tag": "label",
                              "for": "firstname",
                              "class": "col-md-3 control-label",
                              "inner": "Frist Name"
                            },
                            {
                              "class":" col-md-9",
                              "inner": {
                                "tag": "input",
                                "type": "text",
                                "class": "form-control",
                                "id": "firstname",
                                "name": "firstname",
                                "placeholder": "First Name"
                              }
                            }
                          ]
                        },
                        {
                          "class": "form-group",
                          "inner": [
                            {
                              "tag": "label",
                              "for": "lastname",
                              "class": "col-md-3 control-label",
                              "inner": "Last Name"
                            },
                            {
                              "class":" col-md-9",
                              "inner": {
                                "tag": "input",
                                "type": "text",
                                "class": "form-control",
                                "id": "lastname",
                                "name": "lastname",
                                "placeholder": "Last Name"
                              }
                            }
                          ]
                        },
                        {
                          "class": "form-group",
                          "inner": [
                            {
                              "tag": "label",
                              "for": "password",
                              "class": "col-md-3 control-label",
                              "inner": "Password"
                            },
                            {
                              "class":" col-md-9",
                              "inner": {
                                "tag": "input",
                                "type": "text",
                                "class": "form-control",
                                "id": "password",
                                "name": "password",
                                "placeholder": "Password"
                              }
                            }
                          ]
                        },
                        {
                          "class": "form-group",
                          "inner": [
                            {
                              "tag": "label",
                              "for": "icode",
                              "class": "col-md-3 control-label",
                              "inner": "Invitation Code"
                            },
                            {
                              "class":" col-md-9",
                              "inner": {
                                "tag": "input",
                                "type": "text",
                                "class": "form-control",
                                "id": "icode",
                                "name": "icode"
                              }
                            }
                          ]
                        },
                        {
                          "class": "form-group",
                          "inner": {
                            "class": "col-md-offset-3 col-md-9",
                            "inner": {
                              "tag": "button",
                              "id": "btn-signup",
                              "type": "button",
                              "class": "btn btn-primary",
                              "inner": [
                                {
                                  "tag": "i",
                                  "class": "glyphicon glyphicon-hand-right",
                                },
                                "&nbsp; Sign Up"
                              ]
                            }
                          }
                        }
                      ]
                    }
                  }
                ]
              }
            }
          ]
        }
      },
      "context": true,
      "logged_in": false,
      "realm": "guest",
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
       * parent of own root element
       * @type {Element}
       */
      let parent;

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

        // render logged in or logged out view
        ( self.isLoggedIn() ? renderLoggedIn : renderLoggedOut )();

        /** renders logged in view */
        function renderLoggedIn() {

          $.setContent( self.element, $.html( my.html.logged_in, {
            name: self.data().name,
            click: () => self.logout( self.start )
          } ) );

        }

        /** renders logged out view */
        function renderLoggedOut() {

          $.setContent( self.element, $.html( my.html.logged_out, {
            click: () => self.login( self.start )
          } ) );

        }

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

        // choose authentication mode and proceed login
        switch ( my.realm ) {
          case 'guest':
            success( { user: my.guest, token: my.guest } );
            break;
          case 'demo':
            self.ccm.load( { url: 'https://ccm2.inf.h-brs.de', method: 'JSONP', params: { realm: my.realm } }, success );
            break;
          case 'hbrsinfkaul':
            self.ccm.load( { url: 'https://kaul.inf.h-brs.de/login/login.php', method: 'JSONP', params: { realm: my.realm } }, success );
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

        /** performs LEA authentication mode */
        function lea() {

          // render login form
          renderLoginForm( () => {

            // get user credentials
            const username = self.element.querySelector( 'input[name="username"]' ).value;
            const password = self.element.querySelector( 'input[name="password"]' ).value;

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

              /**
               * security token
               * @type {string}
               */
              const token = />([^>]+::.+)<\/sid>/.exec( result )[ 1 ];

              // perform success callback
              success( { name: username, token: token } );

            }, () =>
              confirm( 'Try again?' ) && lea() );  // render login form again if user credentials are invalid

          } );

        }

        /**
         * renders login form
         * param {function} login - when username and password have been entered
         */
        function renderLoginForm( login ) {

          // is not a standalone instance? => show login form in website area of parent instance
          if ( self.parent && self.parent.element && self.parent.element.parentNode ) {

            // remember parent of own root element
            parent = self.root.parentNode;

            // hide content of parent instance
            self.parent.element.style.display = 'none';

            // move own root element into Shadow DOM of parent instance
            self.parent.element.parentNode.appendChild( self.root );

          }

          // render login form
          $.setContent( self.element, $.html( my.html.login_form, {
            login: login,
            loginbox: () => {
              self.element.querySelector( '#loginbox' ).style.display = 'block';
              self.element.querySelector( '#signupbox' ).style.display = 'none';
            },
            signup: () => {
              self.element.querySelector( '#loginbox' ).style.display = 'none';
              self.element.querySelector( '#signupbox' ).style.display = 'block';
            }
          } ) );

        }

        /**
         * callback when login was successful
         * @param {object} response - server response with user data
         */
        function success( response ) {

          // hold user data
          dataset = $.filterProperties( response, 'user', 'token' );

          // is not a standalone instance? => abort
          if ( parent ) {

            // move own root element back to original position
            parent.appendChild( self.root );

            // show content of the parent instance
            self.parent.element.style.display = "block";

          }

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

        // choose authentication mode and proceed logout
        switch ( my.realm ) {
          case 'guest':
            success();
            break;
          case 'demo':
            self.ccm.load( { url: 'https://ccm2.inf.h-brs.de', method: 'JSONP', params: { realm: my.realm, token: self.data().token } } );
            success();
            break;
          case 'hbrsinfkaul':
            self.ccm.load( { url: 'https://kaul.inf.h-brs.de/login/logout.php', method: 'JSONP', params: { realm: my.realm } } );
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
       * returns authentication mode
       * @returns {string}
       */
      this.getRealm = () => {

        // context mode? => delegate method call
        if ( my.context ) return my.context.getRealm();

        return my.realm;
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
        <SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/"
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