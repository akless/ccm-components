/**
 * @overview <i>ccm</i> component for user authentication
 * @author André Kless <andre.kless@web.de.de> 2015-2016
 * @license The MIT License (MIT)
 */

ccm.component( /** @lends ccm.components.user2 */ {

  /*-------------------------------------------- public component members --------------------------------------------*/

  /**
   * @summary component name
   * @type {ccm.types.name}
   */
  name: 'user2',

  /**
   * @summary default instance configuration
   * @type {ccm.components.user2.types.config}
   */
  config: {

    html:    [ ccm.load, './json/user_html.json' ],
    sign_on: 'hbrsinfkaul',
    context: true,
    texts: {
      login:          'Login',
      login_title:    'click here for login',
      logout:         'Logout',
      logout_title:   'click here for logout',
      username_title: 'this is your username'
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
     * @summary dataset of the current logged in user
     * @type {ccm.components.user2.types.dataset}
     * @private
     */
    var dataset = null;

    /**
     * @summary observers for login and logout event
     * @type {function[]}
     * @private
     */
    var observers = [];

    /**
     * @summary own context
     * @private
     */
    var self = this;

    /**
     * @summary sign-on
     * @private
     * @type {string}
     */
    var sign_on;

    /*------------------------------------------- public instance methods --------------------------------------------*/

    /**
     * @summary initialize <i>ccm</i> instance
     * @description
     * Called one-time when this <i>ccm</i> instance is created, all dependencies are solved and before dependent <i>ccm</i> components, instances and datastores are initialized.
     * This method will be removed by <i>ccm</i> after the one-time call.
     * @param {function} callback - callback when this instance is initialized
     */
    this.init = function ( callback ) {

      // context mode? = set context to highest ccm instance for user authentication in current ccm context
      if ( self.context ) { var context = ccm.context.find( self, 'user' ); self.context = context && context.context || context; }

      // privatize security relevant config members
      sign_on = self.sign_on; delete self.sign_on;

      // perform callback
      callback();

    };

    /**
     * @summary render content in own website area
     * @param {function} [callback] - callback when content is rendered
     */
    this.render = function ( callback ) {

      // context mode? => delegate function call
      if ( self.context ) return self.context.render( callback );

      /**
       * website area for own content
       * @type {ccm.types.element}
       */
      var element = ccm.helper.element( self );

      // user is logged in? => render html structure for logout button
      if ( self.isLoggedIn() ) element.html( ccm.helper.html(

          self.html.logged_in,
          ccm.helper.val( self.data().key ),
          ccm.helper.val( self.text_username_title ),
          ccm.helper.val( self.text_logout ),
          clickLogout,
          ccm.helper.val( self.text_logout_title )

      ) );

      // user is logged out => render login button
      else element.html( ccm.helper.html(

          self.html.logged_out,
          ccm.helper.val( self.text_login ),
          clickLogin,
          ccm.helper.val( self.text_login_title )

      ) );

      // translate own content
      if ( self.lang ) self.lang.render();

      // perform callback
      if ( callback ) callback();

      /**
       * click event for login button
       */
      function clickLogin() {

        // login user and (re)render own content
        self.login( function () { self.render(); } );

      }

      /**
       * click event for logout button
       */
      function clickLogout() {

        // logout user and (re)render own content
        self.logout( function () { self.render(); } );

      }

    };

    /**
     * @summary login user
     * @description the callback will directly called if user is already logged in
     * @param {function} [callback]
     */
    this.login = function ( callback ) {

      // context mode? => delegate function call
      if ( self.context ) return self.context.login( callback );

      // user already logged in? => perform callback without login
      if ( self.isLoggedIn() ) { if ( callback ) callback(); return; }

      // start login
      switch ( sign_on ) {
        case 'demo':
          ccm.load( [ 'https://kaul.inf.h-brs.de/login/demo_login.php', { realm: 'hbrsinfkaul' } ], function ( response ) { success( response.user, response.token ); } );
          break;
        case 'hbrsinfkaul':
          ccm.load( [ 'https://kaul.inf.h-brs.de/login/login2.php', { realm: 'hbrsinfkaul' } ], function ( response ) { success( response.user, response.token, response.name ); } );
          break;
      }

      /**
       * callback when login is successful
       * @param {string} key - dataset key and username, respectively
       * @param {string} token - security token
       * @param {string} name - full name of user
       */
      function success( key, token, name ) {

        // hold user data
        dataset = {

          key:   key,
          token: token,
          name:  name

        };

        // (re)render own content
        if ( ccm.helper.isInDOM( self ) ) self.render();

        // perform callback
        if ( callback ) callback();

        // notify observers about login event
        notify( true );

      }

    };

    /**
     * @summary logout user
     * @description the callback will directly called if user is already logged out
     * @param {function} [callback]
     */
    this.logout = function ( callback ) {

      // context mode? => delegate function call
      if ( self.context ) return self.context.logout( callback );

      // user already logged out? => perform callback without logout
      if ( !self.isLoggedIn() ) { if ( callback ) callback(); return; }

      // start logout
      switch ( sign_on ) {

        case 'demo':
          ccm.load( [ 'https://logout@kaul.inf.h-brs.de/login/demo_logout.php', { realm: 'hbrsinfkaul' } ] );
          success();
          break;

        case 'hbrsinfkaul':
          ccm.load( [ 'https://logout@kaul.inf.h-brs.de/login/logout.php', { realm: 'hbrsinfkaul' } ] );
          success();
          break;

      }

      /**
       * callback when logout is successful
       */
      function success() {

        // clear user dataset
        dataset = null;

        // (re)render own content
        if ( ccm.helper.isInDOM( self ) ) self.render();

        // perform callback
        if ( callback ) callback();

        // notify observers about logout event
        notify( false );

      }

    };

    /**
     * @summary checks if user is logged in
     * @returns {boolean}
     */
    this.isLoggedIn = function () {

      // context mode? => delegate function call
      if ( self.context ) return self.context.isLoggedIn();

      return !!dataset;

    };

    /**
     * @summary get user dataset
     * @returns {ccm.components.user2.types.dataset}
     */
    this.data = function () {

      // context mode? => delegate function call
      if ( self.context ) return self.context.data();

      return dataset;

    };

    /**
     * @summary add an observer for login and logout event
     * @param {function} observer - will be performed when event fires (first parameter is kind of event -> true: login, false: logout)
     */
    this.addObserver = function ( observer ) {

      // context mode? => delegate function call
      if ( self.context ) return self.context.addObserver( observer );

      // add observer
      observers.push( observer );

    };

    /*------------------------------------------- private instance methods -------------------------------------------*/

    /**
     * @summary notify observers
     * @param {boolean} event - true: login, false: logout
     * @private
     */
    function notify( event ) {

      for ( var i = 0; i < observers.length; i++ )
        observers[ i ]( event );

    }

  }

  /*------------------------------------------------ type definitions ------------------------------------------------*/

  /**
   * @namespace ccm.components.user2
   */

  /**
   * @summary <i>ccm</i> instance configuration
   * @typedef {ccm.types.config} ccm.components.user2.types.config
   * @property {ccm.types.element} element - <i>ccm</i> instance website area
   * @property {ccm.types.dependency} html - <i>ccm</i> datastore for html templates
   * @property {string} classes - html classes for own website area
   * @property {ccm.types.url} style - URL to a css file which contains the styles for own website area
   * @property {ccm.components.user2.types.texts} texts - [static texts in own website area]{@link ccm.components.user2.types.texts}
   */

  /**
   * @summary user dataset
   * @typedef {ccm.types.dataset} ccm.components.user2.types.dataset
   * @property {string} key - dataset key and username, respectively
   * @property {string} token - security token
   * @property {string} name - full name of user
   * @example {
   *   key:   'akless',
   *   token: '65aadf5af120ccd7ea87045e11f8037c',
   *   name:  'Andre Kless'
   * }
   */

  /**
   * @summary static texts in own website area
   * @typedef {object} ccm.components.user2.types.text
   * @property {string} login - caption of login button
   * @property {string} login_title - value of title attribute for login button
   * @property {string} logout - caption of logout button
   * @property {string} logout_title - value of title attribute for logout button
   * @property {string} username_title - value of title attribute for website area which shows the username of the current logged in user
   * @example {
   *   login:          'Login',
   *   login_title:    'click here for login',
   *   logout:         'Logout',
   *   logout_title:   'click here for logout',
   *   username_title: 'this is your username'
   * }
   */

  /**
   * @external ccm.types
   * @see {@link http://akless.github.io/ccm-developer/api/ccm/ccm.types.html}
   */

} );