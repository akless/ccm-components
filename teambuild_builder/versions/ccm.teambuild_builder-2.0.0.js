/**
 * @overview ccm component for building a realtime team building
 * @author André Kless <andre.kless@web.de>, 2017
 * @license The MIT License (MIT)
 * @version 2.0.0
 * @changes
 * version 2.0.0 (08.11.2017):
 * - remove preview functionality
 * - uses ccm v12.3.0 instead of ccm v12.2.0
 * - only one placeholder for onchange events
 * - guarantee boolean for checkbox value results
 * - add default onfinish
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
    version: [ 2, 0, 0 ],

    /**
     * reference to used framework version
     * @type {object}
     */
    ccm: {
      url: 'https://akless.github.io/ccm/version/ccm-12.3.0.min.js',
      integrity: 'sha384-QDTsj+8+DFAUnDU9pBA3NPuJAolurZFVCt3MAZF2a8upsHCKxA9uEKMvIQh6j7Xe',
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
            "inner": "Build your Realtime Team Building"
          },
          {
            "tag": "form",
            "class": "form-horizontal",
            "onsubmit": "%submit%",
            "inner": [
              {
                "class": "max_teams form-group",
                "inner": [
                  {
                    "tag": "label",
                    "class": "control-label col-md-2",
                    "inner": "Maximum Teams:"
                  },
                  {
                    "class": "col-md-10",
                    "inner": {
                      "tag": "input",
                      "type": "number",
                      "onchange": "%change%",
                      "class": "form-control",
                      "name": "max_teams",
                      "min": 0
                    }
                  }
                ]
              },
              {
                "class": "max_members form-group",
                "inner": [
                  {
                    "tag": "label",
                    "class": "control-label col-md-2",
                    "inner": "Maximum Team Members:"
                  },
                  {
                    "class": "col-md-10",
                    "inner": {
                      "tag": "input",
                      "type": "number",
                      "onchange": "%change%",
                      "class": "form-control",
                      "name": "max_members",
                      "min": 0
                    }
                  }
                ]
              },
              {
                "class": "editable_join form-group",
                "inner": [
                  {
                    "tag": "label",
                    "class": "control-label col-md-2",
                    "inner": "Joinable Teams:"
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
                          "name": "editable.join"
                        }
                      }
                    }
                  }
                ]
              },
              {
                "class": "editable_leave form-group",
                "inner": [
                  {
                    "tag": "label",
                    "class": "control-label col-md-2",
                    "inner": "Leaveable Teams:"
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
                          "name": "editable.leave"
                        }
                      }
                    }
                  }
                ]
              },
              {
                "class": "editable_rename form-group",
                "inner": [
                  {
                    "tag": "label",
                    "class": "control-label col-md-2",
                    "inner": "Renameable Teams:"
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
                          "name": "editable.rename"
                        }
                      }
                    }
                  }
                ]
              },
              {
                "class": "text_team form-group",
                "inner": [
                  {
                    "tag": "label",
                    "class": "control-label col-md-2",
                    "inner": "Default Team Name:"
                  },
                  {
                    "class": "col-md-10",
                    "inner": {
                      "tag": "input",
                      "type": "text",
                      "onchange": "%change%",
                      "class": "form-control",
                      "name": "text.team"
                    }
                  }
                ]
              },
              {
                "class": "text_join form-group",
                "inner": [
                  {
                    "tag": "label",
                    "class": "control-label col-md-2",
                    "inner": "Join Button Caption:"
                  },
                  {
                    "class": "col-md-10",
                    "inner": {
                      "tag": "input",
                      "type": "text",
                      "onchange": "%change%",
                      "class": "form-control",
                      "name": "text.join"
                    }
                  }
                ]
              },
              {
                "class": "text_leave form-group",
                "inner": [
                  {
                    "tag": "label",
                    "class": "control-label col-md-2",
                    "inner": "Leave Button Caption:"
                  },
                  {
                    "class": "col-md-10",
                    "inner": {
                      "tag": "input",
                      "type": "text",
                      "onchange": "%change%",
                      "class": "form-control",
                      "name": "text.leave"
                    }
                  }
                ]
              },
              {
                "class": "text_free form-group",
                "inner": [
                  {
                    "tag": "label",
                    "class": "control-label col-md-2",
                    "inner": "Free Team Member Slot Label:"
                  },
                  {
                    "class": "col-md-10",
                    "inner": {
                      "tag": "input",
                      "type": "text",
                      "onchange": "%change%",
                      "class": "form-control",
                      "name": "text.free"
                    }
                  }
                ]
              },
              {
                "class": "icon_team form-group",
                "inner": [
                  {
                    "tag": "label",
                    "class": "control-label col-md-2",
                    "inner": "Team Icon:"
                  },
                  {
                    "class": "col-md-10",
                    "inner": {
                      "tag": "input",
                      "type": "text",
                      "onchange": "%change%",
                      "class": "form-control",
                      "name": "icon.team"
                    }
                  }
                ]
              },
              {
                "class": "icon_member form-group",
                "inner": [
                  {
                    "tag": "label",
                    "class": "control-label col-md-2",
                    "inner": "Member Icon:"
                  },
                  {
                    "class": "col-md-10",
                    "inner": {
                      "tag": "input",
                      "type": "text",
                      "onchange": "%change%",
                      "class": "form-control",
                      "name": "icon.member"
                    }
                  }
                ]
              },
              {
                "class": "user form-group",
                "inner": [
                  {
                    "tag": "label",
                    "class": "control-label col-md-2",
                    "inner": "Sign-on:"
                  },
                  {
                    "class": "col-md-10",
                    "inner": {
                      "tag": "select",
                      "onchange": "%change%",
                      "class": "form-control",
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
                          "value": "['ccm.instance','https://akless.github.io/ccm-components/user/versions/ccm.user-2.0.0.min.js',{'sign_on':'guest','logged_in':true}]"
                        },
                        {
                          "tag": "option",
                          "inner": "Demo Mode",
                          "value": "['ccm.instance','https://akless.github.io/ccm-components/user/versions/ccm.user-2.0.0.min.js',{'sign_on':'demo','logged_in':true}]"
                        },
                        {
                          "tag": "option",
                          "inner": "H-BRS FB02",
                          "value": "['ccm.instance','https://akless.github.io/ccm-components/user/versions/ccm.user-2.0.0.min.js',{'sign_on':'hbrsinfkaul','logged_in':true}]"
                        }
                      ]
                    }
                  }
                ]
              },
              {
                "class": "css form-group",
                "inner": [
                  {
                    "tag": "label",
                    "class": "control-label col-md-2",
                    "inner": "Layout:"
                  },
                  {
                    "class": "col-md-10",
                    "inner": {
                      "tag": "select",
                      "onchange": "%change%",
                      "class": "form-control",
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
                  }
                ]
              },
              {
                "class": "names form-group",
                "inner": [
                  {
                    "tag": "label",
                    "class": "control-label col-md-2",
                    "inner": "Initial Team Names:"
                  },
                  {
                    "class": "col-md-10",
                    "inner": {
                      "tag": "input",
                      "type": "text",
                      "onchange": "%change%",
                      "class": "form-control",
                      "name": "names"
                    }
                  }
                ]
              },
              {
                "class": "data_store form-group",
                "inner": [
                  {
                    "tag": "label",
                    "class": "control-label col-md-2",
                    "inner": "Where to store app-specific data:"
                  },
                  {
                    "class": "col-md-10",
                    "inner": {
                      "tag": "select",
                      "onchange": "%change%",
                      "class": "form-control",
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
                  }
                ]
              },
              {
                "class": "data_key form-group",
                "inner": [
                  {
                    "tag": "label",
                    "class": "control-label col-md-2",
                    "inner": "Identifier for app-specific data:"
                  },
                  {
                    "class": "col-md-10",
                    "inner": {
                      "tag": "input",
                      "type": "text",
                      "onchange": "%change%",
                      "class": "form-control",
                      "name": "data.key"
                    }
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
      "css": [ "ccm.load", "https://tkless.github.io/ccm-components/lib/bootstrap/css/bootstrap.css", { "context": "head", "url": "https://tkless.github.io/ccm-components/lib/bootstrap/css/font-face.css" } ],
      "submit_button": true,
      "teambuild": [ "ccm.component", "https://akless.github.io/ccm-components/teambuild/versions/ccm.teambuild-1.0.1.min.js" ],
      "onfinish": { "log": true }
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
      var self = this;

      /**
       * privatized instance members
       * @type {object}
       */
      var my;

      /**
       * shortcut to help functions
       * @type {Object.<string,function>}
       */
      var $;

      /**
       * is called once after the initialization and is then deleted
       * @param {function} callback - called after all synchronous and asynchronous operations are complete
       */
      this.ready = callback => {

        // set shortcut to help functions
        $ = self.ccm.helper;

        // privatize all possible instance members
        my = $.privatize( self );

        // prepare initial input values
        my.initial = my.initial ? $.toDotNotation( my.initial ) : {};

        // consideration of the default configuration of the teambuild component for initial input values
        let config = $.clone( my.teambuild.config );
        delete config.ccm; delete config.html; delete config.icons; delete config.parent;
        config.css = $.encode( config.css ); config.data.store = $.encode( config.data.store );
        config = $.toDotNotation( config );
        for ( const key in config )
          if ( my.initial[ key ] === undefined )
            my.initial[ key ] = config[ key ];

        // no dataset identifier? => generate new identifier
        if ( !my.initial[ 'data.key' ] ) my.initial[ 'data.key' ] = $.generateKey();

        // guest login mode as default
        if ( !my.initial.user ) my.initial.user = "['ccm.instance','https://akless.github.io/ccm-components/user/versions/ccm.user-2.0.0.min.js',{'sign_on':'guest','logged_in':true}]";

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
          change: () => self.onchange && self.onchange( self, getResultData() )
        } ) );

        // fill input elements with initial values
        for ( const key in my.initial ) {
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
              if ( element ) element.value = my.initial[ key ];
              break;
            // text (comma-separated list)
            case 'names':
              if ( element ) element.value = my.initial[ key ].join( ', ' );
              break;
            // checkbox
            case 'editable.join':
            case 'editable.leave':
            case 'editable.rename':
              if ( my.initial[ key ] === true && element ) element.checked = true;
              break;
            // select
            case 'css':
            case 'data.store':
            case 'user':
              element = self.element.querySelector( 'select[name="' + key + '"] option[value="' + my.initial[ key ] + '"]' );
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
        if ( self.onfinish ) $.onFinish( self, getResultData() );

      };

      /**
       * returns the entered result data
       * @returns {object} entered result data
       */
      function getResultData() {

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

      }

    }

  };

  function p(){window.ccm[v].component(component)}const f="ccm."+component.name+(component.version?"-"+component.version.join("."):"")+".js";if(window.ccm&&null===window.ccm.files[f])window.ccm.files[f]=component;else{const n=window.ccm&&window.ccm.components[component.name];n&&n.ccm&&(component.ccm=n.ccm),"string"==typeof component.ccm&&(component.ccm={url:component.ccm});var v=component.ccm.url.split("/").pop().split("-");if(v.length>1?(v=v[1].split("."),v.pop(),"min"===v[v.length-1]&&v.pop(),v=v.join(".")):v="latest",window.ccm&&window.ccm[v])p();else{const e=document.createElement("script");document.head.appendChild(e),component.ccm.integrity&&e.setAttribute("integrity",component.ccm.integrity),component.ccm.crossorigin&&e.setAttribute("crossorigin",component.ccm.crossorigin),e.onload=function(){p(),document.head.removeChild(e)},e.src=component.ccm.url}}
}