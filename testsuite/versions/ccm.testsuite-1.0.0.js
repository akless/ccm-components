/**
 * @overview <i>ccm</i> component for running unit tests
 * @author André Kless <andre.kless@web.de> 2016-2017
 * @license The MIT License (MIT)
 * @version 1.0.0
 */

( function () {

  var filename = 'ccm.testsuite-1.0.0.min.js';

  var ccm_version = '9.0.0';
  var ccm_url     = 'https://akless.github.io/ccm/version/ccm-9.0.0.min.js';

  var component_name = 'testsuite';
  var component_obj  = {

    name: component_name,
    version: [ 1, 0, 0 ],

    config: {

      html: {
        main: {
          id: 'main',
          inner: [
            {
              id: 'summary',
              inner: [
                { id: 'executed', inner: 0 },
                { id: 'passed'  , inner: 0 },
                { id: 'failed'  , inner: 0 }
              ]
            },
            { id: 'packages' }
          ]
        },
        package: {
          class: 'package',
          inner: [
            { class: 'label', inner: '%%' },
            { class: 'table' },
            { class: 'conclusion' }
          ]
        },
        test: {
          class: 'tr',
          inner: [
            { class: 'td name', inner: '%%' },
            { class: 'td result' }
          ]
        },
        result: {
          class: '%value%',
          inner: '%value%'
        },
        message: {
          class: 'td details message',
          inner: '%%'
        },
        comparison: {
          class: 'td details comparison',
          inner: [
            { class: 'expected', inner: '%%' },
            { class: 'actual',   inner: '%%' }
          ]
        }
      },
      css: [ 'ccm.load', 'https://akless.github.io/ccm-components/testsuite/resources/default.css' ],
      onfinish: function ( instance, result ) { console.log( result ); }

  //  tests
  //  package

    },

    Instance: function () {

      var self = this;
      var my;           // contains privatized instance members

      /**
       * higher collected setup functions that have to be performed before each test
       * @type {function[]}
       */
      var setups = [];

      /**
       * higher collected finalize functions that have to be performed after each test
       * @type {function[]}
       */
      var finallies = [];

      this.ready = function ( callback ) {

        // privatize all possible instance members
        my = self.ccm.helper.privatize( self );

        // no package path? => abort
        if ( !my.package ) return callback();

        // navigate to the relevant test package and collect setup and finally functions along the way
        var array = my.package.split( '.' );
        while ( array.length > 0 ) {
          if ( my.tests.setup ) setups.push( my.tests.setup );            // collect founded setup    function
          if ( my.tests.finally ) finallies.unshift( my.tests.finally );  // collect founded finalize function
          my.tests = my.tests[ array.shift() ];
        }

        callback();
      };

      this.start = function ( callback ) {

        // set initial result data
        var results = {
          executed: 0,  // number of executed tests
          passed:   0,  // number of   passed tests
          failed:   0,  // number of   failed tests
          details:  {}
        };

        // has website area? => render main HTML structure
        if ( self.element ) {
          var main_elem     = self.ccm.helper.html( my.html.main );
          var packages_elem = main_elem.querySelector( '#packages' );
          self.ccm.helper.setContent( self.element, main_elem );
        }

        // process relevant test package (including all subpackages)
        processPackage( my.package || '', my.tests, setups, finallies, finish );

        /**
         * processes current test package (recursive function)
         * @param {string} package_path - path to current test package
         * @param {object} package_obj - data of the current test package
         * @param {function[]} setups - setup functions that have to be performed before each test
         * @param {function[]} finallies - finalize functions that have to be performed after each test
         * @param {function} callback
         */
        function processPackage( package_path, package_obj, setups, finallies, callback ) {

          // has setup function? => add her to (cloned) setup functions
          if ( package_obj.setup ) { setups = setups.slice(); setups.push( package_obj.setup ); }

          // has finalize function? => add her to (cloned) finallies functions
          if ( package_obj.finally ) { finallies = finallies.slice(); finallies.unshift( package_obj.finally ); }

          // has tests? => perform all these tests
          if ( package_obj.tests ) runTests( proceed ); else proceed();

          function proceed() {

            // remove no more needed properties (only package properties remain)
            delete package_obj.setup;
            delete package_obj.tests;

            // process first subpackage (if exists)
            processNextSubpackage();

            /** processes current subpackage (recursive function) */
            function processNextSubpackage() {

              for ( var key in package_obj ) {
                var package = package_obj[ key ];
                delete package_obj[ key ];
                processPackage( ( package_path ? package_path + '.' : '' ) + key, package, setups, finallies, processNextSubpackage );  // recursive call
                return;
              }

              // all subpackages are processed
              callback();

            }

          }

          /** performs all directly contained tests of the current test package */
          function runTests( callback ) {

            var tests = prepareTests();
            var i = 0;

            // has website area? => render (empty) test package
            if ( self.element ) {
              var package_elem = self.ccm.helper.html( my.html.package, package_path );
              var table_elem = package_elem.querySelector( '.table' );
              packages_elem.appendChild( package_elem );
            }

            // run first contained test
            runNextTest();

            /** runs current test (recursive function) */
            function runNextTest() {

              // all tests finished? => abort and perform callback
              if ( i === tests.length ) return callback();

              // has website area?
              if ( self.element ) {

                // show that another test will be executed
                main_elem.querySelector( '#executed' ).appendChild( self.ccm.helper.loading( self ) );

                // render table row for current test
                var test_elem = self.ccm.helper.html( my.html.test, tests[ i ].name );
                table_elem.appendChild( test_elem ) ;

                // for the moment render loading as result
                var result_elem = test_elem.querySelector( '.result' );
                result_elem.appendChild( self.ccm.helper.loading( self ) );

              }

              // prepare test suite object for the current test
              var suite = {

                ccm: self.ccm,  // provide reference to ccm framework

                /** finishes current test with a positive result */
                passed: function () {
                  addResult( true );
                  finishTest();
                },

                /**
                 * finishes current test with a negative result
                 * @param {string} [message] - message that explains why the test has failed
                 */
                failed: function ( message ) {
                  addResult( false );
                  if ( message ) addMessage( message );
                  finishTest();
                },

                /**
                 * finishes current test with positive result if the given condition is true
                 * @param {boolean} condition
                 */
                assertTrue: function ( condition ) {
                  addResult( condition );
                  finishTest();
                },

                /**
                 * finishes current test with negative result if the given condition is true
                 * @param {boolean} condition
                 */
                assertFalse: function ( condition ) {
                  addResult( !condition );
                  finishTest();
                },

                /**
                 * finishes current test with positive result if given expected and actual value contains same data
                 * @param {object} expected
                 * @param {object} actual
                 */
                assertSame: function ( expected, actual ) {
                  var result = expected === actual;
                  addResult( result );
                  if ( !result ) addComparison( expected, actual );
                  finishTest();
                },

                /**
                 * finishes current test with positive result if given expected value equals given actual value
                 * @param {object} expected
                 * @param {object} actual
                 */
                assertEquals: function ( expected, actual ) {
                  suite.assertSame( JSON.stringify( expected ), JSON.stringify( actual ) );
                },

                /**
                 * finishes current test with positive result if given expected and actual value NOT contains same data
                 * @param {object} expected
                 * @param {object} actual
                 */
                assertNotSame: function ( expected, actual ) {
                  var result = expected !== actual;
                  addResult( result );
                  finishTest();
                },

                /**
                 * finishes current test with positive result if given expected value NOT equals given actual value
                 * @param {object} expected
                 * @param {object} actual
                 */
                assertNotEquals: function ( expected, actual ) {
                  suite.assertNotSame( JSON.stringify( expected ), JSON.stringify( actual ) );
                }

              };

              // run setup functions and then run current test
              runSetups( function () { tests[ i ]( suite ); } );

              /** runs all relevant setup functions (recursive function) */
              function runSetups( callback ) {
                var i = 0;                           // Remember: Each setup function could be asynchron
                runSetup();                          //           and must performed sequentially
                function runSetup() {                //           to avoid mutual influence.
                  if ( i === setups.length )
                    return callback();
                  setups[ i++ ]( suite, runSetup );  // recursive call
                }
              }

              /** replaces loading icon with test result and increases passed or failed counter */
              function addResult( result ) {
                var value = result ? 'passed' : 'failed';
                if ( result ) results.passed++; else results.failed++;
                if ( self.element ) self.ccm.helper.setContent( result_elem, self.ccm.helper.html( my.html.result, { value: value } ) );
                results.details[ package_path + '.' + tests[ i ].name ] = result;
              }

              /** show message as detail information for a failed test */
              function addMessage( message ) {
                if ( self.element ) test_elem.appendChild( self.ccm.helper.html( my.html.message, message ) );
                results.details[ package_path + '.' + tests[ i ].name ] = message;
              }

              /** show expected and actual value as detail information for a failed test */
              function addComparison( expected, actual ) {
                if ( self.element ) test_elem.appendChild( self.ccm.helper.html( my.html.comparison, expected, actual ) );
                results.details[ package_path + '.' + tests[ i ].name ] = { expected: expected, actual: actual };
              }

              /** increases test counters, updates summary section and starts running next test */
              function finishTest() {
                i++; results.executed++;
                if ( self.element ) {
                  main_elem.querySelector( '#executed' ).innerHTML = results.executed.toString();
                  main_elem.querySelector( '#passed'   ).innerHTML = results.  passed.toString();
                  main_elem.querySelector( '#failed'   ).innerHTML = results.  failed.toString();
                }
                runFinallies( runNextTest );  // recursive call

                /** runs all relevant finally functions (recursive function) */
                function runFinallies( callback ) {
                  var i = 0;                           // Remember: Each finalize function could be asynchron
                  runFinally();                        //           and must performed sequentially
                  function runFinally() {              //           to avoid mutual influence.
                    if ( i === finallies.length )
                      return callback();
                    finallies[ i++ ]( suite, runFinally );  // recursive call
                  }
                }
              }

            }

            /** convert test package from object to array and ensure that each test has a function name */
            function prepareTests() {

              // convert object to array
              return Object.keys( package_obj.tests ).map( function ( key ) {

                // if test function has no name, than use property key of the test inside the object as name
                if ( !package_obj.tests[ key ].name ) Object.defineProperty( package_obj.tests[ key ], 'name', { value: key } );

                return package_obj.tests[ key ];

              } );

            }

          }

        }

        /** callback when all tests in all relevant test packages are finished */
        function finish() {
          self.ccm.helper.onFinish( self, results );
          if ( callback ) callback();
        }

      };

    }

  };

  if ( window.ccm && window.ccm.files ) window.ccm.files[ filename ] = component_obj;
  var namespace = window.ccm && ccm.components[ component_name ]; if ( namespace ) { if ( namespace.ccm_version ) ccm_version = namespace.ccm_version; if ( namespace.ccm_url ) ccm_url = namespace.ccm_url; }
  if ( !window.ccm || !ccm[ ccm_version ] ) { var tag = document.createElement( 'script' ); document.head.appendChild( tag ); tag.onload = register; tag.src = ccm_url; } else register();
  function register() { ccm[ ccm_version ].component( component_obj ); delete window.ccm.files[ filename ]; }
}() );