/**
 * @overview unit tests of ccm component for composed content
 * @author André Kless <andre.kless@web.de> 2017
 * @license The MIT License (MIT)
 */

ccm.files[ 'content-tests.js' ] = {
  setup: function ( suite, callback ) {
    suite.ccm.component( 'https://akless.github.io/ccm-components/content/ccm.content.js', function ( component ) {
      suite.component = component;
      callback();
    } );
  },
  fundamental: {
    tests: {
      componentName: function ( suite ) {
        suite.component.instance( function ( instance ) {
          suite.assertSame( 'content', instance.component.name );
        } );
      },
      publicProperties: function ( suite ) {
        suite.component.instance( function ( instance ) {
          suite.assertEquals( [ 'start', 'ccm', 'id', 'index', 'component', 'root', 'element' ], Object.keys( instance ) );
        } );
      }
    }
  },
  render: {
    tests: {
      innerHTMLString: function ( suite ) {
        var inner ='Hello, <b>World</b>!';
        suite.component.start( { inner: inner }, function ( instance ) {
          suite.assertSame( inner, instance.element.innerHTML );
        } );
      },
      customElement: function ( suite ) {
        var script = '<script src="https://akless.github.io/ccm-components/blank/ccm.blank.js"></script>';
        var tag    = '<ccm-blank></ccm-blank>';
        var div    = '<div></div>';
        suite.component.start( { inner: script + tag + tag }, function ( instance ) {
          suite.assertSame( script + div + div, instance.element.innerHTML );
        } );
      }
    }
  }
};