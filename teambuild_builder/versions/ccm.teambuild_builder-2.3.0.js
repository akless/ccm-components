/**
 * @overview ccm component for building a realtime team building
 * @author André Kless <andre.kless@web.de>, 2017
 * @license The MIT License (MIT)
 * @version 2.3.0
 * @changes
 * version 2.3.0 (27.11.2017):
 * - more compact inputs mask (pull request by Tea Kless)
 * - add help icons with help texts (pull request by Tea Kless)
 * - uses ccm v12.6.0
 * version 2.2.0 (09.11.2017): add 'getValue():obj' interface
 * version 2.1.0 (09.11.2017): linking labels and input fields
 * version 2.0.0 (08.11.2017):
 * - remove preview functionality
 * - uses ccm v12.3.0 instead of ccm v12.2.0
 * - only one placeholder for onchange events
 * - guarantee boolean for checkbox value results
 * - add default onfinish
 * - rename config property 'initial' to 'start_values'
 * version 1.0.0 (08.11.2017)
 */

{
  var component = {

    /**
     * unique component name
     * @type {string}
     */
    name: 'teambuild_builder',

    /**
     * component version
     * @type {number[]}
     */
    version: [ 2, 3, 0 ],

    /**
     * reference to used framework version
     * @type {object}
     */
    ccm: {
      url: 'https://akless.github.io/ccm/version/ccm-12.6.0.min.js',
      integrity: 'sha384-PxEvOgcu/b5+kSoER7EvwESyJzoDskLmOIbrqSvFpM1eI135Mj3QKY+hEDvJyyl2',
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
            "class": "text-primary container-fluid",
            "inner": "Build your Realtime Team Building"
          },
          {
            "tag": "form",
            "class": "form",
            "onsubmit": "%submit%",
            "inner": [
              {
                "class": "max_teams form-group",
                "inner": [
                  {
                    "tag": "label",
                    "for": "max_teams",
                    "class": "control-label",
                    "inner": [
                      "Maximum Teams ",
                      {
                        "tag": "a",
                        "onclick": "%help%",
                        "inner": {
                          "class": "glyphicon glyphicon-info-sign"
                        }
                      },
                      {
                        "class": "alert alert-info",
                        "inner": "Here you can specify the maximum number of teams. Leave this field empty if the number of teams is to be unlimited."
                      }
                    ]
                  },
                  {
                    "tag": "input",
                    "type": "number",
                    "onchange": "%change%",
                    "class": "form-control",
                    "id": "max_teams",
                    "name": "max_teams",
                    "min": 0
                  }
                ]
              },
              {
                "class": "max_members form-group",
                "inner": [
                  {
                    "tag": "label",
                    "for": "max_members",
                    "class": "control-label",
                    "inner": [
                      "Maximum Team Members ",
                      {
                        "tag": "a",
                        "onclick": "%help%",
                        "inner": {
                          "class": "glyphicon glyphicon-info-sign"
                        }
                      },
                      {
                        "class": "alert alert-info",
                        "inner": "Here you can specify the maximum number of team members. If a team has reached the maximum number of team members, no other user can join the team. Leave this field empty if the number of team members is to be unlimited."
                      }
                    ]
                  },
                  {
                    "tag": "input",
                    "type": "number",
                    "onchange": "%change%",
                    "class": "form-control",
                    "id": "max_members",
                    "name": "max_members",
                    "min": 0
                  }
                ]
              },
              {
                "class": "text_team form-group",
                "inner": [
                  {
                    "tag": "label",
                    "for": "text_team",
                    "class": "control-label",
                    "inner": [
                      "Team Name ",
                      {
                        "tag": "a",
                        "onclick": "%help%",
                        "inner": {
                          "class": "glyphicon glyphicon-info-sign"
                        }
                      },
                      {
                        "class": "alert alert-info",
                        "inner": "Here you can specify the default name of a team. As long as a team does not have an individual name, the name given here will be displayed for the team and automatically extended by a unique team number."
                      }
                    ]
                  },
                  {
                    "tag": "input",
                    "type": "text",
                    "onchange": "%change%",
                    "class": "form-control",
                    "id": "text_team",
                    "name": "text.team",
                    "placeholder": "Enter Team Name..."
                  }
                ]
              },
              {
                "class": "text_free form-group",
                "inner": [
                  {
                    "tag": "label",
                    "for": "text_free",
                    "class": "control-label",
                    "inner": [
                      "Free Team Member Slot Label ",
                      {
                        "tag": "a",
                        "onclick": "%help%",
                        "inner": {
                          "class": "glyphicon glyphicon-info-sign"
                        }
                      },
                      {
                        "class": "alert alert-info",
                        "inner": "Here you can specify which label to use for a free member slot in a team with a limited number of members."
                      }
                    ]
                  },
                  {
                      "tag": "input",
                      "type": "text",
                      "onchange": "%change%",
                      "class": "form-control",
                      "id": "text_free",
                      "name": "text.free"
                    }
                ]
              },
              {
                "class": "icon_team form-group",
                "inner": [
                  {
                    "tag": "label",
                    "for": "icon_team",
                    "class": "control-label",
                    "inner": [
                      "Team Icon ",
                      {
                        "tag": "a",
                        "onclick": "%help%",
                        "inner": {
                          "class": "glyphicon glyphicon-info-sign"
                        }
                      },
                      {
                        "class": "alert alert-info",
                        "inner": "Here you can set the team icon. The same team icon is displayed for all teams. Click <a href='http://fontawesome.io/icons/' target='_blank'>here</a> if you want to know which icons can also be used and what their identifiers are. Leave this field blank if no team icon is to be displayed."
                      }
                    ]
                  },
                  {
                    "tag": "input",
                    "type": "text",
                    "onchange": "%change%",
                    "class": "form-control",
                    "id": "icon_team",
                    "name": "icon.team"
                  }
                ]
              },
              {
                "class": "icon_member form-group",
                "inner": [
                  {
                    "tag": "label",
                    "for": "icon_member",
                    "class": "control-label",
                    "inner": [
                      "Member Icon ",
                      {
                        "tag": "a",
                        "onclick": "%help%",
                        "inner": {
                          "class": "glyphicon glyphicon-info-sign"
                        }
                      },
                      {
                        "class": "alert alert-info",
                        "inner": "Here you can set the team member icon. The same team member icon is displayed for all team members. Click <a href='http://fontawesome.io/icons/' target='_blank'>here</a> if you want to know which icons can also be used and what their identifiers are. Leave this field blank if no team member icon is to be displayed."
                      }
                    ]
                  },
                  {
                    "tag": "input",
                    "type": "text",
                    "onchange": "%change%",
                    "class": "form-control",
                    "id": "icon_member",
                    "name": "icon.member"
                  }
                ]
              },
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
                          "Specify the sign-on mode that users must authenticate to. Authentication is the basic requirement for joining a team, leaving a team and renaming a team. Do not choose an sign-on mode if only the current state of team building is to be displayed. The various sign-on modes are described below.",
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
                            "inner": "The user can authenticate with any user name and without password. This mode is mostly used for demo scenarios."
                          },
                          {
                            "tag": "h5",
                            "inner": "H-BRS FB02"
                          },
                          {
                            "tag": "p",
                            "inner": "In this mode the user has to authenticate with a valid account of the Department of Computer Science of the Hochschule Bonn-Rhein-Sieg."
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
                        "inner": "Here you can choose between different layouts, in which the team building is then displayed."
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
                        "inner": "default",
                        "value": "['ccm.load','https://akless.github.io/ccm-components/teambuild/resources/default.css']"
                      },
                      {
                        "tag": "option",
                        "inner": "akless",
                        "value": "['ccm.load','https://akless.github.io/ccm-components/teambuild/resources/akless.css']"
                      }
                    ]
                  }
                ]
              },
              {
                "class": "names form-group",
                "inner": [
                  {
                    "tag": "label",
                    "for": "names",
                    "class": "control-label",
                    "inner": [
                      "Initial Team Names ",
                      {
                        "tag": "a",
                        "onclick": "%help%",
                        "inner": {
                          "class": "glyphicon glyphicon-info-sign"
                        }
                      },
                      {
                        "class": "alert alert-info",
                        "inner": "Here you can set initial individual team names separated by commas."
                      }
                    ]
                  },
                  {
                    "tag": "input",
                    "type": "text",
                    "onchange": "%change%",
                    "class": "form-control",
                    "id": "names",
                    "name": "names"
                  }
                ]
              },
              {
                "class": "data_store form-group",
                "inner": [
                  {
                    "tag": "label",
                    "for": "data_store",
                    "class": "control-label",
                    "inner": [
                      "App-Data Storage ",
                      {
                        "tag": "a",
                        "onclick": "%help%",
                        "inner": {
                          "class": "glyphicon glyphicon-info-sign"
                        }
                      },
                      {
                        "class": "alert alert-info",
                        "inner": "Here you can specify where the app-specific data should be stored. The app-specific data includes the current state of team building, which teams exist, which name they have, and which users belong to a team. Do not select a data store if you do not want to save this data. Team building then starts again each time with its initial state."
                      }
                    ]
                  },
                  {
                    "tag": "select",
                    "onchange": "%change%",
                    "class": "form-control",
                    "id": "data_store",
                    "name": "data.store",
                    "inner": [
                      {
                        "tag": "option",
                        "inner": "None",
                        "value": "['ccm.store']"
                      },
                      {
                        "tag": "option",
                        "inner": "Web Component Cloud (W2C)",
                        "value": "['ccm.store',{'store':'w2c_teambuild_data','url':'wss://ccm.inf.h-brs.de'}]"
                      }
                    ]
                 }
                ]
              },
              {
                "class": "data_key form-group",
                "inner": [
                  {
                    "tag": "label",
                    "for": "data_key",
                    "class": "control-label",
                    "inner": [
                      "App Identifier ",
                      {
                        "tag": "a",
                        "onclick": "%help%",
                        "inner": {
                          "class": "glyphicon glyphicon-info-sign"
                        }
                      },
                      {
                        "class": "alert alert-info",
                        "inner": "Each team building has a unique identifier for their app-specific data. Set this Identifier here."
                      }
                    ]
                  },
                  {
                    "tag": "input",
                    "type": "text",
                    "onchange": "%change%",
                    "class": "form-control",
                    "id": "data_key",
                    "name": "data.key"
                  }
                ]
              },
              {
                "class": "check-boxes form-group",
                "inner": [
                  {
                    "tag": "label",
                    "class": "control-label",
                    "inner": "Teams Can Be.."
                  },
                  {
                    "tag": "table",
                    "class": "table table-striped",
                    "inner": [
                      {
                        "tag": "tbody",
                        "inner": [
                          {
                            "tag": "tr",
                            "inner": [
                              {
                                "tag": "td",
                                "class": "col-md-3",
                                "inner": {
                                  "class": "editable_join form-inline",
                                  "inner": [
                                    {
                                      "tag": "label",
                                      "for": "editable_join",
                                      "class": "control-label",
                                      "inner": [
                                        "Joined ",
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
                                              "id": "editable_join",
                                              "name": "editable.join"
                                            }
                                          }
                                        },
                                        {
                                          "class": "alert alert-info",
                                          "inner": "Here you can choose whether authenticated users can join a team."
                                        }
                                      ]
                                    }
                                  ]
                                }
                              },
                              {
                                "tag": "td",
                                "class": "col-md-3",
                                "inner": {
                                  "class": "editable_leave form-inline",
                                  "inner": [
                                    {
                                      "tag": "label",
                                      "for": "editable_leave",
                                      "class": "control-label",
                                      "inner": [
                                        "Leaved ",
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
                                              "id": "editable_leave",
                                              "name": "editable.leave"
                                            }
                                          }
                                        },
                                        {
                                          "class": "alert alert-info",
                                          "inner": "Here you can choose whether authenticated users can leave a team."
                                        }
                                      ]
                                    }
                                  ]
                                }
                              },
                              {
                                "tag": "td",
                                "class": "col-md-3",
                                "inner": {
                                  "class": "editable_rename form-inline",
                                  "inner": [
                                    {
                                      "tag": "label",
                                      "for": "editable_rename",
                                      "class": "control-label",
                                      "inner": [
                                        "Renamed ",
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
                                              "id": "editable_rename",
                                              "name": "editable.rename"
                                            }
                                          }
                                        },
                                        {
                                          "class": "alert alert-info",
                                          "inner": "Here you can choose whether authenticated users can rename a team they belong to by clicking on the team name."
                                        }
                                      ]
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
                ]
              },
              {
                "class": "button-labels form-group",
                "inner": [
                  {
                    "tag": "label",
                    "class": "control-label",
                    "inner": "Button Labels.."
                  },
                  {
                    "tag": "table",
                    "class": "col-md-8 table table-striped",
                    "inner": [
                      {
                        "tag": "tbody",
                        "inner": [
                          {
                            "tag": "tr",
                            "inner": [
                              {
                                "tag": "td",
                                "class": "col-md-4",
                                "inner": {
                                  "class": "text_join form-group",
                                  "inner": {
                                    "tag": "input",
                                    "type": "text",
                                    "onchange": "%change%",
                                    "class": "form-control",
                                    "id": "text_join",
                                    "name": "text.join",
                                    "placeholder": "Enter Button Label..."
                                  }
                                }
                              },
                              {
                                "tag": "td",
                                "class": "col-md-4",
                                "inner":  {
                                  "class": "text_leave form-group",
                                  "inner": {
                                    "tag": "input",
                                    "type": "text",
                                    "onchange": "%change%",
                                    "class": "form-control",
                                    "id": "text_leave",
                                    "name": "text.leave",
                                    "placeholder": "Enter Button Label..."
                                  }
                                }
                              }
                            ]
                          }
                        ]
                      }
                    ]
                  }
                ]

              },
              {
                "id": "submit",
                "class": "submit-button form-group",
                "inner": {
                  "class": "col-md-12 text-right",
                  "inner": {
                    "tag": "button",
                    "type": "submit",
                    "class": "btn btn-primary",
                    "inner": "Save App"
                  }
                }
              }
            ]
          }
        ]
      },
      "css": [ "ccm.load",
        "https://tkless.github.io/ccm-components/lib/bootstrap/css/bootstrap.css",
        { "context": "head", "url": "https://tkless.github.io/ccm-components/lib/bootstrap/css/font-face.css" },
        "https://akless.github.io/ccm-components/teambuild_builder/resources/default.css"
      ],
      "submit_button": true,
      "teambuild": [ "ccm.component", "https://akless.github.io/ccm-components/teambuild/ccm.teambuild.js" ],
      "onfinish": { "log": true }

  //  start_values
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
       * is called once after the initialization and is then deleted
       * @param {function} callback - called after all synchronous and asynchronous operations are complete
       */
      this.ready = callback => {

        // set shortcut to help functions
        $ = self.ccm.helper;

        // privatize all possible instance members
        my = $.privatize( self );

        // prepare start values
        my.start_values = my.start_values ? $.toDotNotation( my.start_values ) : {};

        // consideration of the default configuration of the teambuild component for start values
        let config = $.clone( my.teambuild.config );
        delete config.ccm; delete config.html; delete config.icons; delete config.parent;
        config.css = $.encode( config.css ); config.data.store = $.encode( config.data.store );
        config = $.toDotNotation( config );
        for ( const key in config )
          if ( my.start_values[ key ] === undefined )
            my.start_values[ key ] = config[ key ];

        // no dataset identifier? => generate new identifier
        if ( !my.start_values[ 'data.key' ] ) my.start_values[ 'data.key' ] = $.generateKey();

        // guest login mode as default
        if ( !my.start_values.user ) my.start_values.user = "['ccm.instance','https://akless.github.io/ccm-components/user/versions/ccm.user-2.0.0.min.js',{'sign_on':'guest','logged_in':true}]";

        // security check for start values
        my.start_values = $.protect( my.start_values );

        callback();
      };

      /**
       * starts the instance
       * @param {function} [callback] - called after all synchronous and asynchronous operations are complete
       */
      this.start = callback => {

        // render input elements
        $.setContent( self.element, $.html( my.html, {
          submit: self.submit,
          change: () => self.onchange && self.onchange( self ),
          help: function () {
            // hide and show help texts
            const this_a = this;
            $.makeIterable( self.element.querySelectorAll( 'a' ) ).map( other_a => other_a !== this_a && other_a.classList.remove( 'active' ) );
            this.classList.toggle( 'active' );

          }
        } ) );

        // fill input elements with start values
        for ( const key in my.start_values ) {
          let element = self.element.querySelector( '[name="' + key + '"]' );
          switch ( key ) {
            // text, number
            case 'data.key':
            case 'text.team':
            case 'text.join':
            case 'text.leave':
            case 'text.free':
            case 'icon.team':
            case 'icon.member':
            case 'max_teams':
            case 'max_members':
              if ( element ) element.value = my.start_values[ key ];
              break;
            // text (comma-separated list)
            case 'names':
              if ( element ) element.value = my.start_values[ key ].join( ', ' );
              break;
            // checkbox
            case 'editable.join':
            case 'editable.leave':
            case 'editable.rename':
              if ( my.start_values[ key ] === true && element ) element.checked = true;
              break;
            // select
            case 'css':
            case 'data.store':
            case 'user':
              element = self.element.querySelector( 'select[name="' + key + '"] option[value="' + my.start_values[ key ] + '"]' );
              if ( element ) element.selected = true;
              break;
          }
        }

        // no submit button wanted? => remove submit button
        if ( !my.submit_button ) $.removeElement( self.element.querySelector( '#submit' ) );

        // rendering completed => perform callback
        if ( callback ) callback();

      };

      /** triggers the submit of the entered data */
      this.submit = event => {

        // prevent page reload
        if ( event ) event.preventDefault();

        // perform finish actions
        if ( self.onfinish ) $.onFinish( self );

      };

      /**
       * returns the entered result data
       * @returns {object} entered result data
       */
      this.getValue = () => {

        /**
         * values of the input elements
         * @type {object}
         */
        let result = $.formData( self.element.querySelector( 'form' ) );

        // convert comma-separated initial team names to array
        if ( result.names ) {
          result.names = result.names.split( ',' );
          result.names.map( ( value, i, arr ) => arr[ i ] = value.trim() );
        }

        // guarantee boolean for checkbox values
        result[ 'editable.join'   ] = !!result[ 'editable.join'   ];
        result[ 'editable.leave'  ] = !!result[ 'editable.leave'  ];
        result[ 'editable.rename' ] = !!result[ 'editable.rename' ];

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