/**
 * @overview blank template for a ccm component
 * @author André Kless <andre.kless@web.de> 2017
 * @license The MIT License (MIT)
 */

{
  var component = {

    name: 'blank',

    ccm: 'https://akless.github.io/ccm/ccm.js',

    Instance: function () {

      this.start = callback => {

        this.element.innerHTML = 'Hello, World!';

        if ( callback ) callback();
      };

    }

  };

  // determine filename of the component (with name and version of component)
  const f = 'ccm.' + component.name + ( component.version ? '-' + component.version.join( '.' ) : '' ) + '.js';

  // file is loaded via ccm.load call? => set return value
  if ( window.ccm && window.ccm.files[ f ] === null )
    window.ccm.files[ f ] = component;
  else {

    // check for individual framework URL (given via global component namespace)
    const n = window.ccm && window.ccm.components[ component.name ];
    if ( n && n.ccm ) component.ccm = n.ccm;

    // only framework URL? => convert to object
    if ( typeof component.ccm === 'string' ) component.ccm = { url: component.ccm };

    // determine component used framework version number (with framework URL)
    var v = component.ccm.url.split( '/' ).pop().split( '-' );
    if ( v.length > 1 ) {
      v = v[ 1 ].split( '.' );
      v.pop();
      if ( v[ v.length - 1 ] === 'min' ) v.pop();
      v = v.join( '.' );
    }
    else v = 'latest';

    // load needed framework version (if not already present)
    if ( !window.ccm || !window.ccm[ v ] ) {
      const e = document.createElement( 'script' );
      document.head.appendChild( e );
      if ( component.ccm.integrity   ) e.setAttribute( 'integrity',   component.ccm.integrity   );
      if ( component.ccm.crossorigin ) e.setAttribute( 'crossorigin', component.ccm.crossorigin );
      e.onload = function () { p(); document.head.removeChild( e ); };
      e.src = component.ccm.url;
    }
    else p();

  }

  /** called when needed framework version is present */
  function p() {
    window.ccm[ v ].component( component );  // register component in framework
  }
}