/**
 * @overview ccm component for a listing
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
    name: 'listing',

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
      message: 'Nothing to display.'
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
       * entry datasets
       * @type {Object[]}
       */
      let entries;

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
       * is called once after the initialization and is then deleted
       * @param {function} callback - called after all synchronous and asynchronous operations are complete
       */
      this.ready = callback => {

        callback();
      };

      /**
       * starts the instance
       * @param {function} [callback] - called after all synchronous and asynchronous operations are complete
       */
      this.start = callback => {

        $.setContent( self.element, '' );
        $.dataset( my.data, result => {
          entries = result;
          if ( !Array.isArray( entries ) || entries.length === 0 ) {
            $.setContent( self.element, my.message );
            return callback && callback();
          }
          const div = document.createElement( 'div' );
          self.element.appendChild( div );
          console.log( entries );

          const table_head = [];
          for ( let i = 0; i < Object.keys( entries[ 0 ] ).length - 4; i++ )
            table_head.push( 'a' + ( i + 1 ) );
          table_head.push( 'created_at' );
          table_head.push( 'updated_at' );

          //table_head: [ "header-1", "header-2", "header-3" ],
          //col_settings: [
          //  { "type": "number", "placeholder": "Tel: 049..." },
          //  { "disabled": "true", "inner": "max.musterman@mail.com" },
          //  { "type": "date", "foo": "bar" }
          //],

          my.target.start( { root: div, data: entries, table_head: table_head } );
          $.setContent( self.element, div );

          callback && callback();
        } );

      };

      /**
       * returns the current result data
       * @returns {Object[]} current result data
       */
      this.getValue = () => $.clone( entries );

    }

  };

  function p(){window.ccm[v].component(component)}const f="ccm."+component.name+(component.version?"-"+component.version.join("."):"")+".js";if(window.ccm&&null===window.ccm.files[f])window.ccm.files[f]=component;else{const n=window.ccm&&window.ccm.components[component.name];n&&n.ccm&&(component.ccm=n.ccm),"string"==typeof component.ccm&&(component.ccm={url:component.ccm});var v=component.ccm.url.split("/").pop().split("-");if(v.length>1?(v=v[1].split("."),v.pop(),"min"===v[v.length-1]&&v.pop(),v=v.join(".")):v="latest",window.ccm&&window.ccm[v])p();else{const e=document.createElement("script");document.head.appendChild(e),component.ccm.integrity&&e.setAttribute("integrity",component.ccm.integrity),component.ccm.crossorigin&&e.setAttribute("crossorigin",component.ccm.crossorigin),e.onload=function(){p(),document.head.removeChild(e)},e.src=component.ccm.url}}
}