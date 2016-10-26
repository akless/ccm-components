/**
 * @overview <i>ccm</i> component for exercises
 * @author André Kless <andre.kless@web.de> 2016
 * @license The MIT License (MIT)
 */

ccm.component( /** @lends ccm.components.exercise */ {

  /*-------------------------------------------- public component members --------------------------------------------*/

  /**
   * @summary component index
   * @type {ccm.types.index}
   */
  index: 'exercise',

  /**
   * @summary default instance configuration
   * @type {ccm.components.exercise.types.config}
   */
  config: {

    data:  {
      store: [ ccm.store, '../exercise/datastore.json' ],
      key:   'demo'
    },
    edit:  {
      store: [ ccm.store ],
      key:   'demo'
    },
    input: [ ccm.component, '../input/ccm.input.js', { style: null } ]

  },

  /*-------------------------------------------- public component classes --------------------------------------------*/

  /**
   * @summary constructor for creating <i>ccm</i> instances out of this component
   * @class
   */
  Instance: function () {

    /*------------------------------------- private and public instance members --------------------------------------*/

    /**
     * @summary own context
     * @private
     */
    var self = this;

    /**
     * @summary contains privatized config members
     * @type {ccm.components.exercise.types.config}
     * @private
     */
    var my;

    /*------------------------------------------- public instance methods --------------------------------------------*/

    /**
     * @summary when <i>ccm</i> instance is ready
     * @description
     * Called one-time when this <i>ccm</i> instance and dependent <i>ccm</i> components, instances and datastores are initialized and ready.
     * This method will be removed by <i>ccm</i> after the one-time call.
     * @param {function} callback - callback when this instance is ready
     * @ignore
     */
    this.ready = function ( callback ) {

      // privatize security relevant config members
      my = ccm.helper.privatize( self, 'data', 'edit', 'deadline', 'onFinish', 'user', 'input', 'bigdata' );

      // perform callback
      callback();

    };

    /**
     * @summary render content in own website area
     * @param {function} [callback] - callback when content is rendered
     */
    this.render = function ( callback ) {

      /**
       * already existing inner HTML structure of own website area
       * @type {ccm.types.element}
       */
      var $html = self.element.contents();

      /**
       * website area for own content
       * @type {ccm.types.element}
       */
      var $element = ccm.helper.element( self );

      // get dataset for rendering
      ccm.helper.dataset( my.data, function ( dataset ) {

        // clear own website area
        $element.html( '' );

        // render title
        renderTitle();

        // render description
        renderDescription();

        // render inputs
        renderInputs();

        // perform callback
        if ( callback ) callback();

        /**
         * render exercise title
         */
        function renderTitle() {

          // render title
          if ( my.title || dataset.title ) $element.append( '<div class="title">' + dataset.title + '</div>' );

        }

        /**
         * render exercise description
         */
        function renderDescription() {

          // append container for description
          $element.append( '<div class="description"></div>' );

          /**
           * container for description
           * @type {ccm.types.element}
           */
          var $desc = ccm.helper.find( self, '.description' );

          // append content for own website area
          if ( my.description ) $desc.append( ccm.helper.html( my.description ) );

          // append content for own website area
          if ( dataset.description ) $desc.append( ccm.helper.html( dataset.description ) );

          // put already existing inner HTML structure in website area for own content
          $desc.append( $html );

        }

        /**
         * render inputs for exercise solution
         */
        function renderInputs() {

          /**
           * DOM ID of container for inputs
           * @type {string}
           */
          var id = self.index + '_inputs';

          // append container for inputs
          $element.append( '<div class="inputs" id="' + id + '"></div>' );

          // render input instance
          my.input.render( {
            element: jQuery( '#' + id ),
            data: { inputs: dataset.inputs },
            edit: my.edit,
            onFinish: my.onFinish,
            user: my.user,
            bigdata: my.bigdata,
            form: !my.deadline || Date.now() < my.deadline
          } );
        }

      } );

    };

  }

  /*------------------------------------------------ type definitions ------------------------------------------------*/

  /**
   * @namespace ccm.components.exercise
   */

  /**
   * @namespace ccm.components.exercise.types
   */

  /**
   * @summary <i>ccm</i> instance configuration
   * @typedef {ccm.types.config} ccm.components.exercise.types.config
   * @property {ccm.types.element} element - <i>ccm</i> instance website area
   * @property {ccm.types.dependency} style - CSS for own website area
   * @property {string} classes - HTML classes for own website area
   * ...
   */

  /**
   * @external ccm.types
   * @see {@link http://akless.github.io/ccm-developer/api/ccm/ccm.types.html}
   */

} );