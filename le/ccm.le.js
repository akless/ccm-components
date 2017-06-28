/**
 * @overview ccm component for rendering a learning unit
 * @author André Kless <andre.kless@web.de> 2017
 * @license The MIT License (MIT)
 */

( function () {

  var ccm_version = '8.1.0';
  var ccm_url     = 'https://akless.github.io/ccm/version/ccm-8.1.0.min.js';

  var component_name = 'le';
  var component_obj  = {

    name: component_name,

    config: {
      css_file: 'https://akless.github.io/akless/we/css/le.css',
      font: 'https://akless.github.io/ccm-components/libs/weblysleekui/font.css',
      logo_file: 'https://akless.github.io/akless/we/image/logo.png',
      poster_file: 'https://akless.github.io/akless/we/image/poster.jpg',
      content: [ 'ccm.component', 'https://akless.github.io/ccm-components/content/ccm.content.min.js' ],
      topic_prefix: 'Lerneinheit:',
      link_prefix: 'Link: ',
      author: 'André Kless'
    },

    Instance: function () {

      var self = this;
      var my;           // contains privatized instance members

      this.init = function ( callback ) {

        // show loading icon until rendering is finished
        self.ccm.helper.hide( self );

        // no container for inner HTML of own ccm Custom Element? => use empty container
        if ( !self.node ) self.node = document.createElement( 'div' );

        // inner HTML of own ccm Custom Element is given via 'innerHTML' config property? => use it with higher priority
        if ( self.innerHTML ) self.node.innerHTML = self.innerHTML;

        // do some replacements in inner HTML of own Custom Element
        recursive( self.node );

        // remove no more needed config properties
        delete self.innerHTML; delete self.poster_file; delete self.link_prefix;

        callback();

        function recursive( node ) {

          self.ccm.helper.makeIterable( node.children ).map( function ( child ) {

            var figure;

            switch ( child.tagName ) {

              case 'CCM-LE-TOPIC':
                var topic = document.createElement( 'span' );
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
                figure.innerHTML = '<video controls poster="' + self.poster_file + '"><source src="' + child.getAttribute( 'src' ) + '" type="video/mp4">';
                node.replaceChild( figure, child );
                break;

              case 'CCM-LE-IMG':
                figure = document.createElement( 'figure' );
                figure.innerHTML = '<img src="' + child.getAttribute( 'src' ) + '">';
                node.replaceChild( figure, child );
                break;

              case 'A':
                child.setAttribute( 'target', '_blank' );
                if ( !child.innerHTML ) child.innerHTML = child.getAttribute( 'href' );
                break;

              case 'CCM-LE-LINK':
                var p = document.createElement( 'p' );
                var href = child.getAttribute( 'href' );
                p.innerHTML = self.link_prefix + '<a target="_blank" href="' + href + '">' + ( child.innerHTML ? child.innerHTML : href ) + '</a>';
                node.replaceChild( p, child );
                break;

              default:
                recursive( child );

            }

          } );

        }

      };

      this.ready = function ( callback ) {

        // privatize all possible instance members
        my = self.ccm.helper.privatize( self );

        // add header
        var header = document.createElement( 'header' );
        if ( my.logo_file ) header.innerHTML += '<img src="' + my.logo_file + '">';
        if ( my.topic ) header.innerHTML += '<h1>' + ( my.topic_prefix ? '<span class="prefix">' + my.topic_prefix + '</span><br>' : '' ) + '<span class="topic">' + my.topic + '</span></h1>';
        if ( header.innerHTML ) my.node.insertBefore( header, my.node.firstChild );
        delete my.logo_file; delete my.topic_prefix; delete my.topic;

        // add footer
        if ( my.author ) {
          var footer = document.createElement( 'footer' );
          footer.innerHTML = '<hr><p xmlns:dct="https://purl.org/dc/terms/"><a rel="license" href="https://creativecommons.org/publicdomain/zero/1.0/"><img src="https://i.creativecommons.org/p/zero/1.0/88x31.png" style="border-style: none;" alt="CC0"></a><br>Soweit unter den gesetzlichen Voraussetzungen möglich hat <span resource="[_:publisher]" rel="dct:publisher"><span property="dct:title">' + my.author + '</span></span> sämtliche Urheber- und Verwertungsrechte für dieses Werk abgetreten.</p>';
          my.node.appendChild( footer );
          delete my.author;
        }

        // hand over inner HTML of own Custom Element to an new content instance
        my.content.instance( {
          css_layout: my.css_file ? [ 'ccm.load', my.css_file ] : undefined,
          element: self.element,
          node: my.node
        }, function ( instance ) {
          my.content = instance;
          delete my.css_file;
          callback();
        } );

      };

      this.start = function ( callback ) {

        // render content
        my.content.start( function () {

          // replace loading icon with hidden rendered content
          self.ccm.helper.show( self );

          if ( callback ) callback();
        } );

      };

    }

  };

  var namespace = window.ccm && ccm.components[ component_name ]; if ( namespace ) { if ( namespace.ccm_version ) ccm_version = namespace.ccm_version; if ( namespace.ccm_url ) ccm_url = namespace.ccm_url; }
  if ( !window.ccm || !ccm[ ccm_version ] ) { var tag = document.createElement( 'script' ); document.head.appendChild( tag ); tag.onload = register; tag.src = ccm_url; } else register();
  function register() { ccm[ ccm_version ].component( component_obj ); }
}() );