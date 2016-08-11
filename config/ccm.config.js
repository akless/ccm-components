/**
 * @overview <i>ccm</i> component for generating <i>ccm</i> instance configurations
 * @author André Kless <andre.kless@web.de> 2016
 * @license The MIT License (MIT)
 * @version latest (1.0.0)
 * @changes
 * version 1.0.0 (11.08.2016)
 */

ccm.component( /** @lends ccm.components.config */ {

  /*-------------------------------------------- public component members --------------------------------------------*/

  /**
   * @summary component index
   * @type {ccm.types.index}
   */
  index: 'config',

  /**
   * @summary default instance configuration
   * @type {ccm.components.config.types.config}
   */
  config: {

    store:  [ ccm.store, '../config/datastore.json' ],
    key:    'demo',
    input:  [ ccm.component, '../input/ccm.input.js' ],
    onSubmit: function ( result ) { console.log( result ); }

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
     * @type {ccm.components.config.types.config}
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
      my = ccm.helper.privatize( self, 'store', 'key' );

      // perform callback
      callback();

    };

    /**
     * @summary render content in own website area
     * @param {function} [callback] - callback when content is rendered
     */
    this.render = function ( callback ) {

      // prepare website area for own content
      ccm.helper.element( self );

      // get dataset for rendering
      ccm.helper.dataset( my, function ( dataset ) {

        // add support for new input types
        dataset.inputs.map( function ( entry ) {
          switch ( entry.input ) {
            case 'ccm.load':
            case 'ccm.component':
            case 'ccm.instance':
            case 'ccm.proxy':
            case 'ccm.dataset':
            case 'ccm.store':
            case 'function':
              entry.ccm = entry.input;
              entry.input = 'textarea';
              break;
            case 'ccm.key':
              entry.ccm = entry.input;
              entry.input = 'text';
              entry.pattern = ccm.helper.regex( 'key' ).toString().slice( 1, -1 );
              break;
          }
        } );

        // prepare initial data for datastore of the input component
        var datastore = {};
        datastore[ my.key ] = dataset;

        // embed input component
        self.input.render( {
          element: jQuery( '#ccm-' + self.index ),
          store: [ ccm.store, { local: datastore } ],
          key: my.key,
          data: self.data,
          onSubmit: function ( result ) {

            // validate resulting input values
            var valid = true;
            dataset.inputs.map( function ( entry ) {
              if ( !result[ entry.name ] && !entry.required ) return;
              if ( entry.ccm ) {
                switch ( entry.ccm ) {
                  case 'ccm.load':
                  case 'ccm.component':
                  case 'ccm.instance':
                  case 'ccm.proxy':
                  case 'ccm.dataset':
                  case 'ccm.store':
                    try { result[ entry.name ] = JSON.parse( result[ entry.name ] ); } catch ( err ) { return notValid( entry.label ); }
                    if ( !ccm.helper.isDependency( result[ entry.name ] ) ) return notValid( entry.label );
                    break;
                  case 'ccm.key':
                    if ( !ccm.helper.val( result[ entry.name ], 'key' ) ) return notValid( entry.label );
                    break;
                  case 'function':
                    try { result[ entry.name ] = eval( '(' + result[ entry.name ] + ')' ); } catch ( err ) { return notValid( entry.label ); }
                    if ( typeof result[ entry.name ] !== 'function' ) return notValid( entry.label );
                    break;
                }
                delete entry.ccm;
              }
            } );

            // all values are valid? => perform own onSubmit callback
            if ( valid && self.onSubmit ) self.onSubmit( result );

            /**
             * called when a input value is not valid
             * @param {string} label - label of input entry
             */
            function notValid( label ) {
              valid = false;
              alert( 'value of entry "' + label + '" is not valid' );
            }

          }
        } );

        // perform callback
        if ( callback ) callback();

      } );

    }

  }

  /*------------------------------------------------ type definitions ------------------------------------------------*/

  /**
   * @namespace ccm.components.config
   */

  /**
   * @namespace ccm.components.config.types
   */

  /**
   * @summary <i>ccm</i> instance configuration
   * @typedef {ccm.config} ccm.components.config.config
   * @property {ccm.types.element} element - <i>ccm</i> instance website area
   * @property {ccm.types.dependency} style - CSS for own website area
   * @property {string} classes - HTML classes for own website area
   * @property {ccm.types.dependency} store - <i>ccm</i> datastore that contains the [dataset for rendering]{@link ccm.components.config.types.dataset}
   * @property {ccm.types.key} key - key of [dataset for rendering]{@link ccm.components.config.types.dataset}
   * @property {ccm.types.dependency} input - <i>ccm</i> component for user inputs
   * @property {object} data - default values for input fields
   * @property {ccm.components.config.types.onSubmit} onSubmit - callback for submit event of the HTML form
   * @example {
   *   element:  jQuery( 'body' ),
   *   style:    [ ccm.load, '../input/layout.css' ],
   *   classes:  'ccm-input',
   *   store:    [ ccm.store, '../input/datastore.json' ],
   *   key:      'demo',
   *   data:     { store: '["ccm.store", "../quizz/datastore.json"]', key: 'demo' },
   *   onSubmit: function ( result ) { console.log( result ); }
   * }
   */

  /**
   * @summary dataset for rendering
   * @typedef {ccm.types.dataset} ccm.components.config.types.dataset
   * @property {ccm.types.key} key - dataset key
   * @property {boolean|string} form - wrap inputs with a form<br>
   * <br>
   * <code>falsy</code>: no form around inputs,<br>
   * <code>true</code>: wrap inputs with a form that has default submit button<br>
   * <code>string</code>: wrap inputs with a form that has submit button with given string as caption
   * @property {boolean|string} fieldset - wrap inputs in a fieldset<br>
   * <br>
   * <code>falsy</code>: no fieldset around inputs<br>
   * <code>true</code>: wrap inputs in a fieldset without a legend<br>
   * <code>string</code>: wrap inputs in a fieldset with given string as legend
   * @property {ccm.components.config.types.entry|ccm.components.config.types.entry[]} inputs - collection of input field entries
   * @example {
   *   "key": "demo",
   *   "form": "Submit",
   *   "fieldset": "Config Form",
   *   "inputs": [
   *     {
   *       "label": "Datastore",
   *       "name": "store",
   *       "input": "ccm.store",
   *       "value": "[\"ccm.store\", \"../quizz/datastore.json\"]",
   *       "required": true
   *     },
   *     {
   *       "label": "Dataset Key",
   *       "name": "key",
   *       "input": "ccm.key",
   *       "value": "demo",
   *       "required": true
   *     }
   *   ]
   * }
   */

  /**
   * @summary input field entry
   * @description Every additional string property will be set as HTML attribute.
   * @typedef {object} ccm.components.config.types.entry
   * @property {string} label - label of input field entry
   * @property {string} name -  value for HTML input attribute 'name'
   * @property {string} input - type of input field: text, password, radio, checkbox, select, textarea, number, date, color, range, month, week, time, datetime, datetime-local, email, search, tel or url
   * @example {
   *   "label": "Username",
   *   "name": "username",
   *   "input": "text",
   *   "placeholder": "JohnDoe"
   * }
   * @example {
   *   "label": "Password",
   *   "name": "password",
   *   "input": "password",
   *   "pattern": "(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{3,}",
   *   "title": "At least three characters with at least one digit, one capital letter and one lower case letter.",
   *   "maxlength": "5",
   *   "size": "3",
   *   "required": true
   * }
   * @example {
   *   "label": "I'am...",
   *   "name": "destination",
   *   "input": "radio",
   *   "values": [
   *     { "value": "here", "caption": "here" },
   *     { "value": "there", "caption": "there", "checked": true },
   *     { "value": "disabled", "caption": "somewhere", "disabled": true, "title": "disabled" }
   *   ]
   * }
   * @example {
   *   "label": "Available?",
   *   "name": "available",
   *   "input": "checkbox",
   *   "values": [
   *     { "name": "private_life", "caption": "Private Live", "checked": true },
   *     { "name": "working_life", "caption": "Working Life", "checked": true },
   *     { "name": "free", "value": "free_time", "caption": "Free Time" }
   *   ]
   * }
   * @example {
   *   "label": "Role",
   *   "name": "role",
   *   "input": "select",
   *   "options": [
   *     {
   *       "value": "thinker",
   *       "caption": "Thinker"
   *     },
   *     {
   *       "value": "investigator",
   *       "caption": "Investigator"
   *     },
   *     {
   *       "value": "coordinator",
   *       "caption": "Coordinator"
   *     },
   *     {
   *       "value": "shaper",
   *       "caption": "Shaper"
   *     },
   *     {
   *       "value": "evaluator",
   *       "caption": "Evaluator"
   *     },
   *     {
   *       "value": "teamworker",
   *       "caption": "Teamarbeiter"
   *     },
   *     {
   *       "value": "implementer",
   *       "caption": "Implementer"
   *     },
   *     {
   *       "value": "completer",
   *       "caption": "Completer"
   *     },
   *     {
   *       "value": "specialist",
   *       "caption": "Specialist",
   *       "selected": true
   *     }
   *   ]
   * }
   * @example {
   *   "label": "Layout",
   *   "name": "style",
   *   "input": "ccm.load",
   *   "value": "[\"ccm.load\", \"../quizz/layout.css\"]"
   * }
   * @example {
   *   "label": "Datastore",
   *   "name": "store",
   *   "input": "ccm.store",
   *   "value": "[\"ccm.store\", \"../quizz/datastore.json\"]",
   *   "required": true
   * }
   * @example {
   *   "label": "Dataset Key",
   *   "name": "key",
   *   "input": "ccm.key",
   *   "value": "demo",
   *   "required": true
   * }
   * @example {
   *   "label": "Instance: Multilingualism",
   *   "name": "lang",
   *   "input": "ccm.instance"
   * }
   * @example {
   *   "label": "Callback: onFinish",
   *   "name": "onFinish",
   *   "input": "function",
   *   "value": "function (result) { result.quizz.render(); }"
   * }
   */

  /**
   * @callback ccm.components.config.types.onSubmit
   * @summary callback for submit event of the HTML form
   * @param {object} result - resulting data of the HTML form
   * @example function ( result ) { console.log( result ); }
   */

  /**
   * @external ccm.types
   * @see {@link http://akless.github.io/ccm-developer/api/ccm/ccm.types.html}
   */

} );