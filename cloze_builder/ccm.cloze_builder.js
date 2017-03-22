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
          label: 'Vorgegebene Lösungswörter',
          name: 'keywords',
          input: 'checkbox'
        },
        {
          label: 'Individuelle Lösungswörter',
          name: 'keyword_list',
          input: 'textarea'
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
        },
        {
          label: 'Nutzerkreis',
          name: 'user',
          input: 'select',
          options: [
            {
              value: ' ',
              caption: 'Öffentlich'
            },
            {
              value: "['ccm.instance','../user/ccm.user.js',{'sign_on':'guest'}]",
              caption: 'Gast'
            },
            {
              value: "['ccm.instance','../user/ccm.user.js',{'sign_on':'demo'}]",
              caption: 'Demo'
            },
            {
              value: "['ccm.instance','../user/ccm.user.js',{'sign_on':'hbrsinfkaul'}]",
              caption: 'FB02'
            },
            {
              value: '',
              caption: 'LEA (not yet)'
            },
            {
              value: '',
              caption: 'OpenOLAT (not yet)'
            }
          ]
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

      callback();
    };

    this.start = function ( callback ) {

      // show loading icon until rendering is finished
      ccm.helper.hide( self );

      // prepare main HTML structure
      var main_elem = ccm.helper.html( my.html_templates.main );
      var preview_elem = main_elem.querySelector( '#cloze_preview' );

      // set content of own website area (not visible yet)
      ccm.helper.setContent( self.element, ccm.helper.protect( main_elem ) );

      // prepare initial dataset
      var initial_data; prepareInitialData();

      // render input mask
      my.input_mask.start( {

        element: main_elem.querySelector( '#input_mask' ),
        initial_data: initial_data,
        onchange: function ( instance, results, name ) {

          // show/hide post-relevant entries
          if ( name === 'keywords' ) instance.element.querySelector( '.entry[data-name=keyword_list]' ).classList.toggle( 'hidden' );

          // prepare result data
          prepareResults( results );

          // update preview container
          renderPreview( results );

        },
        onfinish: function ( instance, results ) {

          // prepare result data
          prepareResults( results );

          // provide result data
          ccm.helper.onFinish( self, results );

        }

      }, function ( input_mask ) {

        // hide post-relevant entries
        if ( !input_mask.element.querySelector( 'input[name=keywords]' ).checked ) input_mask.element.querySelector( '.entry[data-name=keyword_list]' ).classList.add( 'hidden' );

        // replace loading icon with hidden rendered content
        ccm.helper.show( self );

        // render preview
        renderPreview( my.initial_data );

        if ( callback ) callback();
      } );

      /** prepares the initial dataset */
      function prepareInitialData() {

        // no initial dataset? => abort
        if ( !my.initial_data ) return;

        // clone initial dataset
        initial_data = ccm.helper.clone( my.initial_data );

        // handle values of post-relevant properties
        if ( Array.isArray( initial_data.keywords ) ) {
          initial_data.keyword_list = initial_data.keywords.join( ' ' );
          initial_data.keywords = true;
        }

        // encode ccm dependencies in initial dataset
        ccm.helper.encodeDependencies( initial_data );

      }

      /** prepares the result data */
      function prepareResults( results ) {

        // handle values of post-relevant properties
        if ( results.keywords && results.keyword_list ) results.keywords = results.keyword_list.split( /\s+/ );
        delete results.keyword_list;

        // decode ccm dependencies in result data
        ccm.helper.decodeDependencies( results );

      }

      /** renders preview of build fill-in-the-blank text */
      function renderPreview( config ) {

        ccm.helper.setContent( preview_elem, ccm.helper.protect( ccm.helper.html( my.html_templates.preview ) ) );
        my.cloze_preview.start( { key: config, element: preview_elem.querySelector( '#preview' ) } );

      }

    }

  }

} );