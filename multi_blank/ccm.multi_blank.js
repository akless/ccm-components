/**
 * @overview example component for reusing an undefined number of ccm instances of the same component
 * @author André Kless <andre.kless@web.de> 2017
 * @license The MIT License (MIT)
 */

{
  var component = {

    name: 'multi_blank',

    ccm: 'https://akless.github.io/ccm/ccm.js',

    config:  {
      component_obj: [ "ccm.component", "../blank/ccm.blank.js" ],
      times: 5
    },

    Instance: function () {

      this.start = callback => {

        this.element.innerHTML = '';

        let counter = 1;
        const check = () => { if ( --counter === 0 && callback ) callback(); };

        for ( let i = 1; i <= this.times; i++ )
          this.component_obj.start( instance => { this.element.appendChild( instance.root ); check(); } );

        check();

      }

    }

  };

  function p(){window.ccm[v].component(component)}const f="ccm."+component.name+(component.version?"-"+component.version.join("."):"")+".js";if(window.ccm&&null===window.ccm.files[f])window.ccm.files[f]=component;else{const n=window.ccm&&window.ccm.components[component.name];n&&n.ccm&&(component.ccm=n.ccm),"string"==typeof component.ccm&&(component.ccm={url:component.ccm});var v=component.ccm.url.split("/").pop().split("-");if(v.length>1?(v=v[1].split("."),v.pop(),"min"===v[v.length-1]&&v.pop(),v=v.join(".")):v="latest",window.ccm&&window.ccm[v])p();else{const e=document.createElement("script");document.head.appendChild(e),component.ccm.integrity&&e.setAttribute("integrity",component.ccm.integrity),component.ccm.crossorigin&&e.setAttribute("crossorigin",component.ccm.crossorigin),e.onload=function(){p(),document.head.removeChild(e)},e.src=component.ccm.url}}
}