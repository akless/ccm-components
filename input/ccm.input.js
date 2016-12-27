/**
 * @overview <i>ccm</i> component for user inputs
 * @author André Kless <andre.kless@web.de> 2015-2016
 * @license The MIT License (MIT)
 */

ccm.component( {
  index: 'input',
  config: {
    data: {
      store: [ ccm.store, '../input/datastore.json' ],
      key:   'demo'
    },
    edit: {
      store: [ ccm.store, '../input/editstore.json' ],
      key:   'demo'
    },
    helper: [ ccm.load, '../../ccm-developer-no-jquery/ccm/ccm-helper.js' ]
  },
  Instance: function () {
    var self = this;

    var my;  // contains privatized instance members

    self.ready = function ( callback ) {

      // privatize security relevant instance members
      my = ccm.helper.privatize( self );

      callback();
    };

    this.render = function ( callback ) {

      // prepare own website area
      ccm.helper.element( self );

      // has user instance? => login user
      if ( self.user ) self.user.login( proceed ); else proceed();

      function proceed() {

        // get dataset for rendering
        ccm.helper.dataset( my.data, function ( dataset ) {

          /**
           * original given key for edited dataset
           * @type {string}
           */
          var key = isEditable() && my.edit.key;

          // editable dataset without key? => generate key
          if ( isEditable() && !my.edit.key ) my.edit.key = ccm.helper.generateKey();

          // has user instance and editable dataset? => make edited dataset user-specific
          if ( self.user && isEditable() ) my.edit.key = [ my.edit.key, self.user.data().key ];

          // get dataset for editing
          ccm.helper.dataset( my.edit, function ( editset ) {

            // has user instance and editable dataset? => restore original key of edited dataset
            if ( self.user && isEditable() ) my.edit.key = editset.key = editset.key[ 0 ];

            /**
             * ccm HTML data for own website area
             * @type {ccm.types.html}
             */
            var html = { class: 'inputs', inner: [] };

            // add ccm HTML data for form, fieldset and inputs
            generateInputs();
            generateFieldset();
            generateForm();

            // clear own website area (removes loading icon)
            self.element.innerHTML = '';

            // set content for own website area
            self.element.appendChild( ccm.helper.html( html, submit ) );

            // has bigdata instance? => log render event
            if ( my.bigdata ) my.bigdata.log( 'render', {
              data: ccm.helper.dataSource( my.data ),
              edit: ccm.helper.dataSource( my.edit )
            } );

            if ( callback ) callback();

            /** generates the ccm HTML data for the HTML inputs */
            function generateInputs() {

              if ( !dataset.inputs ) return;
              if ( Array.isArray( dataset.inputs ) )
                dataset.inputs.map( addInput );
              else
                addInput( dataset.inputs );

              /**
               * adds a HTML input entry to the ccm HTML data for the own website area
               * @param {ccm.components.input.types.entry|ccm.types.html} input - needed data for generating the HTML input entry
               */
              function addInput( input ) {

                // set value for HTML input
                setInputValue();

                // set HTML ID for HTML input
                input.id = 'ccm-' + self.index + '-' + input.name;

                /**
                 * label of the HTML input
                 * @type {ccm.types.html}
                 */
                var label = labelTag( input.label || input.name );

                // convert data to ccm HTML data
                convertData();

                // generate HTML input entry and add it to ccm HTML data for own website area
                html.inner.push( { class: 'entry', inner: [ { class: 'label', inner: label }, { class: 'input', inner: input } ] } );

                /** integrates the value for the HTML input in the needed data for generating the HTML input entry */
                function setInputValue() {
                  if ( !editset ) return;
                  var value = ccm.helper.deepValue( editset, input.name );
                  if ( value === undefined ) return;
                  switch ( input.input ) {
                    case 'radio':
                    case 'checkbox':
                      delete input.checked;
                      input.values.map( function ( box ) {
                        delete box.checked;
                        if ( box.value || box.caption === value )
                          box.checked = true;
                      } );
                      break;
                    case 'select':
                      input.options.map( function ( option ) {
                        delete option.selected;
                        if ( option.value === value )
                          option.selected = true;
                      } );
                      break;
                    case 'textarea':
                      input.inner = value;
                      break;
                    default:
                      input.value = value;
                  }
                }

                /** converts the data for generating the HTML input entry to the ccm HTML data for the HTML input */
                function convertData() {
                  delete input.label;
                  if ( input.name === 'key' ) key();  // special case of editable dataset key
                  switch ( input.input ) {
                    case 'select':
                    case 'textarea':
                      input.tag = input.input;
                      break;
                    default:
                      input.tag = 'input';
                      input.type = input.input;
                  }
                  switch ( input.input ) {
                    case 'checkbox': checkbox(); break;
                    case 'radio':    radio();    break;
                    case 'range':    range();    break;
                    case 'select':   select();   break;
                    case 'textarea': textarea(); break;
                  }
                  delete input.input;

                  function checkbox() {

                    if ( !input.values ) single(); else many();

                    function single() {
                      input = labelTag( [ input, { tag: 'span', inner: input.caption } ] );
                      delete input.inner[ 0 ].caption;
                    }

                    function many() {
                      input.values.map( function ( checkbox, i, values ) {
                        checkbox.tag = input.tag;
                        checkbox.type = input.type;
                        checkbox.value = checkbox.value || checkbox.name;
                        checkbox.id = 'ccm-' + self.index + '-' + checkbox.name;
                        values[ i ] = labelTag( [ checkbox, { tag: 'span', inner: checkbox.caption || checkbox.value } ] );
                        delete checkbox.caption;
                      } );
                      input = input.values;
                    }

                  }

                  function radio() {
                    input.values.map( function ( radio, i, values ) {
                      radio.tag = input.tag;
                      radio.type = input.type;
                      radio.name = input.name;
                      radio.id = input.id + '-' + (1+i);
                      values[ i ] = labelTag( [ radio, { tag: 'span', inner: radio.caption || radio.value } ] );
                      delete radio.caption;
                    } );
                    input = input.values;
                  }

                  function range() {
                    input.oninput = function () { this.nextElementSibling.innerHTML = this.getAttribute( 'value' ) };
                    input = labelTag( [ input, { tag: 'span', inner: input.value || input.min || 0 } ] );
                  }

                  function select() {
                    input.options.map( function ( option ) {
                      option.tag = 'option';
                      option.inner = option.caption || option.value;
                      delete option.caption;
                    } );
                    input.inner = input.options;
                    delete input.options;
                  }

                  function textarea() {
                    if ( input.value && !input.inner ) { input.inner = input.value; delete input.value; }
                  }

                  function key() {
                    input.input = 'text';
                    input.pattern = ccm.helper.regex( 'key' ).toString().slice( 1, -1 );
                    input.required = true;
                  }

                }

                /**
                 * @param {string|ccm.types.html} inner - inner HTML for the HTML label tag
                 * @returns {ccm.types.html} HTML label tag
                 */
                function labelTag( inner ) {
                  var label = { tag: 'label', for: input.id, inner: inner };
                  //if ( my.form ) label.form = 'ccm-' + self.index;
                  return label;
                }

              }

            }

            /** generates ccm HTML data for HTML fieldset */
            function generateFieldset() {
              if ( !my.fieldset ) return;
              html = { tag: 'fieldset', inner: html };
              if ( typeof my.fieldset === 'string' || typeof my.fieldset === 'number' )
                html.inner = [ { tag: 'legend', inner: my.fieldset }, html.inner ];
            }

            /** generates ccm HTML data for HTML form */
            function generateForm() {
              if ( !my.form ) return;
              html = { tag: 'form', id: 'ccm-' + self.index, onsubmit: '%%', inner: html };
              var button = { tag: 'input', type: 'submit', value: my.form };
              if ( button.value === true ) delete button.value;
              if ( my.fieldset )
                html.inner.inner = [ html.inner.inner, button ];
              else
                html.inner = [ html.inner, button ];
            }

            /** submit callback of the HTML form */
            function submit( event ) {

              // prevent page reload
              event.preventDefault();

              /**
               * resulting data of the HTML form
               * @type {ccm.components.input.types.editset}
               */
              var result = ccm.helper.cleanObject( ccm.helper.convertObjectKeys( ccm.helper.formData( this ) ) );

              // has user instance? => login user
              if ( self.user ) self.user.login( proceed ); else proceed();

              function proceed() {

                // manage edited dataset key
                if ( isEditable() ) {                                 // edited dataset is editable via ccm datastore?
                  if ( result.key ) {                                   // editable dataset key?
                    if ( result.key !== editset.key && !my.edit.no_set )  // dataset key has changed?
                      my.edit.store.del( self.user ? [ editset.key, self.user.data().key ] : editset.key );  // delete dataset with old key
                  }
                  else result.key = editset.key;  // no editable dataset key => set dataset key in resulting data
                }

                // has bigdata instance? => log finish event
                if ( my.bigdata ) my.bigdata.log( 'finish', result );

                // has user instance and edited dataset is editable via datastore? => make resulting data user-specific
                if ( self.user && isEditable() ) result.key = [ result.key, self.user.data().key ];

                // edited dataset must not updated in ccm datastore? => abort and perform finish callback with resulting data
                if ( !isEditable() || my.edit.no_set ) return performCallback( result );

                // is created (not updated) dataset and has permission settings? => set permission settings for created dataset
                if ( Object.keys( editset ).length === 1 && my.edit.permission ) result._ = my.edit.permission;

                // update edited dataset in ccm datastore and perform finish callback with updated edited dataset
                my.edit.store.set( result, performCallback );

                /**
                 * performs the given finish callback with the resulting data of the HTML form
                 * @param {ccm.components.input.types.editset} result - resulting data
                 */
                function performCallback( result ) {

                  // has user instance and edited dataset is editable via datastore? => restore original (not user-specific) dataset key
                  if ( self.user && isEditable() ) my.edit.key = editset.key = editset.key[ 0 ];

                  // given ccm datastore but no given dataset key for edited dataset?
                  if ( isEditable() && !key ) {

                    // delete generated key (=> creates a new dataset on each submit)
                    delete my.edit.key;

                    // (re)render own content (=> generates new key and clear input fields)
                    self.render();

                  }

                  // perform finish callback with resulting data
                  if ( self.onFinish ) self.onFinish( result );

                }

              }

            }

          } );

          /**
           * checks if edited dataset is editable via ccm datastore
           * @returns {boolean}
           */
          function isEditable() {

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
   * @summary input field entry (needed data for generating the HTML input field)
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