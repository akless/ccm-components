/**
 * @overview ccm component for rendering a kanban board
 * @author André Kless <andre.kless@web.de> 2016-2017
 * @license The MIT License (MIT)
 * @version 1.1.0
 * @changes
 * version 1.1.0 (10.11.2017):
 * - confirm dialog when deleting a card
 * version 1.0.0 (29.10.2017)
 */

{
  var component = {

    /**
     * unique component name
     * @type {string}
     */
    name: 'kanban_board',

    /**
     * component version
     * @type {number[]}
     */
    version: [ 1, 1, 0 ],

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
      "html": {
        "main": {
          "tag": "main",
          "inner": {
            "id": "lanes"
          }
        },
        "lane": {
          "tag": "section",
          "class": "lane",
          "inner": [
            {
              "tag": "header",
              "inner": "%%"
            },
            {
              "tag": "article",
              "class": "cards"
            }
          ]
        },
        "add": {
          "tag": "footer",
          "onclick": "%%"
        }
      },
      "css": [ "ccm.load", "https://akless.github.io/ccm-components/kanban_board/resources/default.css" ],
      "data": {
        "store": [ "ccm.store" ],
        "key": "local"
      },
      "lanes": [ "ToDo", "Doing", "Done" ],
      "del": "Do you really want to delete this card?"

  //  "card": { "component": "https://akless.github.io/ccm-components/kanban_card/ccm.kanban_card.js", "config": { "data": {} } }

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
      this.init = function ( callback ) {

        // listen to datastore change event => update own content
        if ( self.data.store ) self.data.store.onchange = dataset => {

          // used dataset for rendering has not changed? => abort
          if ( !my || !my.dataset || dataset.key !== my.data.key ) return;

          // update used dataset and restart
          my.dataset = dataset; self.start();

        };

        callback();
      };

      /**
       * is called once after the initialization and is then deleted
       * @param {function} callback - called after all synchronous and asynchronous operations are complete
       */
      this.ready = callback => {

        // set shortcut to help functions
        $ = self.ccm.helper;

        // privatize all possible instance members
        my = $.privatize( self );

        callback();
      };

      /**
       * starts the instance
       * @param {function} [callback] - called after all synchronous and asynchronous operations are complete
       */
      this.start = callback => {

        // load needed dataset for rendering
        $.dataset( my.data, dataset => {

          // remember loaded dataset
          my.dataset = dataset;

          // new dataset? => set initial state
          if ( !dataset.lanes ) dataset.lanes = [];

          // iterate over lanes data => set initial state for new lanes
          my.lanes.map( ( lane, i ) => {
            if ( !dataset.lanes[ i ] ) dataset.lanes[ i ] = { cards: [] };
          } );

          /**
           * main HTML structure
           * @type {Element}
           */
          const main_elem = $.html( my.html.main );

          /**
           * element that contains the lanes
           * @type {Element}
           */
          const lanes_elem = main_elem.querySelector( '#lanes' );

          /**
           * number of unfinished asynchron operations
           * @type {number}
           */
          let counter = 1;

          // iterate over lanes data => create and append the HTML structure for each lane
          dataset.lanes.map( ( lane_data, i ) => {

            /**
             * lane HTML structure
             * @type {Element}
             */
            const lane_elem = $.html( my.html.lane, my.lanes[ i ] );

            /**
             * element that contains the cards
             * @type {Element}
             */
            const cards_elem = lane_elem.querySelector( '.cards' );

            // iterate over cards data => create and append the HTML structure for each card
            lane_data.cards.map( ( card_dependency, j ) => {

              // adjust instance configuration of card dependency
              if ( card_dependency[ 2 ] ) { card_dependency = $.clone( card_dependency ); card_dependency[ 2 ].parent = self; }

              /**
               * placeholder for current card
               * @type {Element}
               */
              let card_elem = document.createElement( 'div' );

              // append placeholder to lane HTML structure
              cards_elem.appendChild( card_elem );

              // increase asynchron operation counter
              counter++;

              // solve dependency for card instance (causes asynchronous operations)
              $.solveDependency( card_dependency, card_inst => {

                // start created card instance
                card_inst.start( () => {

                  // add HTML class to the root element of the card instance
                  card_inst.root.classList.add( 'card' );

                  // set drag'n'drop functionality for the root element
                  makeDraggable( card_inst.root );
                  makeDroppable( card_inst.root );

                  // set functionality for removing a card per double click
                  card_inst.root.addEventListener( 'dblclick', () => {

                    // run confirm dialog
                    if ( !confirm( my.del ) ) return;

                    // remove the instance dependency of the card from the dataset for rendering
                    dataset.lanes[ i ].cards.splice( j, 1 );

                    // update 'dataset for rendering' in datastore and restart afterwards
                    if ( my.data.store ) my.data.store.set( dataset, () => self.start() );

                  } );

                  // replace the placeholder with the root element (this adds the card HTML structure to the lane HTML structure)
                  cards_elem.replaceChild( card_inst.root, card_elem );

                  // check whether all asynchronous operations are finished
                  check();

                  /**
                   * makes a card draggable
                   * @param {Element} card_elem - element of the card
                   */
                  function makeDraggable( card_elem ) {

                    // activate draggable functionality
                    card_elem.setAttribute( 'draggable', 'true' );

                    // set draggable start event
                    card_elem.addEventListener( 'dragstart', event => {

                      // remember original position of the card
                      event.dataTransfer.setData( 'text', getPosition( event.target ).join( ',' ) );

                      // add a placeholder under the last card of each lane as additional droppable area
                      [ ...lanes_elem.querySelectorAll( '.cards' ) ].map( cards_elem => {
                        const placeholder = $.html( { class: 'placeholder' } );
                        placeholder.style.width  = event.target.offsetWidth  + 'px';
                        placeholder.style.height = event.target.offsetHeight + 'px';
                        makeDroppable( placeholder );
                        cards_elem.appendChild( placeholder );
                      } );

                    } );

                    // set draggable end event
                    card_elem.addEventListener( 'dragend', () => {

                      // remove all 'placeholders for additional droppable areas'
                      [ ...lanes_elem.querySelectorAll( '.placeholder' ) ].map( placeholder => { $.removeElement( placeholder ); } );

                    } );
                  }

                  /**
                   * makes a card to a droppable area
                   * @param {Element} card_elem - element of the card
                   */
                  function makeDroppable( card_elem ) {

                    // allow droppable functionality
                    card_elem.addEventListener( 'dragover', event => event.preventDefault() );

                    // set droppable event
                    card_elem.addEventListener( 'drop', event => {

                      /**
                       * original card position
                       * @type {Array}
                       */
                      const from = event.dataTransfer.getData( 'text' ).split( ',' ).map( value => parseInt( value ) );

                      /**
                       * target card position
                       * @type {Array}
                       */
                      const to = getPosition( event.target );

                      // is the original position identical to the target position? => abort
                      if ( from[ 0 ] === to[ 0 ] && ( from[ 1 ] === to[ 1 ] || from[ 1 ] === to[ 1 ] - 1 ) ) return;

                      /**
                       * card data of the moved card
                       * @type {object}
                       */
                      const card_data = dataset.lanes[ from[ 0 ] ].cards[ from[ 1 ] ];

                      // mark original position from 'dataset for rendering' as removed
                      dataset.lanes[ from[ 0 ] ].cards[ from[ 1 ] ] = null;

                      // add card in the dataset at the new position
                      dataset.lanes[ to[ 0 ] ].cards.splice( to[ 1 ], 0, card_data );

                      // has the original position changed through the shift? => correct the original position
                      if ( dataset.lanes[ from[ 0 ] ].cards[ from[ 1 ] ] !== null ) from[ 1 ]++;

                      // delete the original position completely from the 'dataset for rendering'
                      dataset.lanes[ from[ 0 ] ].cards.splice( from[ 1 ], 1 );

                      // update 'dataset for rendering' in the datastore and restart afterwards
                      if ( my.data.store ) my.data.store.set( dataset, () => self.start() );

                    } );

                  }

                  /**
                   * gets the position of a card
                   * @param {Element} card_elem - element of the card
                   * @returns {string[]}
                   * @example [ '1', '3' ]
                   */
                  function getPosition( card_elem ) {

                    /**
                     * lane that contains the card
                     * @param {Element}
                     */
                    const lane_elem = $.findParentElementByClass( card_elem, 'lane' );

                    // get and return lane coordinate x and card coordinate y
                    const x = $.makeIterable( lane_elem.parentNode.children ).indexOf( lane_elem );
                    const y = $.makeIterable( card_elem.parentNode.children ).indexOf( card_elem );
                    return [ x, y ];

                  }

                } );

              } );

            } );

            // is the current lane the first lane? => append button for creating a new card to current lane
            if ( my.card && i === 0 ) lane_elem.appendChild( $.html( my.html.add, () => {

              /**
               * instance configuration for the new card
               * @type {object}
               */
              const config = $.clone( my.card.config );

              // generate dataset key for the new card
              if ( config.data.store ) config.data.key = $.generateKey();

              // create and add the instance dependency for the new card to the dataset for rendering
              dataset.lanes[ i ].cards.push( [ 'ccm.instance', my.card.component, $.toJSON( config ) ] );

              // update 'dataset for rendering' in datastore and restart afterwards
              if ( my.data.store ) my.data.store.set( dataset, () => self.start() );

            } ) );

            // append prepared lane HTML structure to main HTML structure
            lanes_elem.appendChild( lane_elem );

          } );

          // check whether no asynchronous operations were started
          check();

          /**
           * called after each finished asynchron operation
           */
          function check() {

            // decrease the counter and check if all asynchron operations are finished
            if ( --counter > 0 ) return;

            // put prepared main HTML structure into own website area
            $.setContent( self.element, main_elem );

            // rendering completed => perform callback
            if ( callback ) callback();

          }

        } );

      };

    }

  };

  function p(){window.ccm[v].component(component)}const f="ccm."+component.name+(component.version?"-"+component.version.join("."):"")+".js";if(window.ccm&&null===window.ccm.files[f])window.ccm.files[f]=component;else{const n=window.ccm&&window.ccm.components[component.name];n&&n.ccm&&(component.ccm=n.ccm),"string"==typeof component.ccm&&(component.ccm={url:component.ccm});var v=component.ccm.url.split("/").pop().split("-");if(v.length>1?(v=v[1].split("."),v.pop(),"min"===v[v.length-1]&&v.pop(),v=v.join(".")):v="latest",window.ccm&&window.ccm[v])p();else{const e=document.createElement("script");document.head.appendChild(e),component.ccm.integrity&&e.setAttribute("integrity",component.ccm.integrity),component.ccm.crossorigin&&e.setAttribute("crossorigin",component.ccm.crossorigin),e.onload=function(){p(),document.head.removeChild(e)},e.src=component.ccm.url}}
}