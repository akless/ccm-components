/**
 * @overview ccm component for rendering a kanban board
 * @author André Kless <andre.kless@web.de> 2016-2017
 * @license The MIT License (MIT)
 * @version latest (1.0.0)
 * TODO: moving cards
 * TODO: restoring card positions
 * TODO: add and delete of a kanban card
 * TODO: declarative
 * TODO: user
 * TODO: logging
 * TODO: docu comments
 * TODO: unit tests
 * TODO: version file/folder
 * TODO: factory
 * TODO: multilingualism
 */

( function () {

  var component = {

    name: 'kanban_board',

    ccm: 'https://akless.github.io/ccm/ccm.js',

    config: {

      "html": {
        "lane": {
          "tag": "section",
          "inner": [
            {
              "tag": "header",
              "inner": "%%"
            },
            { "tag": "article" }
          ]
        }
      },
      "css": [ "ccm.load", "resources/default.css" ],
      "kanban_card": [ "ccm.component", "../kanban_card/ccm.kanban_card.js" ],
      "data": {
        "store": [ "ccm.store", "resources/datasets.js" ],
        "key": "local"
      },
      "lanes": [ "ToDo", "Doing", "Done" ]

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

        self.ccm.helper.dataset( my.data, function ( dataset ) {

          if ( !dataset.lanes ) dataset.lanes = [];
          my.lanes.map( function ( lane, i ) {
            if ( !dataset.lanes[ i ] ) dataset.lanes[ i ] = { cards: [] };
          } );

          var element = document.createDocumentFragment();
          var counter = 1;
          dataset.lanes.map( renderLane );
          check();

          function renderLane( lane, i ) {

            var lane_elem = self.ccm.helper.html( my.html.lane, my.lanes[ i ] );
            var cards_elem = lane_elem.querySelector( 'article' );

            lane.cards.map( renderCard );
            element.appendChild( lane_elem );

            function renderCard( card_cfg ) {

              counter++;
              console.log('++',counter);
              var card_elem = document.createElement( 'div' );
              cards_elem.appendChild( card_elem );
              my.kanban_card.start( self.ccm.helper.clone( card_cfg ), function ( card_inst ) {
                card_inst.root.classList.add( 'card' );
                cards_elem.replaceChild( card_inst.root, card_elem );
                check();
              } );

            }

          }

          function check() {

            counter--;
            console.log('--',counter,element);
            if ( counter !== 0 ) return;

            self.ccm.helper.setContent( self.element, element );

            if ( callback ) callback();

          }

        } );

      };

    }

  };

  function p(){window.ccm[v].component(component)}var f="ccm."+component.name+(component.version?"-"+component.version.join("."):"")+".js";if(window.ccm&&null===window.ccm.files[f])window.ccm.files[f]=component;else{var n=window.ccm&&window.ccm.components[component.name];n&&n.ccm&&(component.ccm=n.ccm),"string"==typeof component.ccm&&(component.ccm={url:component.ccm});var v=component.ccm.url.split("/").pop().split("-");if(v.length>1?(v=v[1].split("."),v.pop(),"min"===v[v.length-1]&&v.pop(),v=v.join(".")):v="latest",window.ccm&&window.ccm[v])p();else{var e=document.createElement("script");document.head.appendChild(e),component.ccm.integrity&&e.setAttribute("integrity",component.ccm.integrity),component.ccm.crossorigin&&e.setAttribute("crossorigin",component.ccm.crossorigin),e.onload=function(){p(),document.head.removeChild(e)},e.src=component.ccm.url}}
}() );