/**
 * @overview ccm component for building a fill-in-the-blank text
 * @description This code is based on the ccm component 'ccm.fill_in_the_blank_blank_text_builder-2.0.0.js' by Tea Kless.
 * @author André Kless <andre.kless@web.de>, 2017
 * @license The MIT License (MIT)
 * @version 1.0.0
 */

{
  var component = {

    /**
     * unique component name
     * @type {string}
     */
    name: 'cloze_builder',

    /**
     * component version
     * @type {number[]}
     */
    version: [ 1, 0, 0 ],

    /**
     * reference to used framework version
     * @type {object}
     */
    ccm: {
      url: 'https://akless.github.io/ccm/version/ccm-12.12.0.min.js',
      integrity: 'sha384-1pDRNaBU2okRlEuyNp8icKgmsidtnoBsvFtbReMBrQv1bgQqCun0aw5DuTKu61Ts',
      crossorigin: 'anonymous'
    },

    /**
     * default instance configuration
     * @type {object}
     */
    config: {

      "html": {
        "id": "main",
        "inner": [
          {
            "tag": "legend",
            "class": "text-primary",
            "inner": "Build your Fill-in-the-Blank Text"
          },
          {
            "tag": "form",
            "class": "form-horizontal",
            "onsubmit": "%submit%",
            "inner": [
              {
                "class": "text form-group",
                "inner": [
                  {
                    "tag": "label",
                    "for": "text",
                    "class": "control-label col-md-2",
                    "inner": "Your Text:"
                  },
                  {
                    "class": "col-md-10",
                    "id": "text"
                  }
                ]
              },
              {
                "class": "blank form-group",
                "inner": [
                  {
                    "tag": "label",
                    "for": "blank",
                    "class": "control-label col-md-2",
                    "inner": "Blank Gaps:"
                  },
                  {
                    "class": "col-md-10",
                    "inner": {
                      "class": "checkbox",
                      "onchange": "%change%",
                      "inner": {
                        "tag": "label",
                        "inner": {
                          "tag": "input",
                          "type": "checkbox",
                          "id": "blank",
                          "name": "blank"
                        }
                      }
                    }
                  }

                ]
              },
              {
                "class": "keywords form-group",
                "inner": [
                  {
                    "tag": "label",
                    "for": "keywords",
                    "class": "control-label col-md-2",
                    "inner": "Provided Answers:"
                  },
                  {
                    "class": "col-md-10",
                    "inner": [
                      {
                        "inner": {
                          "tag": "select",
                          "onchange": "%change%",
                          "class": "form-control",
                          "id": "keywords",
                          "name": "keywords",
                          "inner": [
                            {
                              "tag": "option",
                              "inner": "None",
                              "value": "none"
                            },
                            {
                              "tag": "option",
                              "inner": "Auto generated",
                              "value": "auto"
                            },
                            {
                              "tag": "option",
                              "inner": "Manually",
                              "value": "manually"
                            }
                          ]
                        }
                      },
                      {
                        "inner": {
                          "tag": "input",
                          "type": "text",
                          "onchange": "%change%",
                          "class": "form-control",
                          "id": "manually",
                          "name": "manually",
                          "placeholder": "Comma-separated list of provided answers"
                        }
                      }
                    ]
                  }
                ]
              },
              {
                "class": "start_button form-group",
                "inner": [
                  {
                    "tag": "label",
                    "for": "start_button",
                    "class": "control-label col-md-2",
                    "inner": "Start Button:"
                  },
                  {
                    "class": "col-md-10",
                    "inner": {
                      "class": "checkbox",
                      "onchange": "%change%",
                      "inner": {
                        "tag": "label",
                        "inner": {
                          "tag": "input",
                          "type": "checkbox",
                          "id": "start_button",
                          "name": "start_button"
                        }
                      }
                    }
                  }
                ]
              },
              {
                "class": "captions_start form-group",
                "inner": [
                  {
                    "tag": "label",
                    "for": "captions_start",
                    "class": "control-label col-md-2",
                    "inner": "Start Button Caption:"
                  },
                  {
                    "class": "col-md-10",
                    "inner": {
                      "tag": "input",
                      "type": "text",
                      "onchange": "%change%",
                      "class": "form-control",
                      "id": "captions_start",
                      "name": "captions.start"
                    }
                  }
                ]
              },
              {
                "class": "feedback form-group",
                "inner": [
                  {
                    "tag": "label",
                    "for": "feedback",
                    "class": "control-label col-md-2",
                    "inner": "Feedback:"
                  },
                  {
                    "class": "col-md-10",
                    "inner": {
                      "tag": "select",
                      "onchange": "%change%",
                      "class": "form-control",
                      "id": "feedback",
                      "name": "feedback",
                      "inner": [
                        {
                          "tag": "option",
                          "inner": "None",
                          "value": "none"
                        },
                        {
                          "tag": "option",
                          "inner": "Show only correctness",
                          "value": "correctness"
                        },
                        {
                          "tag": "option",
                          "inner": "Show correctness and solutions",
                          "value": "solutions"
                        }
                      ]
                    }
                  }
                ]
              },
              {
                "class": "captions_submit form-group",
                "inner": [
                  {
                    "tag": "label",
                    "for": "captions_submit",
                    "class": "control-label col-md-2",
                    "inner": "Submit Button Caption:"
                  },
                  {
                    "class": "col-md-10",
                    "inner": {
                      "tag": "input",
                      "type": "text",
                      "onchange": "%change%",
                      "class": "form-control",
                      "id": "captions_submit",
                      "name": "captions.submit"
                    }
                  }
                ]
              },
              /*
              {
                "class": "cancel_button form-group",
                "inner": [
                  {
                    "tag": "label",
                    "for": "cancel_button",
                    "class": "control-label col-md-2",
                    "inner": "Cancel Button:"
                  },
                  {
                    "class": "col-md-10",
                    "inner": {
                      "class": "checkbox",
                      "onchange": "%change%",
                      "inner": {
                        "tag": "label",
                        "inner": {
                          "tag": "input",
                          "type": "checkbox",
                          "id": "cancel_button",
                          "name": "cancel_button"
                        }
                      }
                    }
                  }
                ]
              },
              {
                "class": "captions_cancel form-group",
                "inner": [
                  {
                    "tag": "label",
                    "for": "captions_cancel",
                    "class": "control-label col-md-2",
                    "inner": "Cancel Button Caption:"
                  },
                  {
                    "class": "col-md-10",
                    "inner": {
                      "tag": "input",
                      "type": "text",
                      "onchange": "%change%",
                      "class": "form-control",
                      "id": "captions_cancel",
                      "name": "captions.cancel"
                    }
                  }
                ]
              },
              */
              {
                "class": "onfinish_restart form-group",
                "inner": [
                  {
                    "tag": "label",
                    "for": "onfinish_restart",
                    "class": "control-label col-md-2",
                    "inner": "Restart after Finish:"
                  },
                  {
                    "class": "col-md-10",
                    "inner": {
                      "class": "checkbox",
                      "onchange": "%change%",
                      "inner": {
                        "tag": "label",
                        "inner": {
                          "tag": "input",
                          "type": "checkbox",
                          "id": "onfinish_restart",
                          "name": "onfinish.restart"
                        }
                      }
                    }
                  }
                ]
              },
              {
                "class": "captions_finish form-group",
                "inner": [
                  {
                    "tag": "label",
                    "for": "captions_finish",
                    "class": "control-label col-md-2",
                    "inner": "Finish Button Caption:"
                  },
                  {
                    "class": "col-md-10",
                    "inner": {
                      "tag": "input",
                      "type": "text",
                      "onchange": "%change%",
                      "class": "form-control",
                      "id": "captions_finish",
                      "name": "captions.finish"
                    }
                  }
                ]
              },
              {
                "class": "user form-group",
                "inner": [
                  {
                    "tag": "label",
                    "for": "user",
                    "class": "control-label col-md-2",
                    "inner": "Sign-on:"
                  },
                  {
                    "class": "col-md-10",
                    "inner": {
                      "tag": "select",
                      "onchange": "%change%",
                      "class": "form-control",
                      "id": "user",
                      "name": "user",
                      "inner": [
                        {
                          "tag":"option",
                          "inner": "None",
                          "value": ""
                        },
                        {
                          "tag": "option",
                          "inner": "Guest Mode",
                          "value": "['ccm.instance','https://akless.github.io/ccm-components/user/ccm.user.js',{'sign_on':'guest'}]"
                        },
                        {
                          "tag": "option",
                          "inner": "Demo Mode",
                          "value": "['ccm.instance','https://akless.github.io/ccm-components/user/versions/ccm.user-2.0.0.min.js',{'sign_on':'demo'}]"
                        },
                        {
                          "tag": "option",
                          "inner": "H-BRS FB02",
                          "value": "['ccm.instance','https://akless.github.io/ccm-components/user/versions/ccm.user-2.0.0.min.js',{'sign_on':'hbrsinfkaul'}]"
                        }
                      ]
                    }
                  }
                ]
              },
              {
                "class": "time form-group",
                "inner": [
                  {
                    "tag": "label",
                    "for": "time",
                    "class": "control-label col-md-2",
                    "inner": "Time Limit:"
                  },
                  {
                    "class": "col-md-10",
                    "inner": {
                      "tag": "input",
                      "type": "number",
                      "onchange": "%change%",
                      "class": "form-control",
                      "id": "time",
                      "name": "time",
                      "placeholder": "Time in seconds"
                    }
                  }
                ]
              },
              {
                "class": "css form-group",
                "inner": [
                  {
                    "tag": "label",
                    "for": "css",
                    "class": "control-label col-md-2",
                    "inner": "Layout:"
                  },
                  {
                    "class": "col-md-10",
                    "inner": {
                      "tag": "select",
                      "onchange": "%change%",
                      "class": "form-control",
                      "id": "css",
                      "name": "css",
                      "inner": [
                        {
                          "tag": "option",
                          "inner": "Default",
                          "value": "['ccm.load','https://akless.github.io/ccm-components/cloze/resources/default.css']"
                        },
                        {
                          "tag": "option",
                          "inner": "LEA-like",
                          "value": "['ccm.load','https://akless.github.io/ccm-components/cloze/resources/lea.css']"
                        },
                        {
                          "tag": "option",
                          "inner": "PBWorks-like",
                          "value": "['ccm.load','https://akless.github.io/ccm-components/cloze/resources/pbworks.css','https://cdnjs.cloudflare.com/ajax/libs/normalize/7.0.0/normalize.min.css']"
                        }
                      ]
                    }
                  }
                ]
              },
              {
                "class": "preview",
                "inner": [
                  {
                    "tag": "legend",
                    "class": "legend text-primary",
                    "inner": "Here's a Preview of what you've Build"
                  },
                  {
                    "id": "preview"
                  }
                ]
              },
              {
                "class": "submit submit-button form-group",
                "inner": [
                  {
                    "class": "col-md-12 text-right",
                    "inner": {
                      "tag": "input",
                      "type": "submit",
                      "id": "submit",
                      "class": "btn btn-primary"
                    }
                  }
                ]

              }
            ]
          }
        ]
      },
      "css": [ "ccm.load", "https://tkless.github.io/ccm-components/lib/bootstrap/css/bootstrap.css", { "context": "head", "url": "https://tkless.github.io/ccm-components/lib/bootstrap/css/font-face.css" } ],
      "editor": [ "ccm.component", "https://tkless.github.io/ccm-components/editor/versions/ccm.editor-1.0.0.min.js",
        { "settings.modules.toolbar": [
          [ { "size": [ "small", false, "large", "huge" ] } ],  // custom dropdown
          [ "bold", "italic", "underline" ],                    // toggled buttons
          [ "blockquote", "code-block" ],

          [ { "header": 1 }, { "header": 2 } ],                 // custom button values
          [ { "list": "ordered" }, { "list": "bullet" } ],
          [ { "script": "sub" }, { "script": "super" } ],       // superscript/subscript
          [ { "indent": "-1" }, { "indent": "+1" } ],           // outdent/indent

          [ { "color": [] }, { "background": [] } ],            // dropdown with defaults from theme
          [ { "align": [] } ]
        ], "settings.placeholder": "Type here..." }
      ],
      "target": [ "ccm.component", "https://akless.github.io/ccm-components/cloze/versions/beta/ccm.cloze-3.2.0.min.js" ],
      "submit_button": true,
      "preview": true,
      "onfinish": { "log": true }

      /*
          "start_values": {
            "css": "['ccm.load','https://akless.github.io/ccm-components/cloze/resources/lea.css']",
            "text": "<p>In order to [[s(e)rv(e)|solv(e)]] you well, Karma needs to know about your project in order to test it and this is done via a configuration file. The easiest way to generate an initial configuration file is by using the karma init command. This page lists all of the available configuration options.</p>",
            "captions": {
              "start": "Start",
              "cancel": "Cancel",
              "submit": "Submit",
              "finish": "Finish"
            },
            "start_button": true,
            "keywords": true,
            "blank": true,
            "time": 123,
            "feedback": true,
            "solutions": true,
            "cancel_button": true,
            "user": "['ccm.instance','https://akless.github.io/ccm-components/user/versions/ccm.user-2.0.0.min.js',{'sign_on':'demo'}]",
            "logger": "['ccm.instance','https://akless.github.io/ccm-components/log/versions/ccm.log-1.0.0.min.js',['ccm.get','https://akless.github.io/ccm-components/log/resources/configs.min.js','greedy']]",
            "onfinish": { "restart": true }
          }
      */
      //  onchange
      //  onfinish

    },

    Instance: function () {

      /**
       * own reference for inner functions
       * @type {Instance}
       */
      const self = this;

      /**
       * privatized instance members
       * @type {object}
       */
      let my;

      /**
       * shortcut to help functions
       * @type {Object.<string,function>}
       */
      let $;

      /**
       * ccm instance of the text editor
       * @type {object}
       */
      let editor;

      /**
       * is called once after the initialization and is then deleted
       * @param {function} callback - called after all synchronous and asynchronous operations are complete
       */
      this.ready = callback => {

        // set shortcut to help functions
        $ = self.ccm.helper;

        // privatize all possible instance members
        my = $.privatize( self );

        // prepare start values for input elements
        prepareStartValues();

        // is ready => perform callback
        callback();

        /** prepares the start values for the input elements  */
        function prepareStartValues() {

          // initial state of the start values
          my.start_values = my.start_values ? $.toDotNotation( my.start_values ) : {};

          // consideration of the default configuration of the target component for start values
          let config = $.clone( my.target.config );
          delete config.ccm; delete config.html; delete config.parent;
          config.css = $.encode( config.css );
          config = $.toDotNotation( config );
          config[ 'captions.finish' ] = 'Restart';
          for ( const key in config )
            if ( my.start_values[ key ] === undefined )
              my.start_values[ key ] = config[ key ];

          // prepare 'keywords' and 'manually' entry
          if ( Array.isArray( my.start_values.keywords ) )
            my.start_values.manually = my.start_values.keywords.join( ', ' );
          my.start_values.keywords = my.start_values.keywords ? ( my.start_values.keywords === true ? 'auto' : 'manually' ) : 'none';

          // prepare 'feedback' entry
          my.start_values.feedback = my.start_values.feedback ? ( my.start_values.solutions ? 'solutions' : 'correctness' ) : 'none';
          delete my.start_values.solutions;

          // security check for start values
          my.start_values = $.protect( my.start_values );

        }

      };

      /**
       * starts the instance
       * @param {function} [callback] - called after all synchronous and asynchronous operations are complete
       */
      this.start = callback => {

        // render input elements
        $.setContent( self.element, $.html( my.html, { submit: self.submit, change: onChange } ) );

        // render text editor
        my.editor.start( function ( instance ) {
          $.setContent( self.element.querySelector( '#text' ), instance.root );
          editor = instance;
          editor.get().on( 'text-change', onChange );

          // fill input elements with start values
          for ( const key in my.start_values ) {
            let element = self.element.querySelector( '[name="' + key + '"]' );
            switch ( key ) {
              // text, number
              case 'captions.start':
              case 'captions.cancel':
              case 'captions.submit':
              case 'captions.finish':
              case 'manually':
              case 'time':
                if ( element ) element.value = my.start_values[ key ];
                break;
              // checkbox
              case 'start_button':
              case 'blank':
              case 'cancel_button':
              case 'onfinish.restart':
                if ( my.start_values[ key ] === true && element ) element.checked = true;
                break;
              // select
              case 'css':
              case 'keywords':
              case 'feedback':
              case 'user':
                element = self.element.querySelector( 'select[name="' + key + '"] option[value="' + my.start_values[ key ] + '"]' );
                if ( element ) element.selected = true;
                break;
              // custom
              case 'text':
                editor.get().root.innerHTML = my.start_values[ key ];
                break;
            }
          }

          // hide input elements for which this is necessary
          setVisibility();

          // render preview
          if ( my.preview ) updatePreview();

          // no preview desired? => remove preview section
          else $.removeElement( self.element.querySelector( '.preview' ) );

          // no submit button wanted? => remove submit button
          if ( !my.submit_button ) $.removeElement( self.element.querySelector( '.submit' ) );

          // individual caption for submit button? => set caption of submit button
          if ( typeof my.submit_button === 'string' ) self.element.querySelector( '#submit' ).value = my.submit_button;

          // rendering completed => perform callback
          if ( callback ) callback();

        } );

        /** defines which input elements are visible or hidden. */
        function setVisibility() {

          self.element.querySelector( '.captions_start'  ).style.display = getInputElementByName( 'start_button'     ).checked      ? 'block' : 'none';
          self.element.querySelector( '.captions_submit' ).style.display = getInputElementByName( 'feedback' ).value !== 'none'     ? 'block' : 'none';
          //  self.element.querySelector( '.captions_cancel' ).style.display = getInputElementByName( 'cancel_button'    ).checked      ? 'block' : 'none';
          self.element.querySelector( '.captions_finish' ).style.display = getInputElementByName( 'onfinish.restart' ).checked      ? 'block' : 'none';
          getInputElementByName(              'manually' ).style.display = getInputElementByName( 'keywords' ).value === 'manually' ? 'block' : 'none';
          function getInputElementByName( name ) { return self.element.querySelector( '[name="' + name + '"]' ); }

        }

        /** callback if an input value has changed */
        function onChange() {

          // hide and show input elements for which this is necessary
          setVisibility();

          // update preview considering the changed input value
          updatePreview();

          // perform change actions
          self.onchange && self.onchange( self );

        }

        /** (re)renders the preview based on the entered values */
        function updatePreview() {

          // no preview desired? => abort
          if ( !my.preview ) return;

          // (re)render preview
          my.target.start( self.getValue(), instance => $.setContent( self.element.querySelector( '#preview' ), instance.root ) );

        }

      };

      /** triggers the submit of the entered data */
      this.submit = event => {

        // prevent page reload
        if ( event ) event.preventDefault();

        // perform finish actions
        if ( self.onfinish ) $.onFinish( self );

      };

      /**
       * returns the resulting instance configuration for the target component
       * @returns {object} instance configuration for target component
       */
      this.getValue = () => {

        /**
         * values of the input elements
         * @type {object}
         */
        let result = $.formData( self.element.querySelector( 'form' ) );

        // finalize 'text' property
        result.text = editor.get().root.innerHTML;

        // finalize 'keywords' property
        if ( result.keywords === 'manually' ) {
          const manually = result.manually.split( ',' );
          manually.map( keyword => keyword.trim() );
          result.keywords = manually;
        }
        else result.keywords = result.keywords === 'auto';
        delete result.manually;

        // finalize 'feedback' and 'solutions' property
        result.solutions = result.feedback === 'solutions';
        result.feedback = result.feedback !== 'none';

        // finalize 'onfinish' property
        if ( !result[ 'onfinish.restart' ] ) delete result[ 'onfinish.restart' ];
        else result[ 'onfinish.log' ] = true;

        // convert dot notation properties to deeper objects
        result = $.solveDotNotation( result );

        // decode encoded input values
        $.decode( result );

        // now values of input elements are transformed to resulting instance configuration
        return result;

      };

    }

  };

  function p(){window.ccm[v].component(component)}const f="ccm."+component.name+(component.version?"-"+component.version.join("."):"")+".js";if(window.ccm&&null===window.ccm.files[f])window.ccm.files[f]=component;else{const n=window.ccm&&window.ccm.components[component.name];n&&n.ccm&&(component.ccm=n.ccm),"string"==typeof component.ccm&&(component.ccm={url:component.ccm});var v=component.ccm.url.split("/").pop().split("-");if(v.length>1?(v=v[1].split("."),v.pop(),"min"===v[v.length-1]&&v.pop(),v=v.join(".")):v="latest",window.ccm&&window.ccm[v])p();else{const e=document.createElement("script");document.head.appendChild(e),component.ccm.integrity&&e.setAttribute("integrity",component.ccm.integrity),component.ccm.crossorigin&&e.setAttribute("crossorigin",component.ccm.crossorigin),e.onload=function(){p(),document.head.removeChild(e)},e.src=component.ccm.url}}
}