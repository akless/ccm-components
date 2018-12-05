/**
 * @overview ccm component for flying windows
 * @author André Kless <andre.kless@web.de> 2018
 * @license The MIT License (MIT)
 * @version latest (1.0.0)
 * @changes
 * version 1.0.0 (03.09.2018)
 */

( function () {

  const component = {

    name: 'window',

    ccm: '../../ccm/ccm.js',

    config: {

      "html": {
        "window": {
          "id": "window",
          "inner": [
            {
              "id": "head",
              "inner": [
                {
                  "id": "draggable",
                  "inner": {
                    "id": "title",
                    "inner": "%title%"
                  }
                },
                {
                  "id": "menu",
                  "inner": [
                    {
                      "id": "compact",
                      "class": "icon",
                      "inner": "&#9900;",
                      "onclick": "%compact%"
                    },
                    {
                      "id": "fullscreen",
                      "class": "icon",
                      "inner": "&#10530;",
                      "onclick": "%fullscreen%"
                    },
                    {
                      "id": "link",
                      "class": "icon",
                      "inner": "&#43;",
                      "tag": "a",
                      "href": "%booklet%"
                    },
                    {
                      "id": "close",
                      "class": "icon",
                      "inner": "&#215;",
                      "onclick": "%close%"
                    }
                  ]
                }
              ]
            },
            { "id": "body" }
          ]
        },
        "compact": {
          "id": "compact",
          "inner": [
            {
              "id": "icon",
              "inner": {
                "tag": "img",
                "src": "%icon%"
              }
            },
            {
              "id": "title",
              "inner": {
                "inner": "%title%",
                "title": "%title%"
              }
            }
          ]
        }
      },
      "css": [ "ccm.load", "https://ccmjs.github.io/akless-components/window/resources/default.css" ],
      "icon": "https://ccmjs.github.io/digital-maker-space/dms/resources/component.png"

  //  "app": [ "ccm.instance", "https://ccmjs.github.io/akless-components/blank/ccm.blank.js" ],
  //  "title": "My App Title",
  //  "compact": true,
  //  "hidden": true,
  //  "flying": true

    },

    Instance: function () {

      let $;

      this.init = async () => {

        // set shortcut to help functions
        $ = this.ccm.helper;

        // remove no more needed script element
        if ( this.component.url ) {
          const element = document.head.querySelector( 'script[src="' + this.component.url + '"]' );
          element && $.removeElement( element );
        }

      };

      this.ready = async () => {};

      this.start = async () => {

        const self = this;
        return ( this.compact ? renderCompact : renderWindow )();

        /** renders flying window */
        async function renderWindow() {

          // render window
          $.setContent( self.element, $.html( self.html.window, {
            title: $.escapeHTML( self.title || ( self.app && self.app.component.index ) || '' ),
            compact: renderCompact,
            fullscreen: () => {
              const elem = self.element.querySelector( '#body' );
              if ( elem.requestFullscreen )
                elem.requestFullscreen();
              else if ( elem.mozRequestFullScreen )    /* Firefox */
                elem.mozRequestFullScreen();
              else if ( elem.webkitRequestFullscreen ) /* Chrome, Safari and Opera */
                elem.webkitRequestFullscreen();
              else if ( elem.msRequestFullscreen )     /* IE/Edge */
                elem.msRequestFullscreen();
            },
            booklet: $.format( 'javascript:!function(){var%20e=document.createElement(%22script%22);e.setAttribute(%22src%22,%22%url%%22),document.head.appendChild(e),e=document.createElement(%22ccm-%index%%22),e.setAttribute(%22key%22,%22%config%%22),document.body.appendChild(e)}();', {
              url: self.component.url,
              index: self.component.index,
              config: encodeURI( self.config.replace( /"/g, '\\"' ) )
            } ),
            close: () => $.removeElement( self.root )
          } ) );

          // remove unneeded icons
          !self.component.url && $.removeElement( self.element.querySelector( '#link' ) );

          // render app
          if ( self.app ) { $.setContent( self.element.querySelector( '#body' ), self.app.root ); if ( !self.compact ) await self.app.start(); }

          // flying mode? => setup draggable
          if ( self.root.parentNode === document.body ) {
            let diff_x, diff_y;
            const img = new Image();
            img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=';
            self.element.classList.add( 'flying' );
            const draggable = self.element.querySelector( '#draggable' );
            draggable.setAttribute( 'draggable', 'true' );
            draggable.addEventListener( 'dragstart', event => {
              diff_x = event.clientX - self.element.getBoundingClientRect().x;
              diff_y = event.clientY - self.element.getBoundingClientRect().y;
              event.dataTransfer.setDragImage( img, 0, 0 );
            } );
            draggable.addEventListener( 'drag', event => {
              self.element.style.left = ( event.clientX - diff_x ) + 'px';
              self.element.style.top  = ( event.clientY - diff_y ) + 'px';
            } );
            draggable.addEventListener( 'dragover', event => {
              event.preventDefault();
              event.dataTransfer.dropEffect = 'move';
            } );
          }

        }

        /** renders flying window in compact mode */
        function renderCompact() {

          // render app icon and title
          $.setContent( self.element, $.html( self.html.compact, {
            icon: self.icon,
            title: $.escapeHTML( self.title || ( self.app && self.app.component.index ) || '' )
          } ) );

        }

      };

    }

  };

  let b="ccm."+component.name+(component.version?"-"+component.version.join("."):"")+".js";if(window.ccm&&null===window.ccm.files[b])return window.ccm.files[b]=component;(b=window.ccm&&window.ccm.components[component.name])&&b.ccm&&(component.ccm=b.ccm);"string"===typeof component.ccm&&(component.ccm={url:component.ccm});let c=(component.ccm.url.match(/(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)/)||["latest"])[0];if(window.ccm&&window.ccm[c])window.ccm[c].component(component);else{var a=document.createElement("script");document.head.appendChild(a);component.ccm.integrity&&a.setAttribute("integrity",component.ccm.integrity);component.ccm.crossorigin&&a.setAttribute("crossorigin",component.ccm.crossorigin);a.onload=function(){window.ccm[c].component(component);document.head.removeChild(a)};a.src=component.ccm.url}
} )();