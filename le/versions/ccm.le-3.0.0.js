/**
 * @overview ccm component for rendering a learning unit
 * @author André Kless <andre.kless@web.de> 2017
 * @license The MIT License (MIT)
 * @version 3.0.0
 * @changes
 * version 3.0.0 (12.12.2017):
 * - uses ECMAScript 6
 * - uses ccm v12.9.0
 * - shorter names for component specific inner HTML elements
 * - more config properties are optional
 * - renaming of config properties
 * version 2.0.0 (26.08.2017):
 * - uses ccm v11.5.0 instead of v8.1.0
 * - changes instance configuration
 * - changes in HTML templates
 * - changes in kind of reusing ccm.content.js
 * - hide and show mechanism removed
 * - no deletion of no more needed properties
 * - use fragment instead of empty container as default Light DOM
 * - Light DOM can be given as HTML string via 'inner' config property
 * - removed no more needed ccm.helper.protect calls
 * version 1.0.0 (10.08.2017)
 */

{
  var component = {

    /**
     * unique component name
     * @type {string}
     */
    name: 'le',

    /**
     * component version
     * @type {number[]}
     */
    version: [ 3, 0, 0 ],

    /**
     * reference to used framework version
     * @type {object}
     */
    ccm: {
      url: 'https://akless.github.io/ccm/version/ccm-12.9.0.min.js',
      integrity: 'sha384-ww+RYBFW74Fi2/MBrci+QDLBidQSDdHeKYFA3QqEBnFEOXG/oMsJdYgDYP6fVejr',
      crossorigin: 'anonymous'
    },

    /**
     * default instance configuration
     * @type {object}
     */
    config: {

      "html": {
        "inner": [
          {
            "tag": "header",
            "inner": [
              {
                "id": "logo",
                "inner": {
                  "tag": "img",
                  "src": "%logo%"
                }
              },
              {
                "id": "trailer",
                "inner": {
                  "tag": "h1",
                  "inner": [
                    {
                      "tag": "span",
                      "id": "prefix",
                      "inner": "%prefix%"
                    },
                    { "tag": "br" },
                    {
                      "tag": "span",
                      "id": "topic",
                      "inner": "%topic%"
                    }
                  ]
                }
              }
            ]
          },
          { "tag": "main" },
          { "tag": "footer" }
        ]
      }

  //  "css": [ "ccm.load", "https://akless.github.io/ccm-components/le/resources/weblysleek.css", { "context": "head", "url": "https://akless.github.io/ccm-components/libs/weblysleekui/font.css" } ],
  //  "wrapper": [ "ccm.component", "https://akless.github.io/ccm-components/content/ccm.content.js" ],
  //  "content": "Hello, World!",
  //  "logo": "https://akless.github.io/akless/we/logo.png",
  //  "topic": "Title of Learning Unit",
  //  "topic_prefix": "Learning Unit:",
  //  "video_poster": "https://akless.github.io/akless/we/poster.jpg",
  //  "link_prefix": "Link:",
  //  "link_target": "_blank",
  //  "author": "John Doe"

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
       * is called once after all dependencies are solved and is then deleted
       * @param {function} callback - called after all synchronous and asynchronous operations are complete
       */
      this.init = callback => {

        // set shortcut to help functions
        $ = self.ccm.helper;

        // has Light DOM? => use it for learning unit content (with higher priority)
        if ( self.inner ) self.content = self.inner;

        // turn the content into HTML elements
        self.content = $.html( self.content );

        callback();
      };

      /**
       * is called once after the initialization and is then deleted
       * @param {function} callback - called after all synchronous and asynchronous operations are complete
       */
      this.ready = callback => {

        // privatize all possible instance members
        my = $.privatize( self );

        // do some replacements in content
        replacements( my.content );

        callback();

        /**
         * does some replacements in learning unit content (recursive)
         * @param {Element} node
         */
        function replacements( node ) {

          // iterate over all child HTML elements
          [ ...node.children ].map( child => {

            /**
             * <figure>
             * @types {Element}
             */
            let figure;

            // check name of the HTML element
            switch ( child.tagName ) {

              // support <topic> for insertion of learning unit topic
              case 'TOPIC':
                const topic = document.createElement( 'span' );
                topic.classList.add( 'topic' );
                topic.innerHTML = my.topic;
                $.replace( topic, child );
                break;

              // support <audio src=''> as shortcut for an audio element
              case 'AUDIO':
                if ( !child.getAttribute( 'src' ) ) break;
                figure = document.createElement( 'figure' );
                figure.innerHTML = '<audio controls><source src="' + child.getAttribute( 'src' ) + '">';
                $.replace( figure, child );
                break;

              // support <video src=''> as shortcut for a video element
              case 'VIDEO':
                if ( !child.getAttribute( 'src' ) ) break;
                figure = document.createElement( 'figure' );
                figure.innerHTML = '<video controls' + ( my.video_poster ? ' poster="' + my.video_poster + '"' : '' ) + '><source src="' + child.getAttribute( 'src' ) + '" type="video/mp4">';
                $.replace( figure, child );
                break;

              // wrap images with <figure>
              case 'IMG':
                figure = document.createElement( 'figure' );
                figure.innerHTML = '<img src="' + child.getAttribute( 'src' ) + '">';
                $.replace( figure, child );
                break;

              // enrich hyperlinks
              case 'A':
                // set value for 'target' attribute of hyperlinks
                if ( my.link_target && !child.getAttribute( 'target' ) ) child.setAttribute( 'target', my.link_target );
                // hyperlink has no text? => use URL as text
                if ( !child.innerHTML ) child.innerHTML = child.getAttribute( 'href' );
                break;

              // shortcut for a text line with a hyperlink
              case 'LINK':
                const p = document.createElement( 'p' );
                const href = child.getAttribute( 'href' );
                p.innerHTML = my.link_prefix + ' <a target="' + my.link_target + '" href="' + href + '">' + ( child.innerHTML ? child.innerHTML : href ) + '</a>';
                $.replace( p, child );
                break;

              // do replacements also for deeper HTML elements
              default:
                replacements( child );  // recursive call

            }

          } );

        }

      };

      /**
       * starts the instance
       * @param {function} [callback] - called after all synchronous and asynchronous operations are complete
       */
      this.start = callback => {

        /**
         * HTML structure for own website area
         * @type {Element}
         */
        let element = $.html( my.html, { logo: my.logo, prefix: my.topic_prefix, topic: my.topic } );

        // topic of the learning unit has no prefix? => remove HTML elements for topic prefix
        if ( !my.topic_prefix ) {
          $.removeElement( element.querySelector( '#prefix' ) );
          $.removeElement( element.querySelector( 'br' ) );
        }

        // prepare main content
        $.setContent( element.querySelector( 'main' ), my.content );

        // has name of an author? => add licence statement
        if ( my.author ) {
          my.author = $.protect( my.author );
          const footer = element.querySelector( 'footer' );
          if ( my.english_licence )
            footer.innerHTML = '<hr><p xmlns:dct="https://purl.org/dc/terms/"><a target="_blank" rel="license" href="https://creativecommons.org/publicdomain/zero/1.0/"><img src="https://i.creativecommons.org/p/zero/1.0/88x31.png" style="border-style: none;" alt="CC0"></a><br>To the extent possible under law, <span resource="[_:publisher]" rel="dct:publisher"><span property="dct:title">' + my.author + '</span></span> has waived all copyright and related or neighboring rights to this work.</p>';
          else
            footer.innerHTML = '<hr><p xmlns:dct="https://purl.org/dc/terms/"><a target="_blank" rel="license" href="https://creativecommons.org/publicdomain/zero/1.0/"><img src="https://i.creativecommons.org/p/zero/1.0/88x31.png" style="border-style: none;" alt="CC0"></a><br>Soweit unter den gesetzlichen Voraussetzungen möglich hat <span resource="[_:publisher]" rel="dct:publisher"><span property="dct:title">' + my.author + '</span></span> sämtliche Urheber- und Verwertungsrechte für dieses Werk abgetreten.</p>';
        }

        // has wrapper instance? => use it to render the main content
        if ( my.wrapper )
          my.wrapper.start( { inner: element }, proceed );
        else
          proceed();

        function proceed( wrapper ) {

          // set content of own website area
          $.setContent( self.element, wrapper ? wrapper.root : element );

          // startup completed => perform callback
          callback && callback();

        }

      };

    }

  };

  function p(){window.ccm[v].component(component)}const f="ccm."+component.name+(component.version?"-"+component.version.join("."):"")+".js";if(window.ccm&&null===window.ccm.files[f])window.ccm.files[f]=component;else{const n=window.ccm&&window.ccm.components[component.name];n&&n.ccm&&(component.ccm=n.ccm),"string"==typeof component.ccm&&(component.ccm={url:component.ccm});var v=component.ccm.url.split("/").pop().split("-");if(v.length>1?(v=v[1].split("."),v.pop(),"min"===v[v.length-1]&&v.pop(),v=v.join(".")):v="latest",window.ccm&&window.ccm[v])p();else{const e=document.createElement("script");document.head.appendChild(e),component.ccm.integrity&&e.setAttribute("integrity",component.ccm.integrity),component.ccm.crossorigin&&e.setAttribute("crossorigin",component.ccm.crossorigin),e.onload=function(){p(),document.head.removeChild(e)},e.src=component.ccm.url}}
}