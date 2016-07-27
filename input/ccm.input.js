/**
 * @overview <i>ccm</i> component for user inputs
 * @author André Kless <andre.kless@web.de> 2015-2016
 * @license The MIT License (MIT)
 * @version latest (1.0.0)
 */

ccm.component( /** @lends ccm.components.input */ {

  /*-------------------------------------------- public component members --------------------------------------------*/

  /**
   * @summary component index
   * @type {ccm.types.index}
   */
  index: 'input',

  /**
   * @summary default instance configuration
   * @type {ccm.components.input.types.config}
   */
  config: {

    style:   [ ccm.load,  '../input/layout.css' ],
    store:   [ ccm.store, '../input/datastore.json' ],
    key:     'demo',
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
     * @type {ccm.components.input.types.config}
     * @private
     */
    var my;

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
      my = ccm.helper.privatize( self, 'store', 'key', 'data', 'onSubmit' );

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

      // get dataset for rendering
      ccm.helper.dataset( my, function ( dataset ) {

        /**
         * ccm HTML data for own website area
         * @type {ccm.types.html}
         */
        var html = [ { class: 'inputs', inner: [] } ];

        // generate ccm HTML data for HTML inputs
        generateInputs();

        // generate ccm HTML data for HTML fieldset
        generateFieldset();

        // generate ccm HTML data for HTML form
        generateForm();

        // set content of own website area
        element.html( ccm.helper.html( html, submit ) );

        // perform callback
        if ( callback ) callback();

        /**
         * generate ccm HTML data for HTML inputs
         */
        function generateInputs() {

          if ( dataset.inputs )
            if ( Array.isArray( dataset.inputs ) )
              for ( var i = 0; i < dataset.inputs.length; i++ )
                addInput( dataset.inputs[ i ] );
            else
              addInput( dataset.inputs );

          /**
           * add HTML input field
           * @param {object} input
           */
          function addInput( input ) {

            // integrate value from given data
            if ( my.data ) integrate( getValue( my.data, input.name.split( '.' ) ) );

            /**
             * label of the input field entry
             * @type {string}
             */
            var label = input.label || input.name;
            delete input.label;

            // prepare ccm HTML data for input field entry
            switch ( input.input ) {
              case 'select':
              case 'textarea':
                input.tag = input.input;
                break;
              default:
                input.tag = 'input';
                input.type = input.input;
            }
            if ( input.input === 'radio' ) {
              for ( var i = 0; i < input.values.length; i++ ) {
                input.values[ i ].tag = input.tag;
                input.values[ i ].type = input.type;
                input.values[ i ].name = input.name;
                input.values[ i ] = {
                  tag: 'label',
                  inner: [
                    input.values[ i ],
                    {
                      "tag": "span",
                      "inner": "&nbsp;"
                    },
                    {
                      "tag": "span",
                      "inner": input.values[ i ].caption || input.values[ i ].value
                    },
                    {
                      "tag": "br"
                    }
                  ]
                };
                delete input.values[ i ].inner[ 0 ].caption;
              }
              input = input.values;
            }
            if ( input.input === 'checkbox' ) {
              if ( input.values ) {
                for ( var i = 0; i < input.values.length; i++ ) {
                  input.values[ i ].tag = input.tag;
                  input.values[ i ].type = input.type;
                  input.values[ i ].value = input.values[ i ].value || input.values[ i ].name;
                  input.values[ i ] = {
                    tag: 'label',
                    inner: [
                      input.values[ i ],
                      {
                        "tag": "span",
                        "inner": "&nbsp;"
                      },
                      {
                        "tag": "span",
                        "inner": input.values[ i ].caption || input.values[ i ].value
                      },
                      {
                        "tag": "span",
                        "inner": "&nbsp;&nbsp;&nbsp;"
                      }
                    ]
                  };
                  delete input.values[ i ].inner[ 0 ].caption;
                }
                input = input.values;
              }
              else {
                input.id = self.index + '-' + input.name;
                label = { tag: 'label', for: input.id, inner: label };
                input = [
                  input,
                  {
                    "tag": "span",
                    "inner": "&nbsp;"
                  },
                  {
                    "tag": "span",
                    "inner": input.caption
                  }
                ];
                delete input[ 0 ].caption;
              }
            }
            if ( input.input === 'select' ) {
              input.inner = input.options;
              delete input.options;
              for ( var i = 0; i < input.inner.length; i++ ) {
                input.inner[ i ].tag = 'option';
                input.inner[ i ].inner = input.inner[ i ].caption || input.inner[ i ].value;
                delete input.inner[ i ].caption;
              }
            }
            if ( input.input === 'range' ) {
              input.oninput = function () { jQuery( this ).next().next().text( jQuery( this ).val() ) };
              input = [
                input,
                {
                  tag: 'span',
                  inner: '&nbsp;'
                },
                {
                  tag: 'span',
                  inner: input.value || ( ( parseInt( input.min ) || 0 ) + ( parseInt( input.max ) || 100 ) / 2 )
                }
              ];
            }
            delete input.input;

            // set ccm HTML data for input field entry
            html[ 0 ].inner.push( {
              class: 'entry',
              inner: [
                {
                  class: 'label',
                  inner: label
                },
                {
                  class: 'input',
                  inner: input
                }
              ]
            } );

            /**
             * get deeper property value of given object with a given property path (recursive)
             * @param {object} obj - given object
             * @param {string} path - property path
             * @returns {string} deeper property value
             */
            function getValue( obj, path ) {

              var key = path.shift();
              if ( path.length === 0 )
                return obj[ key ];
              return getValue( obj[ key ], path );  // recursive call

            }

            /**
             * integrate given value in ccm HTML data of the input field
             * @param {string} value
             */
            function integrate( value ) {

              if ( value === undefined )
                return;

              switch ( input.input ) {
                case 'radio':
                case 'checkbox':
                  delete input.checked;
                  for ( var i = 0; i < input.values.length; i++ ) {
                    delete input.values[ i ].checked;
                    if ( input.values[ i ].value || input.values[ i ].caption === value )
                      input.values[ i ].checked = true;
                  }
                  break;
                case 'select':
                  for ( var i = 0; i < input.options.length; i++ ) {
                    delete input.options[ i ].selected;
                    if ( input.options[ i ].value === value )
                      input.options[ i ].selected = true;
                  }
                  break;
                case 'textarea':
                  input.inner = value;
                  break;
                default:
                  input.value = value;
              }

            }

          }

        }

        /**
         * generate ccm HTML data for HTML fieldset
         */
        function generateFieldset() {

          if ( dataset.fieldset ) {
            html = { tag: 'fieldset', inner: html };
            if ( typeof dataset.fieldset === 'string' )
              html.inner.unshift( { tag: 'legend', inner: dataset.fieldset } );
          }

        }

        /**
         * generate ccm HTML data for HTML form
         */
        function generateForm() {

          if ( dataset.form ) {
            html = { tag: 'form', onsubmit: '%%', inner: html };
            var button = { tag: 'input', type: 'submit', value: dataset.form };
            if ( button.value === true ) delete button.value;
            if ( dataset.fieldset )
              html.inner.inner.push( button );
            else
              html.inner.push( button );
          }

        }

        /**
         * submit callback of the HTML form
         * @returns {boolean}
         */
        function submit() {

          // perform given submit callback with resulting data of HTML form
          my.onSubmit( convert( ccm.helper.formData( jQuery( this ) ) ) );

          // prevent page reload
          return false;

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
                insert( obj, keys[ i ].split( '.' ), obj[ keys[ i ] ] );
                delete obj[ keys[ i ] ];
              }
            return obj;

            /**
             * insert value into deeper property (recursive)
             * @param data
             * @param keys
             * @param value
             */
            function insert( data, keys, value ) {

              var key = keys.shift();
              if ( keys.length === 0 )
                data[ key ] = value;
              else {
                if ( data[ key ] === undefined )
                  data[ key ] = {};
                insert( data[ key ], keys, value );  // recursive call
              }

            }

          }

        }

      } );

    }

  }

  /*------------------------------------------------ type definitions ------------------------------------------------*/

  /**
   * @namespace ccm.components.input
   */

  /**
   * @namespace ccm.components.input.types
   */

  /**
   * @summary <i>ccm</i> instance configuration
   * @typedef {ccm.types.config} ccm.components.input.types.config
   * @property {ccm.types.element} element - <i>ccm</i> instance website area
   * @property {ccm.types.dependency} html - <i>ccm</i> datastore for HTML templates
   * @property {ccm.types.dependency} style - CSS for own website area
   * @property {string} classes - HTML classes for own website area
   * @property {ccm.types.dependency} store - <i>ccm</i> datastore that contains the [dataset for rendering]{@link ccm.components.input.types.dataset}
   * @property {ccm.types.key} key - key of [dataset for rendering]{@link ccm.components.input.types.dataset}
   * @property {object} data - default values for input fields
   * @property {ccm.components.input.types.onSubmit} onSubmit - callback for submit event of the HTML form
   * @example {
   *   element:  jQuery( 'body' ),
   *   html:     [ ccm.store, '../input/templates.json' ],
   *   style:    [ ccm.load, '../input/layout.css' ],
   *   classes:  'ccm-input',
   *   store:    [ ccm.store, '../input/datastore.json' ],
   *   key:      'demo',
   *   data:     { username: 'JohnDoe', password: '1Aa' },
   *   onSubmit: function ( result ) { console.log( result ); }
   * }
   */

  /**
   * @summary dataset for rendering
   * @typedef {ccm.types.dataset} ccm.components.input.types.dataset
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
   * @property {ccm.components.input.types.entry|ccm.components.input.types.entry[]} inputs - collection of input field entries
   * @example {
   *   "key": "demo",
   *   "form": "Submit",
   *   "fieldset": "Entry Form",
   *   "inputs": [
   *     {
   *       "label": "Username",
   *       "name": "username",
   *       "input": "text",
   *       "placeholder": "JohnDoe"
   *     },
   *     {
   *       "label": "Password",
   *       "name": "password",
   *       "input": "password",
   *       "pattern": "(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{3,}",
   *       "title": "At least three characters with at least one digit, one capital letter and one lower case letter.",
   *       "maxlength": "5",
   *       "size": "3",
   *       "required": true
   *     },
   *   ]
   * }
   */

  /**
   * @summary input field entry
   * @description Every additional string property will be set as HTML attribute. See the demo dataset in the public datastore.json file to see more examples which addition properties could also be set.
   * @typedef {object} ccm.components.input.types.entry
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
   */

  /**
   * @callback ccm.components.input.types.onSubmit
   * @summary callback for submit event of the HTML form
   * @param {object} result - resulting data of the HTML form
   * @example function ( result ) { console.log( result ); }
   */

  /**
   * @external ccm.types
   * @see {@link http://akless.github.io/ccm-developer/api/ccm/ccm.types.html}
   */

} );