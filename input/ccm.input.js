/**
 * @overview <i>ccm</i> component for user inputs
 * @author André Kless <andre.kless@web.de> 2015-2016
 * @license The MIT License (MIT)
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

    data: {
      store: [ ccm.store, '../input/datastore.json' ],
      key:   'demo'
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
     * @type {ccm.components.input.types.config}
     * @private
     */
    var my;

    /*------------------------------------------- public instance methods --------------------------------------------*/

    /**
     * @summary when <i>ccm</i> instance is ready
     * @description
     * Called one-time when this <i>ccm</i> instance and dependent <i>ccm</i> components, instances and datastores are initialized and ready.
     * This method will be removed by <i>ccm</i> after the one-time call.
     * @param {function} callback - callback when this instance is ready
     * @ignore
     */
    this.ready = function ( callback ) {

      // privatize security relevant config members
      my = ccm.helper.privatize( self, 'data', 'edit', 'bigdata', 'form', 'fieldset', 'onFinish' );

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

      // has user instance? => login user
      if ( self.user ) self.user.login( proceed ); else proceed();

      function proceed() {

        // get dataset for rendering
        ccm.helper.dataset( my.data, function ( dataset ) {

          /**
           * given key for edited dataset
           * @type {string}
           */
          var key = hasEditstore() && my.edit.key;

          // editable dataset without key? => generate key
          if ( hasEditstore() && !my.edit.key ) my.edit.key = ccm.helper.generateKey();

          // make editable dataset user-specific
          if ( self.user && hasEditstore() ) my.edit.key = [ my.edit.key, self.user.data().key ];

          // get dataset for editing
          ccm.helper.dataset( my.edit, function ( editset ) {

            // restore original key of editable dataset
            if ( self.user && hasEditstore() ) my.edit.key = editset.key = editset.key[ 0 ];

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
            $element.html( ccm.helper.html( html, submit ) );

            // log render event
            if ( my.bigdata ) my.bigdata.log( 'render', {
              data: ccm.helper.dataSource( my.data ),
              edit: ccm.helper.dataSource( my.edit )
            } );

            // perform callback
            if ( callback ) callback();

            /**
             * generate ccm HTML data for HTML inputs
             */
            function generateInputs() {

              if ( dataset.inputs )
                if ( Array.isArray( dataset.inputs ) )
                  dataset.inputs.map( addInput );
                else
                  addInput( dataset.inputs );

              /**
               * add HTML input field
               * @param {ccm.components.input.types.entry} input
               */
              function addInput( input ) {

                // integrate value from given data
                if ( editset ) integrate( ccm.helper.value( editset, input.name ) );

                /**
                 * label of the input field entry
                 * @type {string}
                 */
                var label = input.label || input.name;
                delete input.label;

                // guarantee valid dataset keys
                if ( input.name === 'key' ) {
                  input.input = 'text';
                  input.pattern = ccm.helper.regex( 'key' ).toString().slice( 1, -1 );
                  if ( editset ) input.value = editset.key;
                  input.required = true;
                }

                // prepare ccm HTML data for input field entry
                switch ( input.input ) {
                  case 'select':
                  case 'textarea':
                    input.tag = input.input;
                    if ( input.value && !input.inner ) { input.inner = input.value; delete input.value; }
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
                            "tag": "br"
                          }                        ]
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
                        if ( input.values[ i ].value === value || input.values[ i ].caption === value )
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

              if ( my.fieldset ) {
                html = { tag: 'fieldset', inner: html };
                if ( typeof my.fieldset === 'string' )
                  html.inner.unshift( { tag: 'legend', inner: my.fieldset } );
              }

            }

            /**
             * generate ccm HTML data for HTML form
             */
            function generateForm() {

              if ( my.form ) {
                html = { tag: 'form', onsubmit: '%%', inner: html };
                var button = { tag: 'input', type: 'submit', value: my.form };
                if ( button.value === true ) delete button.value;
                if ( my.fieldset )
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

              /**
               * resulting data of HTML form
               * @type {ccm.components.input.types.editset}
               */
              var result = convert( ccm.helper.formData( jQuery( this ) ) );

              // has user instance? => login user
              if ( self.user ) self.user.login( proceed ); else proceed();

              // prevent page reload
              return false;

              function proceed() {

                // editable dataset?
                if ( hasEditstore() ) {
                  // editable dataset key?
                  if ( result.key ) {
                    // key has changed? => delete dataset with old key
                    if ( result.key !== editset.key )
                      my.edit.store.del( self.user ? [ editset.key, self.user.data().key ] : editset.key );
                  }
                  // no key => set dataset key in result
                  result.key = editset.key;
                }

                // log render event
                if ( my.bigdata ) my.bigdata.log( 'finish', {
                  data: ccm.helper.dataSource( my.data ),
                  edit: ccm.helper.dataSource( my.edit ),
                  result: result
                } );

                // make result dataset user-specific
                if ( self.user && hasEditstore() ) result.key = [ result.key, self.user.data().key ];

                // dataset is not editable via datastore? => perform finish callback
                if ( !hasEditstore() || my.edit.no_set ) return performCallback( result );

                // new editable dataset and given permission settings for created dataset? => set permission settings for new dataset
                if ( hasEditstore() && Object.keys( editset ).length === 1 && my.edit.permission ) result._ = my.edit.permission;

                // update dataset for editing in datastore and perform finish callback
                my.edit.store.set( result, performCallback );

                /**
                 * perform given onFinish callback with resulting data of HTML form
                 * @param {ccm.components.input.types.editset} result - resulting data
                 */
                function performCallback( result ) {

                  // restore original key of editable dataset
                  if ( self.user && hasEditstore() ) my.edit.key = editset.key = editset.key[ 0 ];

                  // no given key for edited dataset?
                  if ( hasEditstore() && !key ) {

                    // delete generated key
                    delete my.edit.key;

                    // (re)render own content (generate new key and clear input fields)
                    self.render();

                  }

                  // perform finish callback with result
                  if ( my.onFinish ) my.onFinish( result );

                }

              }

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

            }

          } );

          /**
           * check if dataset is editable via datastore
           * @returns {boolean}
           */
          function hasEditstore() {

            return !!ccm.helper.isObject( my.edit ) && ccm.helper.isDatastore( my.edit.store );

          }

        } );

      }

    };

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
   * @property {ccm.types.dependency} style - CSS for own website area
   * @property {string} classes - HTML classes for own website area
   * @property {ccm.types.dependency} data.store - <i>ccm</i> datastore that contains the [dataset for rendering]{@link ccm.components.input.types.dataset}
   * @property {ccm.types.key} data.key - key of [dataset for rendering]{@link ccm.components.input.types.dataset}
   * @property {ccm.types.dependency} edit.store - <i>ccm</i> datastore that contains the [dataset for editing]{@link ccm.components.input.types.editset}
   * @property {ccm.types.key} edit.key - key of [dataset for editing]{@link ccm.components.input.types.editset}
   * @property {boolean} edit.no_set - true: dataset for editing will not be updated in the <i>ccm</i> datastore after submit (result comes only via callback)
   * @property {ccm.types.dependency} user - <i>ccm</i> instance for user authentication
   * @property {ccm.types.dependency} bigdata - <i>ccm</i> instance for big data
   * @property {boolean|string} form - wrap inputs with a form<br>
   * <br>
   * <code>falsy</code>: no form around inputs<br>
   * <code>true</code>: wrap inputs with a form that has default submit button<br>
   * <code>string</code>: wrap inputs with a form that has submit button with given string as caption
   * @property {boolean|string} fieldset - wrap inputs in a fieldset<br>
   * <br>
   * <code>falsy</code>: no fieldset around inputs<br>
   * <code>true</code>: wrap inputs in a fieldset without a legend<br>
   * <code>string</code>: wrap inputs in a fieldset with given string as legend
   * @property {ccm.components.input.types.onFinish} onFinish - callback for submit event of the HTML form
   * @example {
   *   style:    [ ccm.load,  '../input/layout.css' ],
   *   data:     {
   *     store:  [ ccm.store, '../input/datastore.json' ],
   *     key:    'demo'
   *   },
   *   edit:     {
   *     store:  [ ccm.store, '../input/editstore.json' ],
   *     key:    'demo',
   *     no_set: true
   *   },
   *   bigdata: [ ccm.instance, '../bigdata/ccm.bigdata.js' ],
   *   form:     'Submit',
   *   fieldset: 'Demo Form',
   *   onFinish: function ( result ) { console.log( result ); }
   * }
   */

  /**
   * @summary dataset for rendering
   * @typedef {ccm.types.dataset} ccm.components.input.types.dataset
   * @property {ccm.types.key} key - dataset key
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
   *     }
   *   ]
   * }
   */

  /**
   * @summary input field entry
   * @description Every additional string property will be set as HTML attribute.
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
   * @summary dataset for editing
   * @typedef {ccm.types.dataset} ccm.components.input.types.editset
   * @property {ccm.types.key} key - dataset key
   * @example {
   *   "key": "demo",
   *   "username": "JohnDoe",
   *   "password": "1Aa"
   * }
   */

  /**
   * @callback ccm.components.input.types.onFinish
   * @summary callback for submit event of the HTML form
   * @param {ccm.components.input.types.editset} result - resulting dataset for editing
   * @example function ( result ) { console.log( result ); }
   */

  /**
   * @external ccm.types
   * @see {@link http://akless.github.io/ccm-developer/api/ccm/ccm.types.html}
   */

} );