/**
 * @overview blank template for a ccm component
 * @author André Kless <andre.kless@web.de> 2017
 * @license The MIT License (MIT)
 */

( function () {

  var component = {

    name: 'blank',

    ccm: {
      url: 'https://akless.github.io/ccm/ccm.js',
      integrity: 'sha384-GL22Ogev6AH+OuhhZz5JxXxjXPcfzJcyrr6xd9XXM6zG/1ls/+f3E345FIcjj9B8',
      crossorigin: 'anonymous'
    },

    Instance: function () {

      this.start = function ( callback ) {

        this.element.innerHTML = 'Hello, World!';

        if ( callback ) callback();
      };

    }

  };

  function proceed(){window.ccm[version].component(component)}var filename="ccm."+component.name+(component.version?"-"+component.version.join("."):"")+".js";if(window.ccm&&null===window.ccm.files[filename])window.ccm.files[filename]=component;else{var namespace=window.ccm&&window.ccm.components[component.name];namespace&&namespace.ccm&&(component.ccm=namespace.ccm),"string"==typeof component.ccm&&(component.ccm={url:component.ccm});var version=component.ccm.url.split("/").pop().split("-");if(version.length>1?(version=version[1].split("."),version.pop(),"min"===version[version.length-1]&&version.pop(),version=version.join(".")):version="latest",window.ccm&&window.ccm[version])proceed();else{var tag=document.createElement("script");document.head.appendChild(tag),component.ccm.integrity&&tag.setAttribute("integrity",component.ccm.integrity),component.ccm.crossorigin&&tag.setAttribute("crossorigin",component.ccm.crossorigin),tag.onload=function(){proceed(),document.head.removeChild(tag)},tag.src=component.ccm.url}}
}() );