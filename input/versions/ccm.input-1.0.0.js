/**
 * @overview <i>ccm</i> component for user inputs
 * @author André Kless <andre.kless@web.de> 2015-2017
 * @license The MIT License (MIT)
 * @version 1.0.0
 */

( function () {

  var filename = 'ccm.input-1.0.0.min.js';

  var ccm_version = '9.2.0';
  var ccm_url     = 'https://akless.github.io/ccm/version/ccm-9.2.0.min.js';

  var component_name = 'input';
  var component_obj  = {

    name: component_name,
    version: [ 1, 0, 0 ],

    config: {

      html: {
        main: {
          id: 'main',
          inner: {
            tag: 'form',
            onsubmit: '%submit%',
            inner: [
              { id: 'inputs' },
              {
                tag: 'input',
                type: 'submit',
                class: 'button',
                value: '%caption%'
              }
            ]
          }
        },
        entry: {
          class: 'entry',
          inner: [
            {
              class: 'label',
              inner: {
                tag: 'label',
                for: '%name%',
                inner: '%label%'
              }
            },
            { class: 'input' }
          ]
        },
        checkbox: {
          tag: 'label',
          class: 'checkbox',
          inner: [
            { class: 'field' },
            {
              class: 'caption',
              inner: '%%'
            }
          ]
        },
        checkboxes: { class: 'checkboxes' },
        radios: { class: 'radios' },
        radio: {
          tag: 'label',
          class: 'radio',
          inner: [
            { class: 'field' },
            {
              class: 'caption',
              inner: '%%'
            }
          ]
        },
        range: {
          tag: 'label',
          class: 'range',
          inner: [
            { class: 'field' },
            {
              class: 'value',
              inner: '%%'
            }
          ]
        }
      },
      css: [ 'ccm.load', 'https://akless.github.io/ccm-components/input/resources/default.css' ],
      inputs: []

  //  form: true,
  //  button: true,
  //  initial_data: {},
  //  user: [ 'ccm.instance', 'https://akless.github.io/ccm-components/user/versions/ccm.user-1.0.0.min.js' ],
  //  logger: [ 'ccm.instance', 'https://akless.github.io/ccm-components/log/ccm.log.js', [ 'ccm.get', 'https://akless.github.io/ccm-components/log/resources/log_configs.min.js', 'greedy' ] ],
  //  oninput: function ( instance, data ) { console.log( data ); },
  //  onchange: function ( instance, results, name ) { console.log( name, results ); },
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

        // prepare main HTML structure
        var main_elem = self.ccm.helper.html( my.html.main, {
          caption: my.button,
          submit: onSubmit
        } );

        var   form_elem = main_elem.querySelector( 'form'    );  // container for the HTML form
        var inputs_elem = main_elem.querySelector( '#inputs' );  // container for the input fields

        // prepare form container
        if ( !my.form )
          form_elem.parentNode.replaceChild( inputs_elem, form_elem );
        else if ( !my.button )
          form_elem.removeChild( form_elem.querySelector( '.button' ) );
        else if ( my.button === true )
          form_elem.querySelector( 'input[type=submit]' ).removeAttribute( 'value' );

        // add input fields
        if ( Array.isArray( my.inputs ) )
          my.inputs.map( addInput );
        else
          addInput( my.inputs );

        // set content for own website area
        self.ccm.helper.setContent( self.element, main_elem );

        if ( callback ) callback();

        /**
         * adds a input field entry to the main HTML structure
         * @param {ccm.components.input.types.entry|ccm.types.html} input_data - needed data for generating the input field HTML
         */
        function addInput( input_data ) {

          // restore existing value for the input field
          setInputValue();

          // prepare container for input field entry
          var entry_elem = self.ccm.helper.html( my.html.entry, {
            name: input_data.name || '',
            label: input_data.label || input_data.name
          } );
          var input_elem = entry_elem.querySelector( '.input' );
          input_elem.appendChild( generateInputElement() );

          // add prepared input field entry to main HTML structure
          inputs_elem.appendChild( entry_elem );

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

          /**
           * generates the content of the input field container
           * @returns {Element}
           */
          function generateInputElement() {

            var type = input_data.input;
            delete input_data.label;
            delete input_data.input;

            // choose correct HTML tag
            switch ( type ) {
              case 'select':
              case 'textarea':
                input_data.tag = type;
                break;
              default:
                input_data.tag = 'input';
                input_data.type = type;
            }

            // set change event
            if ( self.onchange )
              if ( input_data.values )
                input_data.values.map( function ( value ) {
                  value.onchange = function ( event ) {
                    self.onchange( self, self.ccm.helper.convertObjectKeys( self.ccm.helper.formData( form_elem ) ), event.__target.getAttribute( 'name' ) );
                  };
                } );
              else
                input_data.onchange = function () {
                  self.onchange( self, self.ccm.helper.convertObjectKeys( self.ccm.helper.formData( form_elem ) ), input_data.name );
                };

            // generate content of input field container
            switch ( type ) {
              case 'checkbox': return checkbox();
              case 'radio':    return radio();
              case 'range':    return range();
              case 'select':   select();   break;
              case 'textarea': textarea(); break;
            }
            return self.ccm.helper.html( input_data );

            function checkbox() {

              return input_data.values ? manyCheckboxes() : singleCheckbox();

              function singleCheckbox() {

                var checkbox_elem = self.ccm.helper.html( my.html.checkbox, input_data.caption );
                if ( !input_data.caption ) checkbox_elem.removeChild( checkbox_elem.querySelector( '.caption' ) );
                delete input_data.caption;
                checkbox_elem.querySelector( '.field' ).appendChild( self.ccm.helper.html( input_data ) );
                return checkbox_elem;

              }

              function manyCheckboxes() {

                var checkboxes_elem = self.ccm.helper.html( my.html.checkboxes );

                input_data.values.map( function ( checkbox_data ) {

                  checkbox_data.tag   = input_data.tag;
                  checkbox_data.type  = input_data.type;
                  checkbox_data.name  = ( input_data.name ? input_data.name + '.' : '' ) + checkbox_data.name;
                  checkbox_data.id    = checkbox_data.name;

                  var checkbox_elem = self.ccm.helper.html( my.html.checkbox, checkbox_data.caption || checkbox_data.value );
                  delete checkbox_data.caption;
                  checkbox_elem.querySelector( '.field' ).appendChild( self.ccm.helper.html( checkbox_data ) );
                  checkboxes_elem.appendChild( checkbox_elem );

                } );

                return checkboxes_elem;

              }

            }

            function radio() {

              var radios_elem = self.ccm.helper.html( my.html.radios );

              input_data.values.map( function ( radio_data, i ) {

                radio_data.tag   = input_data.tag;
                radio_data.type  = input_data.type;
                radio_data.name  = input_data.name;
                radio_data.id    = input_data.id + '-' + ( 1 + i );

                var radio_elem = self.ccm.helper.html( my.html.radio, radio_data.caption || radio_data.value );
                delete radio_data.caption;
                radio_elem.querySelector( '.field' ).appendChild( self.ccm.helper.html( radio_data ) );
                radios_elem.appendChild( radio_elem );

              } );

              return radios_elem;

            }

            function range() {

              input_data.oninput = function ( event ) { input_elem.querySelector( '.value' ).innerHTML = event.__target.value };

              var range_elem = self.ccm.helper.html( my.html.range, input_data.value || input_data.min || 0 );
              range_elem.querySelector( '.field' ).appendChild( self.ccm.helper.html( input_data ) );
              return range_elem;

            }

            function select() {

              input_data.options.map( function ( option ) {
                option.tag = 'option';
                option.inner = option.caption || option.value;
                delete option.caption;
              } );

              input_data.inner = input_data.options;
              delete input_data.options;

            }

            function textarea() {

              if ( input_data.value && !input_data.inner ) {
                input_data.inner = input_data.value;
                delete input_data.value;
              }

            }

          }

        }

        /** submit callback of the HTML form */
        function onSubmit( event ) {

          // prevent page reload
          if ( event ) event.preventDefault();

          /**
           * resulting data of the HTML form
           * @type {object}
           */
          var results = self.ccm.helper.convertObjectKeys( self.ccm.helper.formData( form_elem ) );

          // provide result data
          self.ccm.helper.onFinish( self, results );

        }

      };

    }

  };

  if ( window.ccm && window.ccm.files ) window.ccm.files[ filename ] = component_obj;
  var namespace = window.ccm && ccm.components[ component_name ]; if ( namespace ) { if ( namespace.ccm_version ) ccm_version = namespace.ccm_version; if ( namespace.ccm_url ) ccm_url = namespace.ccm_url; }
  if ( !window.ccm || !ccm[ ccm_version ] ) { var tag = document.createElement( 'script' ); document.head.appendChild( tag ); tag.onload = register; tag.src = ccm_url; } else register( true );
  function register( synchron ) { ccm[ ccm_version ].component( component_obj ); if ( !synchron ) delete window.ccm.files[ filename ]; }
}() );