/**
 * @overview ccm component for flying windows
 * @author André Kless <andre.kless@web.de> 2018
 * @license The MIT License (MIT)
 * @version latest (1.0.0)
 * @changes
 * version 1.0.0 (17.12.2018)
 */

( function () {

  const component = {

    name: 'window',

    version: [ 1, 0, 0 ],

    ccm: 'https://ccmjs.github.io/ccm/versions/ccm-18.6.5.js',

    config: {

      "html": {
        "id": "main",
        "inner": [
          {
            "id": "window",
            "inner": [
              {
                "id": "window-head",
                "inner": [
                  {
                    "id": "window-draggable",
                    "inner": {
                      "id": "window-title",
                      "class": "title",
                      "inner": "%title%"
                    }
                  },
                  {
                    "id": "window-menu",
                    "inner": [
                      {
                        "id": "window-compact",
                        "class": "icon",
                        "inner": "&#9900;",
                        "onclick": "%compact%"
                      },
                      {
                        "id": "window-fullscreen",
                        "class": "icon",
                        "inner": "&#10530;",
                        "onclick": "%fullscreen%"
                      },
                      {
                        "id": "window-link",
                        "class": "icon",
                        "inner": "&#43;",
                        "tag": "a",
                        "href": "%booklet%"
                      },
                      {
                        "id": "window-close",
                        "class": "icon",
                        "inner": "&#215;",
                        "onclick": "%close%"
                      }
                    ]
                  }
                ]
              },
              { "id": "window-body" }
            ]
          },
          {
            "id": "compact",
            "onclick": "%window%",
            "inner": [
              {
                "id": "compact-icon",
                "inner": {
                  "tag": "img",
                  "src": "%icon%"
                }
              },
              {
                "id": "compact-title",
                "inner": {
                  "class": "title",
                  "inner": "%title%",
                  "title": "%title%"
                }
              }
            ]
          }
        ]
      },
      "css": [ "ccm.load", "https://ccmjs.github.io/akless-components/window/resources/default.css" ],
      "icon": "https://ccmjs.github.io/digital-maker-space/dms/resources/component.png"

  //  "app": [ "ccm.start", "https://ccmjs.github.io/akless-components/blank/ccm.blank.js" ],
  //  "title": "My App Title",
  //  "compact": true,
  //  "hidden": true

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

      this.start = async () => {

        /**
         * switches to given view
         * @type {function}
         * @param {boolean} view - true: window, false: compact
         */
        const switchView = view => {
          this.element.querySelector( '#' + ( view ? 'compact' : 'window' ) ).style.display = 'none';
          this.element.querySelector( '#' + ( view ? 'window' : 'compact' ) ).style.display = '';
        };

        // render main HTML structure
        $.setContent( this.element, $.html( this.html, {
          title: $.escapeHTML( this.title || ( this.app && this.app.component.index ) || '' ),
          icon: this.icon,
          compact: () => switchView( false ),
          window: () => switchView( true ),
          fullscreen: () => {
            const elem = this.element.querySelector( '#window-body' );
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
            url: this.component.url,
            index: this.component.index,
            config: encodeURI( this.config.replace( /"/g, '\\"' ) )
          } ),
          close: () => $.removeElement( this.root )
        } ) );

        // hidden mode? => hide window elements and show only app
        this.hidden && this.element.querySelector( '#window' ).classList.add( 'hidden' );

        // remove unneeded icons
        !this.component.url && $.removeElement( this.element.querySelector( '#window-link' ) );

        // render app
        this.app && $.setContent( this.element.querySelector( '#window-body' ), this.app.root );

        // flying mode? => setup draggable
        if ( this.root.parentNode.parentNode === document.body ) {
          let diff_x, diff_y;
          const img = new Image();
          img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=';
          this.element.classList.add( 'flying' );
          const makeDraggable = draggable => {
            draggable.setAttribute( 'draggable', 'true' );
            draggable.addEventListener( 'dragstart', event => {
              diff_x = event.clientX - this.element.getBoundingClientRect().x;
              diff_y = event.clientY - this.element.getBoundingClientRect().y;
              event.dataTransfer.setDragImage( img, 0, 0 );
            } );
            draggable.addEventListener( 'drag', event => {
              this.element.style.left = ( event.clientX - diff_x ) + 'px';
              this.element.style.top  = ( event.clientY - diff_y ) + 'px';
            } );
            draggable.addEventListener( 'dragover', event => {
              event.preventDefault();
              event.dataTransfer.dropEffect = 'move';
            } );
          };
          makeDraggable( this.element.querySelector( '#window-draggable' ) );
          makeDraggable( this.element.querySelector( '#compact' ) );
        }

        // show correct view
        switchView( !this.compact )

      };

    }

  };

  let b="ccm."+component.name+(component.version?"-"+component.version.join("."):"")+".js";if(window.ccm&&null===window.ccm.files[b])return window.ccm.files[b]=component;(b=window.ccm&&window.ccm.components[component.name])&&b.ccm&&(component.ccm=b.ccm);"string"===typeof component.ccm&&(component.ccm={url:component.ccm});let c=(component.ccm.url.match(/(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)/)||["latest"])[0];if(window.ccm&&window.ccm[c])window.ccm[c].component(component);else{var a=document.createElement("script");document.head.appendChild(a);component.ccm.integrity&&a.setAttribute("integrity",component.ccm.integrity);component.ccm.crossorigin&&a.setAttribute("crossorigin",component.ccm.crossorigin);a.onload=function(){window.ccm[c].component(component);document.head.removeChild(a)};a.src=component.ccm.url}
} )();