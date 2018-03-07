/**
 * @overview unit tests of ccm component for rendering a predefined content
 * @author André Kless <andre.kless@web.de> 2017-2018
 * @license The MIT License (MIT)
 */

ccm.files[ 'tests.js' ] = {
  setup: ( suite, callback ) => suite.ccm.component( '../content/ccm.content.js', component => callback( suite.component = component ) ),
  fundamental: {
    setup: ( suite, callback ) => suite.component.instance( instance => callback( suite.instance = instance ) ),
    tests: {
      componentName:    suite => suite.assertSame( 'content', suite.instance.component.name ),
      publicProperties: suite => suite.assertEquals( [ 'start', 'ccm', 'id', 'index', 'component', 'root', 'element', 'dependency' ], Object.keys( suite.instance ) )
    }
  },
  render: {
    tests: {
      innerHTMLString: suite => {
        const inner ='Hello, <b>World</b>!';
        suite.component.start( { inner: inner }, instance => suite.assertSame( inner, instance.element.innerHTML ) );
      },
      customElement: suite => {
        const source = '<source src="../blank/ccm.blank.js">';
        const tag    = '<ccm-blank></ccm-blank>';
        const div1f  = '<div><div id="ccm-blank-1"><div id="element">Hello, World!</div></div></div>';
        const div2f  = '<div><div id="ccm-blank-2"><div id="element">Hello, World!</div></div></div>';
        const div1   = '<div><div id="ccm-blank-1"></div></div>';
        const div2   = '<div><div id="ccm-blank-2"></div></div>';
        suite.component.start( { inner: source + tag + tag }, instance => {
          if ( suite.ccm.helper.isFirefox() )
            suite.assertSame( source + div1f + div2f, instance.element.innerHTML );
          else
            suite.assertSame( source + div2  + div1,  instance.element.innerHTML );
        } );
      }
    }
  }
};