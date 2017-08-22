/**
 * @overview example ccm component for the reuse of two ccm instances
 * @author André Kless <andre.kless@web.de> 2017
 * @license The MIT License (MIT)
 */

( function () {

  var component = {

    name: 'blank_blank',

    ccm: 'https://akless.github.io/ccm/ccm.js',

    config: {
      "instance_a": [ "ccm.instance", "../blank/ccm.blank.js" ],
      "instance_b": [ "ccm.instance", "../blank/ccm.blank.js" ]
    },

    Instance: function () {

      this.start = function ( callback ) {

        this.element.innerHTML = '';

        this.element.appendChild( this.instance_a.root );
        this.instance_a.start();

        this.element.appendChild( this.instance_b.root );
        this.instance_b.start();

        if ( callback ) callback();
      };

    }

  };

  function p(){window.ccm[v].component(component)}var f="ccm."+component.name+(component.version?"-"+component.version.join("."):"")+".js";if(window.ccm&&null===window.ccm.files[f])window.ccm.files[f]=component;else{var n=window.ccm&&window.ccm.components[component.name];n&&n.ccm&&(component.ccm=n.ccm),"string"==typeof component.ccm&&(component.ccm={url:component.ccm});var v=component.ccm.url.split("/").pop().split("-");if(v.length>1?(v=v[1].split("."),v.pop(),"min"===v[v.length-1]&&v.pop(),v=v.join(".")):v="latest",window.ccm&&window.ccm[v])p();else{var e=document.createElement("script");document.head.appendChild(e),component.ccm.integrity&&e.setAttribute("integrity",component.ccm.integrity),component.ccm.crossorigin&&e.setAttribute("crossorigin",component.ccm.crossorigin),e.onload=function(){p(),document.head.removeChild(e)},e.src=component.ccm.url}}
}() );