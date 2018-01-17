/**
 * @overview unit tests of ccm component for user authentication
 * @author André Kless <andre.kless@web.de> 2017-2018
 * @license The MIT License (MIT)
 */

ccm.files[ 'tests.js' ] = {
  setup: ( suite, callback ) => suite.ccm.component( '../user/ccm.user.js', component => callback( suite.component = component ) ),
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
  sign_on: {
    tests: {
      defaultGuestKey: suite => suite.component.instance( instance => suite.assertSame( 'guest', instance.login().data().name ) ),
      individualGuestKey: suite => suite.component.instance( { 'guest': 'JohnDoe' }, instance => suite.assertSame( 'JohnDoe', instance.login().data().name ) ),
      //demo: suite => suite.component.instance( { sign_on: 'demo' }, instance => instance.login( () => instance.logout( suite.passed ) ) ),
      //hbrsinfkaul: suite => suite.component.instance( { sign_on: 'hbrsinfkaul' }, instance => instance.login( () => instance.logout( suite.passed ) ) ),
      //lea: suite => suite.component.instance( { sign_on: 'LEA' }, instance => instance.login( () => instance.logout( suite.passed ) ) )
      /*
      vcrp: function ( suite ) {
        suite.component.instance( { sign_on: 'VCRP_OpenOLAT' } ).login( function () {
          suite.passed();
        } );
      }
      */
    }
  },
  logout: {},
  isLoggedIn: {},
  data: {},
  addObserver: {},
  context: {}
};