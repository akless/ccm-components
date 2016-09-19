/**
 * @overview <i>ccm</i> component for interpret JavaScript expressions
 * @author André Kless <andre.kless@web.de> 2016
 * @license The MIT License (MIT)
 */

ccm.component( /** @lends ccm.components.eval */ {

  /*-------------------------------------------- public component members --------------------------------------------*/

  /**
   * @summary component index
   * @type {ccm.types.index}
   */
  index: 'eval',

  /**
   * @summary default instance configuration
   * @type {ccm.components.eval.types.config}
   */
  config: {

    style:    [ ccm.load,  '../eval/default.css' ],
    edit:     {
      store:  [ ccm.store, '../eval/editstore.json' ],
      key:    'demo'
    },
    button:   'Submit',
    fieldset: 'Editable Demo Expression',
    onFinish: function ( result, dataset ) { console.log( result, dataset ); }

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
     * @type {ccm.components.eval.types.config}
     */
    var my;

    /*------------------------------------------- public instance methods --------------------------------------------*/

    /**
     * @summary initialize <i>ccm</i> instance
     * @description
     * Called one-time when this <i>ccm</i> instance is created, all dependencies are solved and before dependent <i>ccm</i> components, instances and datastores are initialized.
     * This method will be removed by <i>ccm</i> after the one-time call.
     * @param {function} callback - callback when this instance is initialized
     */
    this.init = function ( callback ) {

      // privatize security relevant config members
      my = ccm.helper.privatize( self, 'edit', 'bigdata', 'button', 'fieldset', 'onFinish' );

      // perform callback
      callback();

    };

    /**
     * @summary render content in own website area
     * @param {function} [callback] - callback when content is rendered
     */
    this.render = function ( callback ) {

      /**
       * website area for own content
       * @type {ccm.types.element}
       */
      var $element = ccm.helper.element( self );

      // get dataset for editing
      ccm.helper.dataset( my.edit, function ( editset ) {

        /**
         * ccm HTML data for own website area
         * @type {ccm.types.html}
         */
        var html = [ { class: 'code', contenteditable: true, inner: editset.html }, { tag: 'button', inner: my.button, onclick: '%%' } ];

        // generate ccm HTML data for HTML fieldset
        generateFieldset();

        // set content of own website area
        $element.html( ccm.helper.html( html, submit ) );

        // log render event
        if ( my.bigdata ) my.bigdata.log( 'render', ccm.helper.dataSource( my.edit ) );

        // perform callback
        if ( callback ) callback();

        /**
         * generate ccm HTML data for HTML fieldset
         */
        function generateFieldset() {

          if ( my.fieldset ) {
            html = { tag: 'fieldset', inner: html };
            if ( typeof my.fieldset === 'string' )
              html.inner.unshift( { tag: 'legend', inner: my.fieldset } );
          }

        }

        /**
         * submit callback of the HTML form
         * @returns {boolean}
         */
        function submit() {

          var $code = ccm.helper.find( self, '.code' );
          editset.html = $code.html();
          editset.text = $code.text();
          var result;

          // log render event
          if ( my.bigdata ) my.bigdata.log( 'finish', {
            edit: ccm.helper.dataSource( my.edit ),
            result: editset.text
          } );

          // try to interpret JavaScript expression
          try { result = JSON.parse( editset.text ); } catch ( err ) {
            try { result = eval( '(' + editset.text + ')' ); } catch ( err ) {
              alert( 'input is not valid' ); return false;
            }
          }

          // update dataset in datastore
          my.edit.store.set( editset, function ( dataset ) {

            // has interpreted result? => convert dot notations in result
            if ( result ) result = convert( result );

            // perform given submit callback with result of interpreted JavaScript expression and resulting dataset
            my.onFinish( result, dataset );

            /**
             * convert dot notations to deeper properties
             * @param obj
             * @returns {object}
             * @example
             * var obj = {
             *   test: 123,
             *   foo.bar: 'abc',
             *   foo.baz: 'xyz'
             * };
             * var result = convert( obj );
             * => { test: 123, foo: { bar: 'abc', baz: 'xyz' } }
             */
            function convert( obj ) {

              var keys = Object.keys( obj );
              for ( var i = 0; i < keys.length; i++ )
                if ( keys[ i ].indexOf( '.' ) !== -1 ) {
                  ccm.helper.value( obj, keys[ i ], obj[ keys[ i ] ] );
                  delete obj[ keys[ i ] ];
                }
              return obj;

            }

          } );

          // prevent page reload
          return false;

        }

      } );

    }

  }

  /*------------------------------------------------ type definitions ------------------------------------------------*/

  /**
   * @namespace ccm.components.eval
   */

  /**
   * @namespace ccm.components.eval.types
   */

  /**
   * @summary <i>ccm</i> instance configuration
   * @typedef {ccm.config} ccm.components.eval.types.config
   * @property {ccm.types.element} element - <i>ccm</i> instance website area
   * @property {ccm.types.dependency} style - CSS for own website area
   * @property {ccm.types.dependency} edit.store - <i>ccm</i> datastore that contains the [dataset for editing]{@link ccm.components.eval.types.editset}
   * @property {ccm.types.key} edit.key - key of [dataset for editing]{@link ccm.components.eval.types.editset}
   * @property {ccm.types.dependency} bigdata - <i>ccm</i> instance for big data
   * @property {boolean|string} button - button caption
   * @property {boolean|string} fieldset - wraps a fieldset<br>
   * <br>
   * <code>falsy</code>: no fieldset<br>
   * <code>true</code>: fieldset without a legend<br>
   * <code>string</code>: fieldset with given string as legend
   * @property {ccm.components.eval.types.onFinish} onFinish - callback for button click event
   * @example {
   *   element:  jQuery( 'body' ),
   *   classes:  'ccm-eval',
   *   style:    [ ccm.load,  '../eval/layout.css' ],
   *   edit: {
   *     store:  [ ccm.store, '../eval/editstore.json' ],
   *     key:    'demo'
   *   },
   *   bigdata:  [ ccm.instance, '../bigdata/ccm.bigdata.js' ],
   *   button:   'Submit',
   *   fieldset: 'Editable Demo Expression',
   *   onFinish: function ( result, dataset ) { console.log( result, dataset ); }
   * }
   */

  /**
   * @summary dataset for editing
   * @typedef {ccm.types.dataset} ccm.components.eval.types.editset
   * @property {ccm.types.key} key - dataset key
   * @property {string} html - result of .html()
   * @property {string} text - result of .text()
   * @property {*} result - interpreted result (only set in dataset via onFinish callback)
   * @example {
   *   key:  'demo',
   *   html: "{<br>&nbsp;&nbsp;foo: 'bar',<br>&nbsp;&nbsp;baz: function () { alert('Hello, World!'); }<br>}"
   *   text: "{ foo: 'bar',  baz: function () { alert('Hello, World!'); }}"
   * }
   */

  /**
   * @callback ccm.components.eval.types.onFinish
   * @summary callback for button click event
   * @param {ccm.components.eval.types.dataset} result - interpreted result
   * @param {ccm.components.eval.types.dataset} dataset - resulting dataset for editing
   * @example function ( result, dataset ) { console.log( result, dataset ); }
   */

  /**
   * @external ccm.types
   * @see {@link http://akless.github.io/ccm-developer/api/ccm/ccm.types.html}
   */

} );