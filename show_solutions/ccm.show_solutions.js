/**
 * @overview ccm component for rendering a list of all submitted solutions
 * @author André Kless <andre.kless@web.de> 2018
 * @license The MIT License (MIT)
 * @version latest (1.0.0)
 */

{
  var component = {

    /**
     * unique component name
     * @type {string}
     */
    name: 'show_solutions',

    /**
     * recommended used framework version
     * @type {string}
     */
    ccm: '../../ccm/ccm.js',

    /**
     * default instance configuration
     * @type {Object}
     */
    config: {
      "data": {
        "store": [ "ccm.store" ],
        "key": "{}"
      },
      "message": "Nothing to display."
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
       * submitted solutions
       * @type {Object[]}
       */
      let solutions;

      /**
       * is called once after all dependencies are solved and is then deleted
       * @param {function} callback - called after all synchronous and asynchronous operations are complete
       */
      this.init = callback => {

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

        // clear own website area
        $.setContent( self.element, '' );

        // get submitted solutions
        $.dataset( my.data, result => { solutions = result;

          // no given solutions?
          if ( !Array.isArray( solutions ) || solutions.length === 0 ) {

            // render message that there is nothing to display
            $.setContent( self.element, my.message );

            // perform callback and abort
            return callback && callback();

          }

          // iterate over each submitted solution
          solutions.map( solution => {

            // remove not relevant solution properties
            delete solution.created_at; delete solution.updated_at; delete solution._;

          } );

          /**
           * headlines of table columns
           * @type {string[]}
           */
          const table_head = Object.keys( solutions[ 0 ] );

          // render list of submitted solutions
          my.target.start( { root: self.element, data: solutions, table_head: table_head }, () => callback && callback() );

        } );

      };

      /**
       * returns the current result data
       * @returns {Object[]} current result data
       */
      this.getValue = () => $.clone( solutions );

    }

  };

  function p(){window.ccm[v].component(component)}const f="ccm."+component.name+(component.version?"-"+component.version.join("."):"")+".js";if(window.ccm&&null===window.ccm.files[f])window.ccm.files[f]=component;else{const n=window.ccm&&window.ccm.components[component.name];n&&n.ccm&&(component.ccm=n.ccm),"string"==typeof component.ccm&&(component.ccm={url:component.ccm});var v=component.ccm.url.split("/").pop().split("-");if(v.length>1?(v=v[1].split("."),v.pop(),"min"===v[v.length-1]&&v.pop(),v=v.join(".")):v="latest",window.ccm&&window.ccm[v])p();else{const e=document.createElement("script");document.head.appendChild(e),component.ccm.integrity&&e.setAttribute("integrity",component.ccm.integrity),component.ccm.crossorigin&&e.setAttribute("crossorigin",component.ccm.crossorigin),e.onload=function(){p(),document.head.removeChild(e)},e.src=component.ccm.url}}
}