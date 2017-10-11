/**
 * @overview ccm component for rendering a learning unit
 * @author André Kless <andre.kless@web.de> 2017
 * @license The MIT License (MIT)
 * @version 2.0.0
 * @changes
 * version 2.0.0 (26.08.2017):
 * - uses ccm v10.0.0 instead of v8.1.0
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

( function () {

  var component = {

    name: 'le',
    version: [ 2, 0, 0 ],

    ccm: {
      url: 'https://akless.github.io/ccm/version/ccm-11.1.0.min.js',
      integrity: 'sha384-JLPNKaFhjb0/a3rdhTadUNJB01aw/uBqHFx9+hGrxS8mTG8kQuszsEdnig8++LX4',
      crossorigin: 'anonymous'
    },

    config: {
      "html": {
        "wrapper": {
          "id": "wrapper",
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
      },
      "target": "_blank",
      "content": [ "ccm.component", "https://akless.github.io/ccm-components/content/versions/ccm.content-2.0.0.min.js" ]
    },

    Instance: function () {

      var self = this;
      var my;           // contains privatized instance members

      this.init = function ( callback ) {

        // no Light DOM? => use empty fragment
        if ( !self.inner ) self.inner = document.createDocumentFragment();

        // Light DOM is given as HTML string? => use fragment with HTML string as innerHTML
        if ( typeof self.inner === 'string' ) self.inner = document.createRange().createContextualFragment( self.inner );

        // do some replacements in inner HTML of own Custom Element (recursive)
        replacements( self.inner );

        callback();

        function replacements( node ) {

          self.ccm.helper.makeIterable( node.children ).map( function ( child ) {

            var figure;

            switch ( child.tagName ) {

              case 'CCM-LE-TOPIC':
                var topic = document.createElement( 'span' );
                topic.classList.add( 'topic' );
                topic.innerHTML = self.topic;
                node.replaceChild( topic, child );
                break;

              case 'CCM-LE-AUDIO':
                figure = document.createElement( 'figure' );
                figure.innerHTML = '<audio controls><source src="' + child.getAttribute( 'src' ) + '">';
                node.replaceChild( figure, child );
                break;

              case 'CCM-LE-VIDEO':
                figure = document.createElement( 'figure' );
                figure.innerHTML = '<video controls poster="' + self.video_poster + '"><source src="' + child.getAttribute( 'src' ) + '" type="video/mp4">';
                node.replaceChild( figure, child );
                break;

              case 'CCM-LE-IMG':
                figure = document.createElement( 'figure' );
                figure.innerHTML = '<img src="' + child.getAttribute( 'src' ) + '">';
                node.replaceChild( figure, child );
                break;

              case 'A':
                child.setAttribute( 'target', self.target );
                if ( !child.innerHTML ) child.innerHTML = child.getAttribute( 'href' );
                break;

              case 'CCM-LE-LINK':
                var p = document.createElement( 'p' );
                var href = child.getAttribute( 'href' );
                p.innerHTML = self.link_prefix + ' <a target="' + self.target + '" href="' + href + '">' + ( child.innerHTML ? child.innerHTML : href ) + '</a>';
                node.replaceChild( p, child );
                break;

              default:
                replacements( child );

            }

          } );

        }

      };

      this.ready = function ( callback ) {

        // privatize all possible instance members
        my = self.ccm.helper.privatize( self );

        callback();
      };

      this.start = function ( callback ) {

        var wrapper_elem = self.ccm.helper.html( my.html.wrapper, {
          logo: my.logo,
          prefix: my.topic_prefix,
          topic: my.topic
        } );

        if ( !my.topic_prefix ) {
          self.ccm.helper.removeElement( wrapper_elem.querySelector( '#prefix' ) );
          self.ccm.helper.removeElement( wrapper_elem.querySelector( 'br' ) );
        }

        if ( my.author ) {
          var footer = wrapper_elem.querySelector( 'footer' );
          if ( my.english_licence )
            footer.innerHTML = '<hr><p xmlns:dct="https://purl.org/dc/terms/"><a target="_blank" rel="license" href="https://creativecommons.org/publicdomain/zero/1.0/"><img src="http://i.creativecommons.org/p/zero/1.0/88x31.png" style="border-style: none;" alt="CC0"></a><br>To the extent possible under law, <span resource="[_:publisher]" rel="dct:publisher"><span property="dct:title">' + my.author + '</span></span> has waived all copyright and related or neighboring rights to this work.</p>';
          else
            footer.innerHTML = '<hr><p xmlns:dct="https://purl.org/dc/terms/"><a target="_blank" rel="license" href="https://creativecommons.org/publicdomain/zero/1.0/"><img src="https://i.creativecommons.org/p/zero/1.0/88x31.png" style="border-style: none;" alt="CC0"></a><br>Soweit unter den gesetzlichen Voraussetzungen möglich hat <span resource="[_:publisher]" rel="dct:publisher"><span property="dct:title">' + my.author + '</span></span> sämtliche Urheber- und Verwertungsrechte für dieses Werk abgetreten.</p>';
        }

        my.content.start( { inner: my.inner }, function ( instance ) {
          instance.element.id = 'content';
          self.ccm.helper.setContent( wrapper_elem.querySelector( 'main' ), instance.element );
          self.ccm.helper.setContent( self.element, wrapper_elem );
          if ( callback ) callback();
        } );

      };

    }

  };

  function p(){window.ccm[v].component(component)}var f="ccm."+component.name+(component.version?"-"+component.version.join("."):"")+".js";if(window.ccm&&null===window.ccm.files[f])window.ccm.files[f]=component;else{var n=window.ccm&&window.ccm.components[component.name];n&&n.ccm&&(component.ccm=n.ccm),"string"==typeof component.ccm&&(component.ccm={url:component.ccm});var v=component.ccm.url.split("/").pop().split("-");if(v.length>1?(v=v[1].split("."),v.pop(),"min"===v[v.length-1]&&v.pop(),v=v.join(".")):v="latest",window.ccm&&window.ccm[v])p();else{var e=document.createElement("script");document.head.appendChild(e),component.ccm.integrity&&e.setAttribute("integrity",component.ccm.integrity),component.ccm.crossorigin&&e.setAttribute("crossorigin",component.ccm.crossorigin),e.onload=function(){p(),document.head.removeChild(e)},e.src=component.ccm.url}}
}() );