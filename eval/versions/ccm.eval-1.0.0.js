/**
 * @overview ccm component for interpreting a given JavaScript expression
 * @author André Kless <andre.kless@web.de> 2016-2017
 * @license The MIT License (MIT)
 * @version 1.0.0
 */

( function () {

  var component = {

    name: 'eval',
    version: [ 1, 0, 0 ],

    ccm: {
      url: 'https://akless.github.io/ccm/version/ccm-10.0.0.min.js',
      integrity: 'sha384-ZydffU6kE78a9ENYcYrLr3heyn8khRFyv7IaLn3Y8GvOAHSKTwatles9brgrmJ8/',
      crossorigin: 'anonymous'
    },

    config: {

      "html": {
        "main": {
          "id": "main",
          "inner": [
            { "id": "expression" },
            {
              "id": "button",
              "inner": {
                "tag": "button",
                "inner": "Evaluate JavaScript expression",
                "onclick": "%%"
              }
            }
          ]
        }
      },
      "css": [ "ccm.load", "https://akless.github.io/ccm-components/eval/resources/default.css" ],
      "expression": '"Hello, World!"'

  //  json_parse: true,
  //  user: [ 'ccm.instance', 'https://akless.github.io/ccm-components/user/versions/ccm.user-1.0.0.min.js' ],
  //  logger: [ 'ccm.instance', 'https://akless.github.io/ccm-components/log/versions/ccm.log-1.0.0.min.js', [ 'ccm.get', 'https://akless.github.io/ccm-components/log/resources/log_configs.min.js', 'greedy' ] ],
  //  oninput: function ( instance, expression ) { console.log( expression ); },
  //  onchange: function ( instance, expression ) { console.log( expression ); },
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
        var main_elem = self.ccm.helper.html( my.html.main, onClick );

        // add text area for Javascript expression
        var textarea_elem = self.ccm.helper.html( { tag: 'textarea', inner: my.expression, oninput: onInput, onchange: onChange } );
        main_elem.querySelector( '#expression' ).appendChild( textarea_elem );

        // set content of own website area
        self.ccm.helper.setContent( self.element, main_elem );

        // has logger instance? => log start event
        if ( self.logger ) self.logger.log( 'start', my );

        if ( callback ) callback();

        /** oninput callback for text area */
        function onInput() {

          /**
           * text area value
           * @type {string}
           */
          var value = this.value;

          // has logger instance? => log input event
          if ( self.logger ) self.logger.log( 'input', value );

          // has individual input callback? => perform it
          if ( self.oninput ) self.oninput( self, value );

        }

        /** onchange callback for text area */
        function onChange() {

          /**
           * text area value
           * @type {string}
           */
          var value = this.value;

          // has logger instance? => log change event
          if ( self.logger ) self.logger.log( 'change', value );

          // has individual change callback? => perform it
          if ( self.onchange ) self.onchange( self, value );

        }

        /** onclick callback of the button */
        function onClick() {

          /**
           * text area value
           * @type {string}
           */
          var value = textarea_elem.value;

          // has user instance? => login user
          if ( self.user ) self.user.login( proceed ); else proceed();

          function proceed() {

            // prepare result data
            var results = { expression: value };
            if ( my.json_parse )
              try { results.value = JSON.parse( value ); } catch ( err ) {}
            else
              try { results.value = eval( '(' + value + ')' ); } catch ( err ) {}

            // has logger instance? => log finish event
            if ( self.logger ) self.logger.log( 'finish', results );

            // provide result data
            self.ccm.helper.onFinish( self, results );

          }

        }

      }

    }

  };

  function p(){window.ccm[v].component(component)}var f="ccm."+component.name+(component.version?"-"+component.version.join("."):"")+".js";if(window.ccm&&null===window.ccm.files[f])window.ccm.files[f]=component;else{var n=window.ccm&&window.ccm.components[component.name];n&&n.ccm&&(component.ccm=n.ccm),"string"==typeof component.ccm&&(component.ccm={url:component.ccm});var v=component.ccm.url.split("/").pop().split("-");if(v.length>1?(v=v[1].split("."),v.pop(),"min"===v[v.length-1]&&v.pop(),v=v.join(".")):v="latest",window.ccm&&window.ccm[v])p();else{var e=document.createElement("script");document.head.appendChild(e),component.ccm.integrity&&e.setAttribute("integrity",component.ccm.integrity),component.ccm.crossorigin&&e.setAttribute("crossorigin",component.ccm.crossorigin),e.onload=function(){p(),document.head.removeChild(e)},e.src=component.ccm.url}}
}() );