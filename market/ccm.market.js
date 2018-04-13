/**
 * @overview market place for <i>ccm</i> components
 * @author André Kless <andre.kless@web.de> 2015-2016
 * @copyright Copyright (c) 2015-2016 André Kless
 * @license The MIT License (MIT)
 */

ccm.component( /** @lends ccm.components.market */ {

  /*-------------------------------------------- public component members --------------------------------------------*/

  /**
   * @summary component index
   * @type {ccm.types.index}
   */
  index: 'market',

  /**
   * @summary default instance configuration
   * @type {ccm.components.market.types.config}
   */
  config: {

    html:            [ ccm.store, './resources/templates.json' ],
    style:           [ ccm.load, './resources/market.css' ],
    store:           [ ccm.store, { store: 'we_ss18_market_components', url: 'https://ccm.inf.h-brs.de' } ],  // old store: market_components
    user:            [ ccm.instance, './resources/user.min.js', {
      element: 'name',
      style: [ ccm.load, './resources/user_hbrs.css' ],
      texts: {
        login: '<span class="fa fa-sign-in"></span>',
        login_title: 'Login',
        logout: '<span class="fa fa-sign-out"></span>',
        logout_title: 'Logout',
        username_title: 'this is your username'
      }
    } ],
    icons:           [ ccm.load, './resources/font-awesome.min.css' ],                     // remote source: https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css
    sidemenu:        [ ccm.instance, './resources/ccm.menu.min.js', {
      style:         [ ccm.load, './resources/sidemenu.css' ],
      classes:       'ccm-menu_market_sidemenu',
      data: {
        store:       [ ccm.store, './resources/menu.json' ],
        key:         'sidemenu'
      }
    } ],
    tabmenu:         [ ccm.instance, './resources/ccm.menu.min.js', {
      style:         [ ccm.load, './resources/tabs.css' ],
      classes:       'ccm-menu_tabs',
      data: {
        store:       [ ccm.store, './resources/menu.json' ],
        key:         'tabmenu'
      },
      selected:      1
    } ],
    publish_form:    [ ccm.component, './resources/input.min.js', {
      style:         [ ccm.load, './resources/input.css' ],
      data: {
        store:         [ ccm.store, './resources/inputs.json' ],
        key:           'publication'
      }
    } ],
    rating:          [ ccm.component, './resources/rating.min.js', {
      style:         [ ccm.load, './resources/rating.css' ],
      classes:       'ccm-rating_market',
      store:         [ ccm.store, { store: 'we_ss18_market_ratings', url: 'https://ccm.inf.h-brs.de' } ],  // old store: market_ratings
      mode:          'stars'
    } ],
    title:           'Market place for <i>ccm</i> components',
    icon: {
      menu:          'bars',
      component:     'plug',
      edit:          'pencil'
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
     * @summary own context
     * @private
     */
    var self = this;

    /**
     * @summary contains privatized config members
     * @type {ccm.components.market.types.config}
     * @private
     */
    var my;

    /**
     * website area for own content
     * @type {ccm.types.element}
     * @private
     */
    var $element;

    /**
     * component datasets
     * @type {ccm.components.market.types.component[]}
     * @private
     */
    var components;

    /*------------------------------------------- public instance methods --------------------------------------------*/

    /**
     * @summary initialize <i>ccm</i> instance
     * @description
     * Called one-time when this <i>ccm</i> instance is created, all dependencies are solved and before dependent <i>ccm</i> components, instances and datastores are initialized.
     * This method will be removed by <i>ccm</i> after the one-time call.
     * @param {function} callback - callback when this instance is initialized
     * @ignore
     */
    this.init = function ( callback ) {

      // privatize security relevant config members
      my = ccm.helper.privatize( self, 'html', 'store', 'user', 'sidemenu', 'tabmenu', 'publish_form', 'rating', 'title', 'icon' );

      // set website area for side menu
      my.sidemenu.element = ccm.helper.find( self, '.sidemenu' );

      // set click event for menu entries of side menu
      my.sidemenu.onClick = function ( entry ) {
        renderListView( entry.nr === 2 );
        closeSideMenu();
      };

      // set website area for tab menu
      my.tabmenu.element = ccm.helper.find( self, '.tabmenu' );

      // set click event for menu entries of tab menu
      my.tabmenu.onClick = function ( entry, $content, instance ) {

        /**
         * current component dataset
         * @type {ccm.components.market.types.component}
         */
        var component = instance.tmp;

        // perform action for clicked menu entry
        switch ( entry.nr ) {
          case 1: renderDetails(); break;
        //case 2: ccm.render( component.url, $content ); break;
          case 2: renderDemo(); break;
          case 3: renderConfiguration(); break;
        }

        /**
         * renders component details
         */
        function renderDetails() {
          $content.html( '<div class="details"></div>' );
          if ( component.description ) renderSection( 'Description', component.description );
          renderSection( 'Informations', ccm.helper.html( my.html.get( 'info' ), {
            name:        ccm.helper.val( component.key ),
            url:         ccm.helper.val( component.url ),
            api:         ccm.helper.val( component.api ),
            developer:   ccm.helper.val( component.developer ),
            licence:     ccm.helper.val( component.licence )
          } ) );
          if ( !component.api ) ccm.helper.find( instance, '.api' ).remove();
          function renderSection( title, content ) {
            var $section = ccm.helper.html( my.html.get( 'section' ), { title: title } );
            $section.find( '.content' ).html( content );
            ccm.helper.find( instance, '.details' ).append( $section );
          }
        }

        /**
         * renders component demo
         */
        function renderDemo() {
          var index = component.key.replace( /\./g, '-' );
          var html_string = '<script src="' + component.url + '"></script><ccm-' + index + '></ccm-' + index + '>';
          $content.html( '<iframe>' );
          $content.find( 'iframe' ).css( { width: '100%', border: '0' } )[ 0 ].src = "data:text/html;charset=utf-8," + html_string;
        }

        /**
         * renders component configuration
         */
        function renderConfiguration() {

          // render HTML structure for editable configuration
          $content.html( ccm.helper.html( my.html.get( 'config' ), { change: renderFactory } ) );

          /**
           * selector box for used factory
           * @type {ccm.types.element}
           */
          var $select = ccm.helper.find( instance, 'select' );

          // create entries for selector box
          for ( var i = 0; i < component.factories.length; i++ )
            $select.append( '<option value="' + i + '">' + ( component.factories[ i ].label || component.factories[ i ].component ) + '</option>' );

          // render factory
          renderFactory();

          /**
           * render factory for editing a instance configuration
           */
          function renderFactory() {

            /**
             * factory dataset
             * @type {object}
             */
            var factory = component.factories[ parseInt( $select.val() ) ];

            // clear website area for preview
            ccm.helper.find( instance, '.preview' ).html( '' );

            // set website area for factory component
            factory.config.element = ccm.helper.find( instance, '.factory' );

            // render preview with resulting instance configuration
            factory.config.onFinish = function ( result ) {
              result.element = ccm.helper.find( instance, '.preview' );
              console.log( component.url, result );
              ccm.render( component.url, result );
            };

            // render factory component
            components.map( function ( component ) {
              if ( component.key === factory.component )
                ccm.render( component.url, factory.config );
            } );

          }

        }

      };

      // perform callback
      callback();

    };

    /**
     * @summary renders content in own website area
     * @param {function} [callback] - callback when content is rendered
     */
    this.render = function ( callback ) {

      // prepare website area for own content
      $element = ccm.helper.element( self );

      // get component datasets
      my.store.get( {}, function ( results ) {

        // memorize component datasets
        components = results;

        // render main html structure
        $element.html( ccm.helper.html( my.html.get( 'main' ), {

          icon:          ccm.helper.val( my.icon.menu ),
          title:         ccm.helper.val( my.title ),
          click_overlay: closeSideMenu,
          click_icon:    openSideMenu,
          click_title:   function () { renderListView(); }

        } ) );

        // render login/logout area
        if ( my.user ) my.user.render();

        // render list of (checked) published ccm components
        renderListView();

        // perform callback
        if ( callback ) callback();

      } );

    };

    /*------------------------------------------ private instance functions ------------------------------------------*/

    /**
     * open side menu
     */
    function openSideMenu() {

      /**
       * website area for side menu
       * @type {ccm.types.element}
       */
      var $sidemenu = ccm.helper.find( self, '.sidemenu' );

      // disable other website areas
      $sidemenu.addClass( 'active' );
      ccm.helper.find( self, '.overlay' ).addClass( 'active' );
      ccm.helper.find( self, '.view' ).addClass( 'disabled' );

      // render side menu
      my.sidemenu.render( function () {

        // show side menu with an slide animation
        var width = $sidemenu.width();
        $sidemenu.css( 'left', -width ).animate( { left: '+=' + width } );

      } );

    }

    /**
     * close side menu
     */
    function closeSideMenu() {

      /**
       * website area for side menu
       * @type {ccm.types.element}
       */
      var $sidemenu = ccm.helper.find( self, '.sidemenu' );

      // activate other website areas
      ccm.helper.find( self, '.overlay' ).removeClass( 'active' );
      ccm.helper.find( self, '.view' ).removeClass( 'disabled' );

      // remove side menu with an slide animation
      $sidemenu.animate( { left: '-=' + $sidemenu.width() }, function () {
        $sidemenu.html( '' );
        $sidemenu.removeClass( 'active' );
      } );

    }

    /**
     * renders list of all published components
     * @param {boolean} show_not_quality_proved - true: show all quality proved components, false: show not quality proved components
     */
    function renderListView( show_not_quality_proved ) {

      // add website area for component list
      ccm.helper.find( self, '.content' ).html( '<div class="list_view">' );

      /**
       * website area for component list
       * @type {ccm.types.element}
       */
      var $list_view = ccm.helper.find( self, '.list_view' );

      // render publish entry only in quality proved component list
      if ( !show_not_quality_proved ) renderPublishEntry();

      // sort components by title
      components.sort( function( a, b ) { return a.title.toUpperCase().localeCompare( b.title.toLocaleUpperCase() ); } );

      // render component entries
      for ( var i = 0; i < components.length; i++ )
        //if ( show_not_quality_proved && !components[ i ].checked || !show_not_quality_proved && components[ i ].checked )
          renderEntry( components[ i ] );

      /**
       * renders component entry for publishing a new component
       */
      function renderPublishEntry() {

        // render html structure of an list entry
        $list_view.append( ccm.helper.html( my.html.get( 'entry' ), {

          classes: ' publish',
          tooltip: 'Add a new component to this market place',
          icon:    'plus',
          title:   'Add your own component',
          click:   function () { renderPublishView(); }

        } ) );

      }

      /**
       * renders an component entry
       * @param {ccm.components.market.types.component} component - component dataset
       */
      function renderEntry( component ) {

        // render html structure of an list entry
        $list_view.append( ccm.helper.html( my.html.get( 'entry' ), {

          classes:   '',
          tooltip:   ccm.helper.val( component.abstract ) || '',
          icon:      ccm.helper.val( component.icon || my.icon.component ),
          title:     ccm.helper.val( component.title || component.key ),
          developer: ccm.helper.val( component.developer ),
          click:     function () { renderComponentView( component ); }

        } ) );

        // render component rating
        renderRating( ccm.helper.find( self, $list_view, '.rating:last' ), component.key );

      }

    }

    /**
     * renders view for publishing a new component
     * @param {ccm.components.market.types.component} component - component dataset
     */
    function renderPublishView( component ) {

      // add website area for publish view
      ccm.helper.find( self, '.content' ).html( '<div class="publish_view"></div>' );

      // render HTML form for publishing or editing a component
      my.publish_form.render( {

        parent:   self,
        element:  ccm.helper.find( self, '.publish_view' ),
        edit: component ? {
          store:  my.store,
          key:    component.key,
          no_set: true
        } : null,
        form:     component ? 'Save' : 'Publish',
        fieldset: component ? 'Edit Component' : 'Publish Form',
        onFinish: onFinish

      } );

      /**
       * submit callback for the HTML form for publishing or editing a component
       * @param {ccm.components.market.types.component} result - resulting dataset of the HTML form
       */
      function onFinish( result ) {

        // login user
        my.user.login( function () {

          // integrate username and full name of developer in resulting dataset
          result.user = my.user.data().key;
          result.developer = my.user.data().key;

          /**
           * filename of the component
           * @type {string}
           */
          var filename = result.url.split( '/' ).pop();

          // check for valid filename
          if ( !ccm.helper.regex( 'filename' ).test( filename ) )
            return alert( 'Your component filename has not a valid value.' );

          // integrate unique component name in resulting dataset
          var split = filename.split( '.' );
          if ( split[ 0 ] === 'ccm' )
            split.shift();
          split.pop();
          if ( split[ split.length - 1 ] === 'min' )
            split.pop();
          result.key = split.join( '.' );

          // check if component name is unique
          for ( var i = 0; i < components.length; i++ )
            if ( components[ i ].key === result.key && ( !component || components[ i ].user !== result.user ) )
              return alert( 'Unique name of component already exists. Try another.' );

          // no component title? => use unique component name for title
          if ( !result.title ) result.title = result.key;

          // save resulting component dataset (component is now published/edited)
          my.store.set( result, function () {

            // unique name of component has changed? => delete component dataset with old unique name
            if ( component && result.key !== component.key ) my.store.del( component.key, proceed ); else proceed();

            function proceed() {

              // component successful published/edited
              alert( 'Saved!' /*+ ( component ? '' : ' You find your published component in the "Not Quality Proved" section until it\'s quality checked.' )*/ );

              // (re)render component market place
              self.render();

            }

          } );

        } );

      }

    }

    /**
     * render component view
     * @param {ccm.components.market.types.component} component - component dataset
     */
    function renderComponentView( component ) {

      // add website area for component view
      ccm.helper.find( self, '.content' ).html( '<div class="component_view">' );

      /**
       * website area for component view
       * @type {ccm.types.element}
       */
      var $component_view = ccm.helper.find( self, '.component_view' );

      // render html structure for component view
      $component_view.html( ccm.helper.html( my.html.get( 'component' ), {

        icon:     ccm.helper.val( component.icon || my.icon.component ),
        title:    ccm.helper.val( component.title || component.key ),
        abstract: ccm.helper.val( component.abstract ) || '',
        edit:     my.icon.edit,
        click:    onClick

      } ) );

      /**
       * is the user the developer of this component?
       * @type {boolean}
       */
      var isPublisher = my.user.isLoggedIn() && my.user.data().key === component.user;

      // user logged in and not developer of this component? => remove edit button
      if ( my.user.isLoggedIn() && !isPublisher ) ccm.helper.find( self, '.edit' ).remove();

      // render component rating
      renderRating( ccm.helper.find( self, '.rating' ), component.key, !isPublisher );

      // render tab menu
      my.tabmenu.tmp = component;
      my.tabmenu.render( function () {

        // no factories for this component? => remove menu entry for component configuration
        if ( !component.factories ) ccm.helper.find( my.tabmenu, '.entry' ).get( 2 ).remove();

      } );

      /**
       * click event for the edit component button
       */
      function onClick() {

        // login user
        my.user.login( function () {

          // render publish view for editing component only if the user is the developer of this component
          if ( my.user.data().key === component.user )
            renderPublishView( component );
          else
            renderComponentView( component );

        } );

      }

    }

    /**
     * render a component rating
     * @param {ccm.types.element} $rating - website area for component rating
     * @param {ccm.types.name} component_name - unique name of the component
     * @param {boolean} editable - false: only show rating, true: user can rate
     */
    function renderRating( $rating, component_name, editable ) {

      /**
       * HTML ID for rating website area
       * @type {string}
       */
      var html_id = 'ccm-' + self.index + '-component-' + component_name;

      // set HTML ID
      $rating.attr( 'id', html_id );

      // render loading icon
      ccm.helper.loading( $rating );

      /**
       * instance configuration for rating instance
       * @type {ccm.types.config}
       */
      var config = {
        parent: self,
        element: jQuery( '#' + html_id ),
        key: component_name
      };

      // only show rating? => no user property for rating instance
      if ( !editable ) config.user = null;

      // render component rating
      my.rating.render( config );

    }

  }

  /*------------------------------------------------ type definitions ------------------------------------------------*/

  /**
   * @namespace ccm.components.market
   */

  /**
   * @namespace ccm.components.market.types
   */

  /**
   * @summary <i>ccm</i> instance configuration
   * @typedef {ccm.types.config} ccm.components.market.types.config
   * @property {string} classes - css classes for own website area
   * @property {ccm.types.element} element - own website area
   * @property {ccm.types.dependency} html - <i>ccm</i> html data templates for own content
   * @property {ccm.types.key} key - key of [market dataset]{@link ccm.components.market.types.dataset} for rendering
   * @property {ccm.types.dependency} store - <i>ccm</i> datastore that contains the [market dataset]{@link ccm.components.market.types.dataset} for rendering
   * @property {ccm.types.dependency} style - css for own content
   *
   * @property {ccm.types.url} icon - default image file for an <i>ccm</i> component icon
   */

  /**
   * @summary market dataset
   * @typedef {ccm.types.dataset} ccm.components.market.types.dataset
   * @property {Object.<ccm.types.key, ccm.components.market.types.component>} components - market component datasets
   * @property {ccm.types.key} key - market key
   */

  /**
   * @summary market component dataset
   * @typedef {ccm.types.dataset} ccm.components.market.types.component
   * @property {string} abstract - short description of component
   * @property {string} description - component description
   * @property {string} developer - developer of component
   * @property {ccm.types.url} icon - component icon url
   * @property {ccm.types.key} key - dataset key and component title and unique component name respectively
   * @property {string} licence - component licence
   * @property {number} rating - component rating
   * @property {ccm.types.url} url - component file url
   * @property {ccm.types.api} api - component api url
   * @property {string} version - component version
   * @property {number} voting - amount of votes cast
   */

  /**
   * @external ccm.types
   * @see {@link http://akless.github.io/ccm-developer/api/ccm/ccm.types.html}
   */

} );