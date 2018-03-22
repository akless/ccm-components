/**
 * @overview ccm component for building a fill-in-the-blank text
 * @description This code is based on the ccm component 'ccm.fill_in_the_blank_blank_text_builder-2.0.0.js' by Tea Kless.
 * @author André Kless <andre.kless@web.de>, 2017-2018
 * @license The MIT License (MIT)
 * @version 1.7.0
 * @changes
 * version 1.7.0 (21.03.2018): added 'Basic' and 'Advanced' section
 * version 1.6.0 (15.01.2018): uses ccm v14.2.0 and supports retry after submit
 * version 1.5.1 (18.12.2017): updated selectable layouts; uses ccm.cloze.js v3.5.0
 * version 1.5.0 (06.12.2017): images could be used inside the text editor and updated help texts
 * version 1.4.0 (27.11.2017): more compact inputs mask (pull request by Tea Kless) and bugfix for restart button
 * version 1.3.0 (22.11.2017): revised distribution of the input mask (pull request by Tea Kless)
 * version 1.2.0 (18.11.2017): uses ccm.cloze.js v3.3.0 and updated help text
 * version 1.1.0 (15.11.2017): help texts for input elements
 * version 1.0.0 (13.11.2017)
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
    version: [ 1, 7, 0 ],

    /**
     * reference to used framework version
     * @type {object}
     */
    ccm: {
      url: 'https://akless.github.io/ccm/version/ccm-15.0.2.min.js',
      integrity: 'sha384-4X0IFdACgz2SAKu0knklA+SRQ6OVU4GipKhm7p6l7e7k/CIM8cjCFprWmM4qkbQz',
      crossorigin: 'anonymous'
    },

    /**
     * default instance configuration
     * @type {object}
     */
    config: {

      "html": {
        "id": "main",
        "class": "container-fluid",
        "inner": [
          {
            "tag": "legend",
            "class": "text-primary",
            "inner": "Build your Fill-in-the-Blank Text"
          },
          {
            "tag": "form",
            "class": "form",
            "onsubmit": "%submit%",
            "inner": [
              {
                "class": "navigation text-center",
                "inner": [
                  {
                    "class": "btn-group",
                    "inner":[
                      {
                        "tag": "a",
                        "typ": "button",
                        "class": "active btn btn-basic btn-info info",
                        "onclick": "%basic%",
                        "inner": "Basic"
                      },
                      {
                        "tag": "a",
                        "typ": "button",
                        "class": "btn btn-adv btn-warning info",
                        "onclick": "%advanced%",
                        "inner": "Advanced"
                      }
                    ]
                  }
                ]
              },
              {
                "id": "basic",
                "class": "show",
                "inner": [
                  {
                    "class": "text form-group",
                    "inner": [
                      {
                        "tag": "label",
                        "for": "text",
                        "class": "control-label",
                        "inner": [
                          "Your Text ",
                          {
                            "tag": "a",
                            "onclick": "%help%",
                            "inner": {
                              "class": "glyphicon glyphicon-info-sign"
                            }
                          },
                          {
                            "class": "alert alert-info",
                            "inner": [
                              {
                                "tag": "p",
                                "inner": "Add the content of your fill-in-the-blank text. A text gap is represented as double square brackets, e.g. “Hello, [[World]]!”."
                              },
                              {
                                "tag": "p",
                                "inner": "If you would like to show only certain letters of the solution word, put these letters into round brackets within the square brackets. In the following example, the three letters “o, r, d” of the solution word are already given in the text gap: “Hello, [[W(or)l(d)]]!”."
                              },
                              {
                                "tag": "p",
                                "inner": "When there is more than one correct solution for a text gap, separate each alternative solution word with “|” (vertical bar), e.g. \"[[work|study]]\". Press “Alt Gr” + “<” (Windows) or “Alt” + “7” (Mac) to type the symbol “|” (vertical bar)."
                              },
                              {
                                "tag": "p",
                                "inner": "In order to refer a gap to a previous gap, use “#” plus the number of the referenced text gap. This text gap will then have the same properties as the gap you referenced. For example: “You should [[concentrate|be careful|pay attention]] when creating a fill-in-the-blank text and you should [[#1]] when you add the created app to your online platform.”"
                              }
                            ]
                          }
                        ]
                      },
                      {
                        "id": "text"
                      }
                    ]
                  }
                ]
              },
              {
                "id": "advanced",
                "class": "hide",
                "inner": [
                  {
                    "class": "user form-group",
                    "inner": [
                      {
                        "tag": "label",
                        "for": "user",
                        "class": "control-label",
                        "inner": [
                          "Sign-on ",
                          {
                            "tag": "a",
                            "onclick": "%help%",
                            "inner": {
                              "class": "glyphicon glyphicon-info-sign"
                            }
                          },
                          {
                            "class": "alert alert-info",
                            "inner": [
                              "If you select a sign-on mode here, authentication will be requested after the completion of the fill-in-the-blank text and the results will only be submitted if the authentication was successful. The various sign-on modes are described below.",
                              {
                                "tag": "h5",
                                "inner": "Guest Mode"
                              },
                              {
                                "tag": "p",
                                "inner": "Every user will automatically logged in as the user \"guest\". This mode is mostly used for test scenarios."
                              },
                              {
                                "tag": "h5",
                                "inner": "Demo Mode"
                              },
                              {
                                "tag": "p",
                                "inner": "The user can authenticate with any username and without password. This mode is mostly used for demo scenarios."
                              },
                              {
                                "tag": "h5",
                                "inner": "H-BRS FB02"
                              },
                              {
                                "tag": "p",
                                "inner": "In this mode the user has to authenticate access with a valid account from the Department of Computer Sciences at Hochschule Bonn-Rhein-Sieg University of Applied Sciences."
                              }
                            ]
                          }
                        ]
                      },
                      {
                        "tag": "select",
                        "onchange": "%change%",
                        "class": "form-control",
                        "id": "user",
                        "name": "user",
                        "inner": [
                          {
                            "tag": "option",
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
                    ]
                  },
                  {
                    "class": "css form-group",
                    "inner": [
                      {
                        "tag": "label",
                        "for": "css",
                        "class": "control-label",
                        "inner": [
                          "Layout ",
                          {
                            "tag": "a",
                            "onclick": "%help%",
                            "inner": {
                              "class": "glyphicon glyphicon-info-sign"
                            }
                          },
                          {
                            "class": "alert alert-info",
                            "inner": "Choose between different layouts, in which the fill-in-the-blank text is displayed."
                          }
                        ]
                      },
                      {
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
                            "value": "['ccm.load','https://akless.github.io/ccm-components/cloze/resources/lea.css','https://cdnjs.cloudflare.com/ajax/libs/normalize/7.0.0/normalize.min.css',{'context': 'head','url':'https://fonts.googleapis.com/css?family=Montserrat:200'}]"
                          },
                          {
                            "tag": "option",
                            "inner": "PBWorks-like",
                            "value": "['ccm.load','https://akless.github.io/ccm-components/cloze/resources/pbworks.css','https://cdnjs.cloudflare.com/ajax/libs/normalize/7.0.0/normalize.min.css',{'context': 'head','url':'https://fonts.googleapis.com/css?family=Montserrat:200'}]"
                          }
                        ]
                      }
                    ]
                  },
                  {
                    "class": "time form-group",
                    "inner": [
                      {
                        "tag": "label",
                        "for": "time",
                        "class": "control-label",
                        "inner": [
                          "Time Limit ",
                          {
                            "tag": "a",
                            "onclick": "%help%",
                            "inner": {
                              "class": "glyphicon glyphicon-info-sign"
                            }
                          },
                          {
                            "class": "alert alert-info",
                            "inner": "Specify the number of seconds available to solve the fill-in-the-blank text. The remaining number of seconds is then displayed visually. After expiration of the time, the fill-in-the-blank text is submitted automatically. If you do not specify anything here, there is no time limit for handling the fill-in-the-blank text."
                          },
                        ]
                      },
                      {
                        "tag": "input",
                        "type": "number",
                        "onchange": "%change%",
                        "class": "form-control",
                        "id": "time",
                        "name": "time",
                        "placeholder": "Time in seconds"
                      }
                    ]
                  },
                  {
                    "class": "keywords form-group",
                    "inner": [
                      {
                        "tag": "label",
                        "for": "keywords",
                        "class": "control-label",
                        "inner": [
                          "Provided Answers ",
                          {
                            "tag": "a",
                            "onclick": "%help%",
                            "inner": {
                              "class": "glyphicon glyphicon-info-sign"
                            }
                          },
                          {
                            "class": "alert alert-info",
                            "inner": "Here you can set whether the solution words for the gaps in the text are already given, so that they only need to be placed in the correct gap. You can either generate the list of solution words automatically or set the solution words yourself manually."
                          }
                        ]
                      },
                      {
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
                    "class": "feedback form-group",
                    "inner": [
                      {
                        "tag": "label",
                        "for": "feedback",
                        "class": "control-label",
                        "inner": [
                          "Feedback ",
                          {
                            "tag": "a",
                            "onclick": "%help%",
                            "inner": {
                              "class": "glyphicon glyphicon-info-sign"
                            }
                          },
                          {
                            "class": "alert alert-info",
                            "inner": "Choose here whether direct feedback should be displayed for the entered solution. The solution can then be submitted via a submit button. You can choose if the feedback should only comment on the solution or also provide the correct solution."
                          }
                        ]
                      },
                      {
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
                            "inner": "Show only correctness with retry",
                            "value": "retry"
                          },
                          {
                            "tag": "option",
                            "inner": "Show correctness and solutions",
                            "value": "solutions"
                          }
                        ]
                      }
                    ]
                  },
                  {
                    "class": "captions_retry form-group",
                    "inner": [
                      {
                        "tag": "label",
                        "for": "captions_retry",
                        "class": "control-label",
                        "inner": [
                          "Retry Button Label ",
                          {
                            "tag": "a",
                            "onclick": "%help%",
                            "inner": {
                              "class": "glyphicon glyphicon-info-sign"
                            }
                          },
                          {
                            "class": "alert alert-info",
                            "inner": "Specify the caption of the retry button, which allows the values ​​entered in the gaps to be changed again."
                          }
                        ]
                      },
                      {
                        "inner": [
                          {
                            "tag": "input",
                            "type": "text",
                            "onchange": "%change%",
                            "class": "form-control",
                            "id": "captions_retry",
                            "name": "captions.retry",
                            "placeholder": "Enter Button Label"
                          }
                        ]
                      }
                    ]
                  },
                  {
                    "class": "captions_submit form-group",
                    "inner": [
                      {
                        "tag": "label",
                        "for": "captions_submit",
                        "class": "control-label",
                        "inner": [
                          "Submit Button Label ",
                          {
                            "tag": "a",
                            "onclick": "%help%",
                            "inner": {
                              "class": "glyphicon glyphicon-info-sign"
                            }
                          },
                          {
                            "class": "alert alert-info",
                            "inner": "Specify the caption of the submit button, which submits the fill-in-the-blank text and shows the feedback."
                          }
                        ]
                      },
                      {
                        "inner": [
                          {
                            "tag": "input",
                            "type": "text",
                            "onchange": "%change%",
                            "class": "form-control",
                            "id": "captions_submit",
                            "name": "captions.submit",
                            "placeholder": "Enter Button Label"
                          }
                        ]
                      }
                    ]
                  },
                  {
                    "class": "check-boxes form-group",
                    "inner":  {
                      "tag": "table",
                      "class": "table",
                      "inner": [
                        {
                          "tag": "thead",
                          "inner": [
                            {
                              "tag": "tr",
                              "inner": [
                                {
                                  "tag": "th",
                                  "class": "col-md-4",
                                  "inner": {
                                    "class": "blank form-inline",
                                    "inner": [
                                      {
                                        "tag": "label",
                                        "class": "control-label",
                                        "inner": [
                                          "Blank Gaps ",
                                          {
                                            "tag": "a",
                                            "onclick": "%help%",
                                            "inner": {
                                              "class": "glyphicon glyphicon-info-sign"
                                            }
                                          },
                                          {
                                            "class": "checkbox",
                                            "onchange": "%change%",
                                            "inner": {
                                              "tag": "label",
                                              "inner": {
                                                "tag": "input",
                                                "type": "checkbox",
                                                "name": "blank"
                                              }
                                            }
                                          },
                                          {
                                            "class": "alert alert-info",
                                            "inner": "Choose whether the text gaps are completely empty, or the length of the searched word and possibly already given letters are visible."
                                          }
                                        ]
                                      }
                                    ]
                                  }
                                },
                                {
                                  "tag": "th",
                                  "class": "col-md-4",
                                  "inner": {
                                    "class": "start_button form-inline",
                                    "inner": [
                                      {
                                        "class": "control-label",
                                        "inner": [
                                          "Start Button ",
                                          {
                                            "tag": "a",
                                            "onclick": "%help%",
                                            "inner": {
                                              "class": "glyphicon glyphicon-info-sign"
                                            }
                                          },
                                          {
                                            "class": "checkbox",
                                            "onchange": "%change%",
                                            "inner": {
                                              "tag": "label",
                                              "inner": {
                                                "tag": "input",
                                                "type": "checkbox",
                                                "name": "start_button"
                                              }
                                            }
                                          },
                                          {
                                            "class": "alert alert-info",
                                            "inner": "If you select this option, the fill-in-the-blank text will be displayed after clicking on a start button, which will be displayed instead of the fill-in-the-blank text."
                                          }
                                        ]
                                      }
                                    ]
                                  }
                                },
                                {
                                  "tag": "th",
                                  "class": "col-md-4",
                                  "inner": {
                                    "class": "onfinish_restart form-inline",
                                    "inner": [
                                      {
                                        "class": "control-label",
                                        "inner": [
                                          "Restart after Finish ",
                                          {
                                            "tag": "a",
                                            "onclick": "%help%",
                                            "inner": {
                                              "class": "glyphicon glyphicon-info-sign"
                                            }
                                          },
                                          {
                                            "class": "checkbox",
                                            "onchange": "%change%",
                                            "inner": {
                                              "tag": "label",
                                              "inner": {
                                                "tag": "input",
                                                "type": "checkbox",
                                                "name": "onfinish.restart"
                                              }
                                            }
                                          },
                                          {
                                            "class": "alert alert-info",
                                            "inner": "Select this option to add a finish button to the fill-in-the-blank text that will allow you to restart it."
                                          }
                                        ]
                                      }
                                    ]
                                  },
                                }
                              ]
                            }
                          ]
                        },
                        {
                          "tag": "tbody",
                          "inner": [
                            {
                              "tag": "tr",
                              "inner": [
                                {
                                  "tag": "td",
                                  "inner": {}
                                },
                                {
                                  "tag": "td",
                                  "inner": {
                                    "class": "captions_start form-group",
                                    "inner": [
                                      {
                                        "tag": "input",
                                        "type": "text",
                                        "onchange": "%change%",
                                        "class": "form-control",
                                        "id": "captions_start",
                                        "name": "captions.start",
                                        "placeholder": "Enter Button Label"
                                      },
                                      {
                                        "tag": "label",
                                        "for": "captions_start",
                                        "class": "control-label",
                                        "style": "display: none",
                                        "inner": "Label "
                                      }
                                    ]
                                  },
                                },
                                {
                                  "tag": "td",
                                  "inner": {
                                    "class": "captions_finish form-group",
                                    "inner": [
                                      {
                                        "tag": "input",
                                        "type": "text",
                                        "onchange": "%change%",
                                        "class": "form-control",
                                        "id": "captions_finish",
                                        "name": "captions.finish",
                                        "placeholder": "Enter Button Label"
                                      },
                                      {
                                        "tag": "label",
                                        "for": "captions_finish",
                                        "class": "control-label",
                                        "inner": "Label",
                                        "style": "display:none"
                                      }
                                    ]
                                  }
                                }
                              ]
                            }
                          ]
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
      "css": [ "ccm.load",
        "https://tkless.github.io/ccm-components/libs/bootstrap/css/bootstrap.css",
        { "context": "head", "url": "https://tkless.github.io/ccm-components/libs/bootstrap/css/font-face.css" },
        "https://akless.github.io/ccm-components/cloze_builder/resources/default.css"
      ],
      "editor": [ "ccm.component", "https://tkless.github.io/ccm-components/editor/versions/ccm.editor-2.0.0.min.js",
        { "settings.modules.toolbar": [
          [ { 'header': [ 1, 2, 3, 4, 5, 6, false ] } ],
          [ "bold", "italic", "underline" ],                    // toggled buttons
          [ { "align": [] } ],
          [ "blockquote", "code-block" ],
          [ { "header": 1 }, { "header": 2 } ],                 // custom button values
          [ { "list": "ordered" }, { "list": "bullet" } ],
          [ { "script": "sub" }, { "script": "super" } ],       // superscript/subscript
          [ { "indent": "-1" }, { "indent": "+1" } ],           // outdent/indent
          [ { "color": [] }, { "background": [] } ],            // dropdown with defaults from theme
          [ "image" ]
        ], "settings.placeholder": "Type here..." }
      ],
      "target": [ "ccm.component", "https://akless.github.io/ccm-components/cloze/ccm.cloze.js" ],
      "submit_button": true,
      "preview": true,
      "onfinish": { "log": true }

  /*
      "start_values": {
        "css": "['ccm.load','https://akless.github.io/ccm-components/cloze/resources/lea.css']",
        "text": "<p>In order to [[s(e)rv(e)|solv(e)]] you well, Karma needs to know about your project in order to test it and this is done via a configuration file. The easiest way to generate an initial configuration file is by using the karma init command. This page lists all of the available configuration options.</p>",
        "captions": {
          "start": "Start",
          "submit": "Submit",
          "retry": "Retry",
          "finish": "Finish"
        },
        "start_button": true,
        "keywords": true,
        "blank": true,
        "time": 123,
        "feedback": true,
        "retry": true,
        "solutions": false,
        "user": "['ccm.instance','https://akless.github.io/ccm-components/user/versions/ccm.user-2.0.0.min.js',{'sign_on':'demo'}]",
        "onfinish": { "restart": true }
      }
  */
  //  onchange

    },

    /**
     * for creating instances out of this component
     * @constructor
     */
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
          my.start_values.feedback = my.start_values.feedback ? ( my.start_values.retry ? 'retry' : ( my.start_values.solutions ? 'solutions' : 'correctness' ) ) : 'none';
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
        $.setContent( self.element, $.html( my.html, {
          basic: () => {

            // activate 'Basic' button
            self.element.querySelector( '.btn-adv' ).classList.remove( 'active' );
            self.element.querySelector( '.btn-basic' ).classList.add( 'active' );

            // show 'Basic' section
            self.element.querySelector( '#advanced' ).classList.remove( 'show' );
            self.element.querySelector( '#basic' ).classList.remove( 'hide' );
            self.element.querySelector( '#advanced' ).classList.add( 'hide' );
            self.element.querySelector( '#basic' ).classList.add( 'show' );

            onChange();
          },
          advanced: () => {

            // activate 'Advanced' button
            self.element.querySelector( '.btn-basic' ).classList.remove( 'active' );
            self.element.querySelector( '.btn-adv' ).classList.add( 'active' );

            // show 'Advanced' section
            self.element.querySelector( '#advanced' ).classList.remove( 'hide' );
            self.element.querySelector( '#basic' ).classList.remove( 'show' );
            self.element.querySelector( '#advanced' ).classList.add( 'show' );
            self.element.querySelector( '#basic' ).classList.add( 'hide' );

            onChange();
          },
          submit: self.submit,
          change: onChange,
          help: function () {

            // hide and show help texts
            const this_a = this;
            $.makeIterable( self.element.querySelectorAll( 'a' ) ).map( other_a => other_a !== this_a && other_a.classList.remove( 'active' ) );
            this.classList.toggle( 'active' );

          }
        } ) );

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
              case 'captions.retry':
              case 'captions.submit':
              case 'captions.finish':
              case 'manually':
              case 'time':
                if ( element ) element.value = my.start_values[ key ];
                break;
              // checkbox
              case 'start_button':
              case 'blank':
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
          self.element.querySelector( '.captions_retry'  ).style.display = getInputElementByName( 'feedback' ).value === 'retry'    ? 'block' : 'none';
          self.element.querySelector( '.captions_submit' ).style.display = getInputElementByName( 'feedback' ).value !== 'none'     ? 'block' : 'none';
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
        $.onFinish( self );

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

        // finalize 'feedback', 'retry' and 'solutions' property
        result.retry     = result.feedback === 'retry';
        result.solutions = result.feedback === 'solutions';
        result.feedback  = result.feedback !== 'none';

        // finalize 'onfinish' property
        if ( result.onfinish && !result.onfinish.restart ) delete result.onfinish;

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