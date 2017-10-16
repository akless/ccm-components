/**
 * @overview unit tests of ccm component for user authentication
 * @author André Kless <andre.kless@web.de> 2017
 * @license The MIT License (MIT)
 */

ccm.files[ 'tests.js' ] = {
  setup: function ( suite, callback ) {
    suite.ccm.component( '../user/ccm.user.js', function ( component ) {
      suite.component = component;
      callback();
    } );
  },
  fundamental: {
    tests: {
      componentName: function ( suite ) {
        suite.component.instance( function ( instance ) {
          suite.assertSame( 'user', instance.component.name );
        } );
      },
      publicProperties: function ( suite ) {
        suite.component.instance( function ( instance ) {
          suite.assertEquals( [ 'start', 'login', 'logout', 'isLoggedIn', 'data', 'getSignOn', 'addObserver', 'ccm', 'id', 'index', 'component', 'root', 'element', 'dependency' ], Object.keys( instance ) );
        } );
      }
    }
  },
  render: {},
  login: {
    tests: {
      defaultGuestKey: function ( suite ) {
        suite.component.instance( function ( instance ) {
          suite.assertSame( 'guest', instance.login().data().name );
        } );
      },
      individualGuestKey: function ( suite ) {
        suite.component.instance( { 'guest': 'JohnDoe' }, function ( instance ) {
          suite.assertSame( 'JohnDoe', instance.login().data().name );
        } );
      },
      demo: function ( suite ) {
        suite.component.instance( { sign_on: 'demo' }, function ( instance ) {
          instance.login( function () { suite.passed(); } );
        } );
      }/*,
      hbrsinfkaul: function ( suite ) {
        suite.component.instance( { sign_on: 'hbrsinfkaul' }, function ( instance ) {
          instance.login( function () { suite.passed(); } );
        } );
      },
      vcrp: function ( suite ) {
        return suite.failed();
        suite.component.instance( { sign_on: 'VCRP_OpenOLAT' } ).login( function () {
          suite.passed();
        } );
      }*/
    }
  },
  logout: {},
  isLoggedIn: {},
  data: {},
  addObserver: {},
  context: {}
};