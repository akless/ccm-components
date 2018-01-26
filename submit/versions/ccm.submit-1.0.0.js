/**
 * @overview ccm component for submitting data
 * @author André Kless <andre.kless@web.de> 2017
 * @license The MIT License (MIT)
 * @version 1.0.0
 */

{
  var component  = {

    /**
     * unique component name
     * @type {string}
     */
    name: 'submit',

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

      "data": { "store": [ "ccm.store" ] }

  //  "content": [ "ccm.component", "https://akless.github.io/ccm-components/content/ccm.content.js" ],
  //  "inner": ...,
  //  "user":   [ 'ccm.instance', 'https://akless.github.io/ccm-components/user/versions/ccm.user-2.0.0.min.js' ],
  //  "logger": [ 'ccm.instance', 'https://akless.github.io/ccm-components/log/versions/ccm.log-1.0.0.min.js', [ 'ccm.get', 'https://akless.github.io/ccm-components/log/resources/configs.min.js', 'greedy' ] ],
  //  "onfinish": { "log": true }

    },

    /**
     * for creating instances of this component
     * @constructor
     */
    Instance: function () {

      /**
       * own reference for inner functions
       * @type {Instance}
       */
      let self = this;

      /**
       * privatized instance members
       * @type {object}
       */
      let my;

      /**
       * shortcut to help functions
       * @type {Object}
       */
      let $;

      /**
       * contains collected data for each ccm-based input element
       * @type {object[]}
       */
      const inputs = [];

      /**
       * is called once after the initialization and is then deleted
       * @param {function} callback - called after all synchronous and asynchronous operations are complete
       */
      this.ready = callback => {

        // set shortcut to help functions
        $ = self.ccm.helper;

        // privatize all possible instance members
        my = $.privatize( self );

        // no given Light DOM? => abort
        if ( !my.inner ) return callback();

        // iterate all input elements
        [ ...my.inner.querySelectorAll( 'input' ) ].map( input => {

          const type = input.getAttribute( 'type' );
          switch ( type ) {
            case 'button':
            case 'checkbox':
            case 'color':
            case 'date':
            case 'datetime-local':
            case 'email':
            case 'file':
            case 'hidden':
            case 'image':
            case 'month':
            case 'number':
            case 'password':
            case 'radio':
            case 'range':
            case 'reset':
            case 'search':
            case 'submit':
            case 'tel':
            case 'text':
            case 'time':
            case 'url':
            case 'week':
              break; // do not touch standard HTML input elements

            default: // manage ccm-based input elements

              // check whether there is a dependent subcomponent in this config for this input type
              if ( !my[ type ] ) return;

              // create a loading symbol
              let loading = $.loading( self );

              // remember this loading element, the type und the name of this input element
              inputs.push( {
                elem: loading,
                type: type,
                name: input.name
              } );

              // replace input element with the loading symbol
              input.parentNode.replaceChild( loading, input );

          }

        } );

        // should events be logged? => log ready event
        self.logger && self.logger.log( 'ready', ( () => {
          const data = $.clone( my );
          if ( data.data && data.data.store ) data.data.store = data.data.store.source();
          return data;
        } )() );

        callback();
      };

      /**
       * starts the instance
       * @param {function} [callback] - called after all synchronous and asynchronous operations are complete
       */
      this.start = callback => {

        // no given Light DOM? => abort
        if ( !my.inner ) { callback && callback(); return; }

        // has given content component? => process the Light DOM via the content component
        if ( my.content ) my.content.start( { inner: my.inner }, proceed ); else proceed();

        /** @param {Instance} content - ccm instance of content component */
        function proceed( content ) {

          // put LightDOM into ShadowDOM
          $.setContent( self.element, content ? content.root : my.inner );

          /**
           * contains the Light DOM and thus also the input elements
           * @type {Element}
           */
          const element = content ? content.element : self.element;

          // prepare submit button
          let submit = element.querySelector( '#submit' );
          const button = $.html( { tag: 'input', type: 'submit', id: 'submit' } );
          if ( !submit ) { element.appendChild( button ); submit = button; }

          // submit button is disabled until all subcomponents are ready
          submit.disabled = true;

          // set click event for submit button
          submit.addEventListener( 'click', function ( event ) {

            // submit button of a HTML form? => prevent page reload
            event && event.preventDefault();

            // has user instance? => login user (if not already logged in)
            if ( self.user ) self.user.login( proceed ); else proceed();

            function proceed() {

              /**
               * result data
               * @type {object}
               */
              const results = $.formData( element );  // fetch values from HTML input elements

              // fetch values from ccm-based input elements (convention: ccm instance must have a 'getValue()' interface)
              inputs.map( input => results[ input.name ] = input.instance.getValue() );

              // should events be logged? => log submit event
              if ( self.logger ) self.logger.log( 'submit', results );

              // perform 'finish' actions and provide result data
              self.onfinish && $.onFinish( self, results );

            }

          } );

          // get start values for input elements
          $.dataset( my.data, dataset => {

            // should events be logged? => log start event
            if ( self.logger ) self.logger.log( 'start', dataset );

            // fill input elements with the start values
            $.fillForm( element, dataset );

            /**
             * counter for parallel asynchronous operations
             * @type {number}
             */
            let counter = 1;

            // iterate over all collected data for ccm-based input elements
            inputs.map( input => {

              // start of a new asynchron operation => increment counter
              counter++;

              // create and start a ccm instance for each ccm-based input element
              my[ input.type ].start( { 'data.key': dataset.key + '_' + input.name }, instance => {

                // add instance to collected data of this ccm-based input element
                input.instance = instance;

                // replace loading symbol with the instance content
                input.elem.parentNode.replaceChild( instance.root, input.elem );

                // check if this was the last asynchronous operation
                check();

              } );

            } );

            // check if no asynchronous operations were started
            check();

            /** check if all started asynchronous operations have been completed */
            function check() {

              // a asynchronous operation is finished => decrease counter
              counter--;

              // another started asynchronous operations is not finished yet? => abort
              if ( counter > 0 ) return;

              // submit button is enabled when all ccm-based input elements are ready
              submit.disabled = false;

              // rendering completed => perform callback
              callback && callback();

            }

          } );

        }

      };

    }

  };

  function p(){window.ccm[v].component(component)}const f="ccm."+component.name+(component.version?"-"+component.version.join("."):"")+".js";if(window.ccm&&null===window.ccm.files[f])window.ccm.files[f]=component;else{const n=window.ccm&&window.ccm.components[component.name];n&&n.ccm&&(component.ccm=n.ccm),"string"===typeof component.ccm&&(component.ccm={url:component.ccm});var v=component.ccm.url.split("/").pop().split("-");if(v.length>1?(v=v[1].split("."),v.pop(),"min"===v[v.length-1]&&v.pop(),v=v.join(".")):v="latest",window.ccm&&window.ccm[v])p();else{const e=document.createElement("script");document.head.appendChild(e),component.ccm.integrity&&e.setAttribute("integrity",component.ccm.integrity),component.ccm.crossorigin&&e.setAttribute("crossorigin",component.ccm.crossorigin),e.onload=function(){p(),document.head.removeChild(e)},e.src=component.ccm.url}}
}