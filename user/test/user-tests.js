/**
 * @overview tests for <i>ccm</i> component for user authentication
 * @author André Kless <andre.kless@web.de> 2017
 * @license The MIT License (MIT)
 */

ccm.files[ 'user-tests.js' ] = {
  setup: function ( suite, callback ) {
    suite.ccm.component( 'https://akless.github.io/ccm-components/user/ccm.user.js', function ( component ) {
      suite.user = component;
      callback();
    } );
  },
  fundamental: {
    tests: {
      'componentName': function ( suite ) {
        suite.user.instance( function ( instance ) {
          suite.assertSame( 'user', instance.component.name );
        } );
      },
      'publicProperties': function ( suite ) {
        suite.user.instance( function ( instance ) {
          suite.assertEquals( [ 'start', 'login', 'logout', 'isLoggedIn', 'data', 'getSignOn', 'addObserver', 'ccm', 'id', 'index', 'component', 'element', 'root' ], Object.keys( instance ) );
        } );
      }
    }
  },
  render: {},
  login: {
    tests: {
      'defaultGuestKey': function ( suite ) {
        suite.assertSame( 'guest', suite.user.instance().login().data().key );
      },
      'defaultGuestName': function ( suite ) {
        suite.assertSame( 'Guest User', suite.user.instance().login().data().name );
      },
      'individualGuestKey': function ( suite ) {
        suite.assertSame( 'JohnDoe', suite.user.instance( { 'guest.key': 'JohnDoe' } ).login().data().key );
      },
      'individualGuestName': function ( suite ) {
        suite.assertSame( 'John Doe', suite.user.instance( { 'guest.name': 'John Doe' } ).login().data().name );
      },
      'demo': function ( suite ) {
        suite.user = suite.user.instance( { sign_on: 'demo' } );
        suite.user.login( function () {
          suite.passed();
        } );
      },
      'hbrsinfkaul': function ( suite ) {
        suite.user = suite.user.instance( { sign_on: 'hbrsinfkaul' } );
        suite.user.login( function () {
          suite.passed();
        } );
      },
      'vcrp': function ( suite ) {
        suite.user = suite.user.instance( { sign_on: 'VCRP_OpenOLAT' } );
        suite.user.login( function () {
          suite.passed();
        } );
      }

    }
  },
  logout: {},
  isLoggedIn: {},
  data: {},
  addObserver: {},
  context: {}
};