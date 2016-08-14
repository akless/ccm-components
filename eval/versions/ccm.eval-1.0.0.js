/**
 * @overview <i>ccm</i> component for interpret JavaScript expressions
 * @author André Kless <andre.kless@web.de> 2016
 * @license The MIT License (MIT)
 * @version 1.0.0
 * @changes
 * version 1.0.0 (14.08.2016)
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

    style:    [ ccm.load,  '../eval/versions/layout-1.0.0.css' ],
    data: {
      store:  [ ccm.store, '../eval/versions/datastore-1.0.0.json' ],
      key:    'demo'
    },
    fieldset: 'Quizz Config',
    button:   'Submit',
    onFinish: function ( result ) { console.log( result ); }

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
      my = ccm.helper.privatize( self, 'fieldset', 'button', 'data', 'onFinish' );

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
      var element = ccm.helper.element( self );

      // get dataset for editing
      ccm.helper.dataset( my.data, function ( dataset ) {

        /**
         * ccm HTML data for own website area
         * @type {ccm.types.html}
         */
        var html = [ { class: 'value', contenteditable: true, inner: dataset.html }, { tag: 'button', inner: my.button, onclick: '%%' } ];

        // generate ccm HTML data for HTML fieldset
        generateFieldset();

        // set content of own website area
        element.html( ccm.helper.html( html, submit ) );

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

          var $value = ccm.helper.find( self, '.value' );
          dataset.html = $value.html();
          dataset.text = $value.text();
          var result;

          // try to interpret JavaScript expression
          try { result = JSON.parse( dataset.text ); } catch ( err ) {
            try { result = eval( '(' + dataset.text + ')' ); } catch ( err ) {
              alert( 'input is not valid' ); return false;
            }
          }

          // update dataset in datastore
          my.data.store.set( dataset, function ( dataset ) {

            // add result of interpreted JavaScript expression to dataset
            dataset.result = result;

            // perform given submit callback with dataset
            my.onFinish( dataset );

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
   * @property {ccm.types.dependency} data.store - <i>ccm</i> datastore that contains the [dataset for editing]{@link ccm.components.eval.types.dataset}
   * @property {ccm.types.key} data.key - key of [dataset for editing]{@link ccm.components.eval.types.dataset}
   * @property {boolean|string} fieldset - wraps a fieldset<br>
   * <br>
   * <code>falsy</code>: no fieldset<br>
   * <code>true</code>: fieldset without a legend<br>
   * <code>string</code>: fieldset with given string as legend
   * @property {boolean|string} button - button caption (default: no button)
   * @property {ccm.components.eval.types.onFinish} onFinish - callback for button click event
   * @example {
   *   element:  jQuery( 'body' ),
   *   style:    [ ccm.load,  '../eval/layout.css' ],
   *   classes:  'ccm-eval',
   *   data: {
   *     store:  [ ccm.store, '../eval/datastore.json' ],
   *     key:    'quizz'
   *   },
   *   fieldset: 'Quizz Config',
   *   button:   'Submit',
   *   onFinish: function ( result ) { console.log( result ); }
   * }
   */

  /**
   * @summary dataset for editing
   * @typedef {ccm.types.dataset} ccm.components.eval.types.dataset
   * @property {ccm.types.key} key - dataset key
   * @property {string} html - result of .html()
   * @property {string} text - result of .text()
   * @property {*} result - interpreted result (only set in dataset via onFinish callback)
   * @example {
   *   key:    'demo',
   *   html:   "{<br>&nbsp;&nbsp;foo: 'bar',<br>&nbsp;&nbsp;baz: function () { alert('Hello, World!'); }<br>}"
   *   text:   "{  foo: 'bar',  baz: function () { alert('Hello, World!'); }}"
   * }
   */

  /**
   * @callback ccm.components.eval.types.onFinish
   * @summary callback for button click event
   * @param {ccm.components.eval.types.dataset} result - resulting dataset
   * @example function ( dataset ) { console.log( dataset.result ); }
   */

  /**
   * @external ccm.types
   * @see {@link http://akless.github.io/ccm-developer/api/ccm/ccm.types.html}
   */

} );