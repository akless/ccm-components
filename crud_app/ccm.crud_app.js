/**
 * @overview ccm component for Create/Read/Update/Delete a Modular App
 * @author André Kless <andre.kless@web.de>, 2018
 * @license The MIT License (MIT)
 * @version latest (1.0.0)
 * @changes
 * version 1.0.0 (07.02.2018)
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
        "https://tkless.github.io/ccm-components/lib/bootstrap/css/bootstrap.css",
        { "context": "head", "url": "https://tkless.github.io/ccm-components/lib/bootstrap/css/font-face.css" }
      ],
      "warning": "Are you sure you want to delete this App?"

  //  "builder": [ "ccm.component", "../cloze_builder/ccm.cloze_builder.js", { "submit_button": false } ],
  //  "store": [ "ccm.store", { "store": "w2c_cloze", "url": "https://ccm.inf.h-brs.de" } ],
  //  "url": "https://akless.github.io/ccm-components/cloze/versions/ccm.cloze-2.2.0.min.js",
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

      let builder;
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

        callback();
      };

      /**
       * starts the instance
       * @param {function} [callback] - called after all synchronous and asynchronous operations are complete
       */
      this.start = callback => {

        $.setContent( self.element, $.html( my.html.main, {
          onCreate: () => createApp(),
          onRead:   () =>   readApp(),
          onUpdate: () => updateApp(),
          onDelete: () => deleteApp()
        } ) );

        const builder_elem = self.element.querySelector( '#builder' );
        const buttons_elem = self.element.querySelector( '#buttons' );
        const advance_elem = self.element.querySelector( '#advance' );

        my.builder.start( { root: builder_elem, target: [ 'ccm.component', my.url ] }, builder_inst => {
          builder = builder_inst;
          callback && callback();
        } );

        function createApp() {

          if ( self.user ) self.user.login( proceed ); else proceed();

          function proceed() {

            const config = builder.getValue();
            if ( self.user ) config._ = { creator: self.user.data().id, access: 'creator' };
            delete config.key;
            my.store.set( config, handoverApp );

          }

        }

        function readApp() {

          $.setContent( advance_elem, $.html( my.html.load, {
            onLoadApp: () => {
              if ( self.user ) self.user.login( proceed ); else proceed();
              function proceed() {
                const value = advance_elem.querySelector( '#key' ).value.trim();
                if ( !value ) return;
                my.store.get( value, app => {
                  if ( !app ) return;
                  my.builder.start( { root: builder_elem, target: [ 'ccm.component', my.url ], start_values: app }, builder_inst => {
                    key = value;
                    builder = builder_inst;
                    $.setContent( advance_elem, $.html( my.html.loaded ) );
                    fadeOut( advance_elem.querySelector( '#success' ) );
                  } );
                } );
              }
            }
          } ) );

        }

        function updateApp() {

          if ( !key ) return;

          if ( self.user ) self.user.login( proceed ); else proceed();

          function proceed() {

            const config = builder.getValue();
            config.key = key;
            my.store.set( config, handoverApp );

          }

        }

        function deleteApp() {

          if ( !key || !confirm( my.warning ) ) return;

          if ( self.user ) self.user.login( proceed ); else proceed();

          function proceed() {

            my.store.del( key, () => {
              key = undefined;
              $.setContent( advance_elem, $.html( my.html.deleted ) );
              fadeOut( advance_elem.querySelector( '#success' ) );
              buttons_elem.querySelector( '#btn_update' ).classList.add( 'disabled' );
              buttons_elem.querySelector( '#btn_delete' ).classList.add( 'disabled' );
            } );

          }

        }

        function handoverApp( app ) {

          key = app.key;
          [ ...buttons_elem.querySelectorAll( '.disabled' ) ].map( button => button.classList.remove( 'disabled' ) );

          $.setContent( advance_elem, $.html( my.html.usage ) );
          advance_elem.querySelector( '#embed_code' ).innerHTML = getEmbedCode( $.getIndex( my.url ), my.store.source(), app.key );
          advance_elem.querySelector( '#id'         ).innerHTML = app.key;

          fadeOut( advance_elem.querySelector( '#success' ) );

          function getEmbedCode( index, store_settings, key ) {
            return '&lt;script src="'+my.url+'"&gt;&lt;/script&gt;&lt;ccm-'+index+' key=\'["ccm.get",'+store_settings+',"'+key+'"]\'>&lt;/ccm-'+index+'&gt;';
          }

        }

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