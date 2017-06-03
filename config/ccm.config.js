/**
 * @overview ccm component for generating ccm instance configurations
 * @author André Kless <andre.kless@web.de> 2016-2017
 * @license The MIT License (MIT)
 */

( function () {

  var ccm_version = '8.0.0';
  var ccm_url     = '../../ccm-developer/ccm/ccm.js';

  var component_name = 'config';
  var component_obj  = {

    name: component_name,

    config: {

      input_mask: [ 'ccm.component', '../input/ccm.input.js' ],

      inputs: [
        {
          label: 'Eingabe',
          name: 'text',
          input: 'text'
        },
        {
          label: 'Datenspeicher',
          name: 'store',
          input: 'ccm.store'
        }
      ]

  //  initial_data: {},
  //  oninput: function ( instance, data ) { console.log( data ); },
  //  onchange: function ( instance, data ) { console.log( data ); },
  //  onfinish: function ( instance, results ) { console.log( results ); }

    },

    Instance: function () {

      var self = this;
      var my;           // contains privatized instance members

      this.ready = function ( callback ) {

        // privatize all possible instance members
        my = self.ccm.helper.privatize( self );

        callback();
      };

      this.start = function ( callback ) {

        // add support for new input types
        convert( function () {

          // embed input component
          my.input.render( {
            parent: self,
            element: jQuery( '#ccm-' + self.index ),
            data: my.data,
            edit: my.edit,
            fieldset: my.fieldset,
            form: my.form,
            onfinish: function ( result ) {

              // log render event
              if ( my.bigdata ) my.bigdata.log( 'finish', {
                data: ccm.helper.dataSource( my.data ),
                edit: ccm.helper.dataSource( my.edit ),
                result: result
              } );

              // all values are valid? => perform own finish callback
              if ( validate() && my.onfinish ) my.onfinish( result );

              /**
               * validate resulting input values
               */
              function validate() {

                var valid = true;
                dataset.inputs.map( function ( entry ) {
                  if ( !entry.required && !ccm.helper.value( result, entry.name ) ) return;
                  if ( entry.ccm ) {
                    switch ( entry.ccm ) {
                      case 'ccm.load':
                      case 'ccm.component':
                      case 'ccm.instance':
                      case 'ccm.proxy':
                      case 'ccm.dataset':
                      case 'ccm.store':
                        try { ccm.helper.value( result, entry.name, JSON.parse( ccm.helper.value( result, entry.name ) ) ); } catch ( err ) {
                          try { ccm.helper.value( result, entry.name, eval( '(' + ccm.helper.value( result, entry.name ) + ')' ) ); } catch ( err ) {
                            return notValid( entry.label );
                          }
                        }
                        if ( !ccm.helper.isDependency( ccm.helper.value( result, entry.name ) ) ) return notValid( entry.label );
                        break;
                      case 'ccm.key':
                        if ( !ccm.helper.val( ccm.helper.value( result, entry.name ), 'key' ) ) return notValid( entry.label );
                        break;
                      case 'function':
                        try { ccm.helper.value( result, entry.name, eval( '(' + ccm.helper.value( result, entry.name ) + ')' ) ); } catch ( err ) { return notValid( entry.label ); }
                        if ( typeof ccm.helper.value( result, entry.name ) !== 'function' ) return notValid( entry.label );
                        break;
                    }
                  }
                } );
                return valid;

                /**
                 * called when a input value is not valid
                 * @param {string} label - label of input entry
                 */
                function notValid( label ) {
                  valid = false;
                  alert( 'value of entry "' + label + '" is not valid' );
                }

              }

            }
          } );

          // log render event
          if ( my.bigdata ) my.bigdata.log( 'render', {
            data: ccm.helper.dataSource( my.data ),
            edit: ccm.helper.dataSource( my.edit )
          } );

          // perform callback
          if ( callback ) callback();

        } );

        /**
         * add support for new input types
         * @param {function} callback
         */
        function convert( callback ) {

          my.inputs.map( function ( entry ) {
            switch ( entry.input ) {
              case 'ccm.store':
                console.log( entry );
                break;
              case 'ccm.load':
              case 'ccm.component':
              case 'ccm.instance':
              case 'ccm.proxy':
              case 'ccm.dataset':
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

            /** set the initial value of the input field (uses initial data for edited dataset) */
            function setInputValue() {

              // on initial data? => abort
              if ( !my.initial_data ) return;

              // determine initial value
              var value;
              if ( input_data.name ) value = self.ccm.helper.deepValue( my.initial_data, input_data.name );
              if ( value === undefined && !input_data.values ) return;

              // set initial value(s) of the input field(s)
              switch ( input_data.input ) {
                case 'radio':
                  input_data.values.map( function ( radio_data ) {
                    delete radio_data.checked;
                    if ( radio_data.value === value )
                      radio_data.checked = true;
                  } );
                  break;
                case 'checkbox':
                  if ( input_data.values )
                    input_data.values.map( function ( checkbox_data ) {
                      if ( self.ccm.helper.deepValue( my.initial_data, ( input_data.name ? input_data.name + '.' : '' ) + checkbox_data.name ) )
                        checkbox_data.checked = true;
                      else
                        delete checkbox_data.checked;
                    } );
                  else if ( value )
                    input_data.checked = true;
                  else
                    delete input_data.checked;
                  break;
                case 'select':
                  input_data.options.map( function ( option_data ) {
                    delete option_data.selected;
                    if ( option_data.value === value )
                      option_data.selected = true;
                  } );
                  break;
                case 'textarea':
                  input_data.inner = value;
                  break;
                default:
                  input_data.value = value;
              }
            }

          } );
          my.data.store.set( dataset, callback );

        }

      }

    }

  };

  var namespace = window.ccm && ccm.components[ component_name ]; if ( namespace ) { if ( namespace.ccm_version ) ccm_version = namespace.ccm_version; if ( namespace.ccm_url ) ccm_url = namespace.ccm_url; }
  if ( !window.ccm || !ccm[ ccm_version ] ) { var tag = document.createElement( 'script' ); document.head.appendChild( tag ); tag.onload = register; tag.src = ccm_url; } else register();
  function register() { ccm[ ccm_version ].component( component_obj ); }
}() );