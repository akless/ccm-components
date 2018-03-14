/**
 * @overview ccm component for Create/Read/Update/Delete a Modular App
 * @author André Kless <andre.kless@web.de>, 2018
 * @license The MIT License (MIT)
 * @version latest (1.0.0)
 * @changes
 * version 1.0.0 (09.02.2018)
 */

{
  var component = {

    /**
     * unique component name
     * @type {string}
     */
    name: 'crud_app',

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

      "html": {
        "main": {
          "id": "main",
          "inner": [
            { "id": "builder" },
            {
              "id": "buttons",
              "class": "text-center",
              "inner": {
                "class": "btn-group",
                "inner": [
                  {
                    "id": "btn_create",
                    "class": "btn btn-primary",
                    "onclick": "%onCreate%",
                    "inner": "Create"
                  },
                  {
                    "id": "btn_read",
                    "class": "btn btn-default",
                    "onclick": "%onRead%",
                    "inner": "Read"
                  },
                  {
                    "id": "btn_update",
                    "class": "btn btn-primary disabled",
                    "onclick": "%onUpdate%",
                    "inner": "Update"
                  },
                  {
                    "id": "btn_delete",
                    "class": "btn btn-danger disabled",
                    "onclick": "%onDelete%",
                    "inner": "Delete"
                  }
                ]
              }
            },
            {
              "id": "advance",
              "class": "container-fluid"
            }
          ]
        },
        "usage": {
          "id": "usage",
          "inner": [
            {
              "tag": "p",
              "id": "success",
              "class": "lead text-success",
              "inner": "Saved successfully"
            },
            {
              "tag": "legend",
              "class": "text-primary",
              "inner": "How can you use the App?"
            },
            {
              "tag": "p",
              "class": "text-info",
              "inner": [
                "Add the following ",
                {
                  "tag": "code",
                  "inner": "EMBED CODE"
                },
                " to your page:"
              ]
            },
            {
              "tag": "p",
              "inner": {
                "tag": "code",
                "id": "embed_code"
              }
            },
            {
              "tag": "legend",
              "class": "text-primary",
              "inner": "If you want to change the created App..."
            },
            {
              "tag": "p",
              "class": "alert alert-info",
              "role": "alert",
              "inner": [
                {
                  "tag": "span",
                  "class": "glyphicon glyphicon-exclamation-sign"
                },
                " Note this ID: ",
                {
                  "tag": "span",
                  "class": "text-danger",
                  "id": "id"
                }
              ]
            }
          ]
        },
        "load": {
          "id": "load",
          "inner": [
            {
              "tag": "legend",
              "class": "text-primary",
              "inner": "Loading an existing App"
            },
            {
              "tag": "p",
              "class": "text-info",
              "inner": "Give here your App Identifier:",
            },
            {
              "class": "input-group",
              "inner": [
                {
                  "tag": "input",
                  "id": "key",
                  "class": "form-control",
                  "type": "text",
                  "placeholder": "ID..."
                },
                {
                  "tag": "span",
                  "class": "input-group-btn",
                  "inner": {
                    "tag": "button",
                    "id": "btn_load",
                    "class": "btn btn-info",
                    "onclick": "%onLoadApp%",
                    "inner": "Load App"
                  }
                }
              ]
            }
          ]
        },
        "deleted": {
          "id": "deleted",
          "inner": {
            "tag": "p",
            "id": "success",
            "class": "lead text-danger",
            "inner": "App was deleted successfully."
          }
        },
        "loaded": {
          "id": "loaded",
          "inner": {
            "tag": "p",
            "id": "success",
            "class": "lead text-success",
            "inner": "App was loaded successfully."
          }
        }
      },
      "css": [ "ccm.load",
        "https://tkless.github.io/ccm-components/libs/bootstrap/css/bootstrap.css",
        { "context": "head", "url": "https://tkless.github.io/ccm-components/libs/bootstrap/css/font-face.css" }
      ],
      "warning": "Are you sure you want to delete this App?"

  //  "builder"
  //  "store"
  //  "url"
  //  "onchange"
  //  "user"
  //  "logger"

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
       * current app builder instance
       * @type {object}
       */
      let builder;

      /**
       * current App-ID
       * @type {string}
       */
      let key;

      /**
       * is called once after the initialization and is then deleted
       * @param {function} callback - called after all synchronous and asynchronous operations are complete
       */
      this.ready = callback => {

        // set shortcut to help functions
        $ = self.ccm.helper;

        // privatize all possible instance members
        my = $.privatize( self );

        // should events be logged? => log event
        if ( self.logger ) self.logger.log( 'ready', function () {
          const data = self.ccm.helper.clone( my );
          if ( data.builder ) data.builder = my.builder.index;
          if ( data.store ) data.store = data.store.source();
          return data;
        }() );

        callback();
      };

      /**
       * starts the instance
       * @param {function} [callback] - called after all synchronous and asynchronous operations are complete
       */
      this.start = callback => {

        // render main HTML structure
        $.setContent( self.element, $.html( my.html.main, {
          onCreate: () => createApp(),
          onRead:   () =>   readApp(),
          onUpdate: () => updateApp(),
          onDelete: () => deleteApp()
        } ) );

        /**
         * website area of the app builder
         * @type {Element}
         */
        const builder_elem = self.element.querySelector( '#builder' );

        /**
         * website area of the buttons
         * @type {Element}
         */
        const buttons_elem = self.element.querySelector( '#buttons' );

        /**
         * website area for advanced content
         * @type {Element}
         */
        const advance_elem = self.element.querySelector( '#advance' );

        // render app builder
        my.builder.start( { root: builder_elem, target: [ 'ccm.component', my.url ] }, builder_inst => {

          // remember the app builder instance
          builder = builder_inst;

          // should events be logged? => log event
          if ( self.logger ) self.logger.log( 'start' );

          // rendering completed => perform callback
          callback && callback();

        } );

        /** when the "Create" button has been clicked */
        function createApp() {

          // has user instance? => perform login
          if ( self.user ) self.user.login( proceed ); else proceed();

          function proceed() {

            /**
             * current app configuration from the app builder
             * @type {object}
             */
            const config = builder.getValue();

            // add permission settings
            if ( self.user ) config._ = { creator: self.user.data().id, access: 'creator' };

            // remove existing key (than new key will be generated)
            delete config.key;

            // should events be logged? => log event
            if ( self.logger ) self.logger.log( 'create', config );

            // save the app configuration in the datastore and give the app to the user
            my.store.set( config, handoverApp );

          }

        }

        /** when the "Read" button has been clicked */
        function readApp() {

          // should events be logged? => log event
          if ( self.logger ) self.logger.log( 'read' );

          // render an input field via which an App-ID can be entered
          $.setContent( advance_elem, $.html( my.html.load, {

            onLoadApp: () => {

              // has user instance? => perform login
              if ( self.user ) self.user.login( proceed ); else proceed();

              function proceed() {

                /**
                 * entered App-ID
                 * @type {string}
                 */
                const value = advance_elem.querySelector( '#key' ).value.trim();

                // no App-ID? => abort
                if ( !value ) return;

                // use entered App-ID to load the corresponding app configuration from the datastore
                my.store.get( value, app => {

                  // no app configuration? => abort
                  if ( !app ) return;

                  // should events be logged? => log event
                  if ( self.logger ) self.logger.log( 'load', app );

                  // render new app builder instance with the loaded app configuration as start values
                  my.builder.start( { root: builder_elem, target: [ 'ccm.component', my.url ], start_values: app }, builder_inst => {

                    // remember the App-ID and the app builder instance
                    key = value; builder = builder_inst;

                    // render success message (and slowly fade it out)
                    $.setContent( advance_elem, $.html( my.html.loaded ) );
                    fadeOut( advance_elem.querySelector( '#success' ) );

                    // has onchange callback? => perform it
                    self.onchange && self.onchange( self );

                  } );

                } );

              }

            }

          } ) );

        }

        /** when the "Update" button has been clicked */
        function updateApp() {

          // has no existing App-ID? => abort
          if ( !key ) return;

          // has user instance? => perform login
          if ( self.user ) self.user.login( proceed ); else proceed();

          function proceed() {

            /**
             * current app configuration from the app builder
             * @type {object}
             */
            const config = builder.getValue();

            // add App-ID to the app configuration (to save the app under the same App-ID again)
            config.key = key;

            // should events be logged? => log event
            if ( self.logger ) self.logger.log( 'update', config );

            // save the app configuration in the datastore and give the app to the user
            my.store.set( config, handoverApp );

          }

        }

        /** when the "Delete" button has been clicked */
        function deleteApp() {

          // has no existing App-ID or user is not sure about the deletion? => abort
          if ( !key || !confirm( my.warning ) ) return;

          // has user instance? => perform login
          if ( self.user ) self.user.login( proceed ); else proceed();

          function proceed() {

            // should events be logged? => log event
            if ( self.logger ) self.logger.log( 'delete', key );

            // delete the app configuration in the datastore
            my.store.del( key, () => {

              // forget the App-ID
              key = undefined;

              // render success message (and slowly fade it out)
              $.setContent( advance_elem, $.html( my.html.deleted ) );
              fadeOut( advance_elem.querySelector( '#success' ) );

              // disable "Update" and "Delete" button
              buttons_elem.querySelector( '#btn_update' ).classList.add( 'disabled' );
              buttons_elem.querySelector( '#btn_delete' ).classList.add( 'disabled' );

              // has onchange callback? => perform it
              self.onchange && self.onchange( self );

            } );

          }

        }

        /**
         * gives the app to the user
         * @param {object} app - app configuration
         */
        function handoverApp( app ) {

          // remember the App-ID
          key = app.key;

          // activate "Update" and "Delete" button
          [ ...buttons_elem.querySelectorAll( '.disabled' ) ].map( button => button.classList.remove( 'disabled' ) );

          // render app usage informations
          $.setContent( advance_elem, $.html( my.html.usage ) );
          advance_elem.querySelector( '#embed_code' ).innerHTML = getEmbedCode( $.getIndex( my.url ), my.store.source(), app.key );
          advance_elem.querySelector( '#id'         ).innerHTML = app.key;

          // fade out the success message
          fadeOut( advance_elem.querySelector( '#success' ) );

          // has onchange callback? => perform it
          self.onchange && self.onchange( self );

          /** returns the embed code for the saved app */
          function getEmbedCode( index, store_settings, key ) {
            return '&lt;script src="'+my.url+'"&gt;&lt;/script&gt;&lt;ccm-'+index+' key=\'["ccm.get",'+store_settings+',"'+key+'"]\'>&lt;/ccm-'+index+'&gt;';
          }

        }

        /**
         * fades out an element
         * @param {Element} elem
         */
        function fadeOut( elem ) {
          elem.style.opacity = 1;
          ( function fade() {
            if ( ( elem.style.opacity -= .005 ) >= 0 ) requestAnimationFrame( fade );
          } )();
        }

      };

      /**
       * returns the resulting instance configuration for the target component
       * @returns {object} instance configuration for target component
       */
      this.getValue = () => builder && builder.getValue && builder.getValue() || null;

    }

  };

  function p(){window.ccm[v].component(component)}const f="ccm."+component.name+(component.version?"-"+component.version.join("."):"")+".js";if(window.ccm&&null===window.ccm.files[f])window.ccm.files[f]=component;else{const n=window.ccm&&window.ccm.components[component.name];n&&n.ccm&&(component.ccm=n.ccm),"string"==typeof component.ccm&&(component.ccm={url:component.ccm});var v=component.ccm.url.split("/").pop().split("-");if(v.length>1?(v=v[1].split("."),v.pop(),"min"===v[v.length-1]&&v.pop(),v=v.join(".")):v="latest",window.ccm&&window.ccm[v])p();else{const e=document.createElement("script");document.head.appendChild(e),component.ccm.integrity&&e.setAttribute("integrity",component.ccm.integrity),component.ccm.crossorigin&&e.setAttribute("crossorigin",component.ccm.crossorigin),e.onload=function(){p(),document.head.removeChild(e)},e.src=component.ccm.url}}
}