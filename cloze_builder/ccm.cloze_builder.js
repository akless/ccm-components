/**
 * @overview <i>ccm</i> component for building fill-in-the-blank texts
 * @author André Kless <andre.kless@web.de> 2017
 * @license The MIT License (MIT)
 *
 * Notes
 * - disadvantage of bit operation: possible positions for given letters in a word are 0-31
 */

ccm.component( {

  name: 'cloze_builder',

  config: {

    html_templates: {
      main: {
        id: 'main',
        inner: [
          { id: 'input_mask' },
          { id: 'cloze_preview' }
        ]
      },
      preview: {
        tag: 'fieldset',
        inner: [
          { tag: 'legend' },
          { id: 'preview' }
        ]
      }
    },
    css_layout: [ ccm.load, '../cloze_builder/layouts/default.css' ],
    input_mask: [ ccm.component, '../input/ccm.input.js', {
      css_layout: [ 'ccm.load', '../input/layouts/table.css' ],
      inputs: [
        {
          label: 'Layout',
          name: 'css_layout',
          input: 'select',
          options: [
            {
              value: "['ccm.load','../cloze/layouts/default.css']",
              caption: 'Standard-Layout'
            },
            {
              value: "['ccm.load','../cloze/layouts/lea.css']",
              caption: 'LEA-ähnliches Layout'
            }
          ]
        },
        {
          label: 'Lückentext',
          name: 'text',
          input: 'textarea',
          placeholder: 'Hello, [[(W)o(rl)d]]!'
        },
        {
          label: 'Vorgegebene Schlüsselwörter',
          name: 'keywords',
          input: 'checkbox'
        },
        {
          label: 'Leere Eingabefelder',
          name: 'blank',
          input: 'checkbox'
        },
        {
          label: 'Groß- und Kleinschreibung ignorieren',
          name: 'ignore_case',
          input: 'checkbox'
        },
        {
          label: 'Punkte pro Lückenfeld',
          name: 'points_per_gap',
          input: 'number',
          min: 1
        },
        {
          label: 'Zeitlimit (in Sekunden)',
          name: 'time',
          input: 'number',
          min: 1
        },
        {
          label: 'Beschriftung des Buttons',
          name: 'button_caption',
          input: 'text'
        }
      ]
    } ],
    cloze_preview: [ ccm.component, '../cloze/ccm.cloze.js' ],
    ccm_helper: [ ccm.load, '../../ccm-developer-no-jquery/ccm/ccm-helper.js' ],
    onfinish: function ( instance, results ) { console.log( results ); }

    // initial_data

  },

  Instance: function () {

    var self = this;
    var my;           // contains privatized instance members

    this.ready = function ( callback ) {

      // privatize all possible instance members
      my = ccm.helper.privatize( self );

      // encode ccm dependencies in initial data
      ccm.helper.encodeDependencies( my.initial_data );

      callback();
    };

    this.start = function ( callback ) {

      // prepare main HTML structure
      var main_elem = ccm.helper.html( my.html_templates.main );
      var preview_elem = main_elem.querySelector( '#cloze_preview' );

      // render input mask
      my.input_mask.start( {

        element: main_elem.querySelector( '#input_mask' ),
        initial_data: my.initial_data,
        onfinish: function ( instance, results ) {

          // decode ccm dependencies in result data
          ccm.helper.decodeDependencies( results );

          // render preview
          ccm.helper.setContent( preview_elem, ccm.helper.protect( ccm.helper.html( my.html_templates.preview ) ) );
          my.cloze_preview.start( { key: results, element: preview_elem.querySelector( '#preview' ) } );

          // provide result data
          ccm.helper.onFinish( self, results );

        }

      } );

      // set content of own website area
      ccm.helper.setContent( self.element, ccm.helper.protect( main_elem ) );

      if ( callback ) callback();

    }

  }

} );