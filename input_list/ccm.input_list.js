/**
 * @overview <i>ccm</i> component for list of user inputs
 * @author André Kless <andre.kless@h-brs.de> 2016
 * @license The MIT License (MIT)
 */

ccm.component( {
  index: 'input_list',
  config: {
    input: [ ccm.component, 'https://akless.github.io/ccm-components/resources/input/ccm.input.js' ]
  },
  Instance: function () {
    var self = this;
    var my;
    this.ready = function ( callback ) {
      my = ccm.helper.privatize( self, 'data', 'edit', 'input', 'form' );
      if ( ccm.helper.isObject( my.edit ) ) {
        if ( typeof my.edit.key === 'string' ) my.edit.key = { _id: { $regex: '^' + my.edit.key + ',' } };
        if ( !ccm.helper.isObject( my.edit.key ) ) my.edit.key = {};
      }
      callback();
    };
    this.render = function ( callback ) {
      var $element = ccm.helper.element( self );
      ccm.helper.dataset( my.data, function ( dataset ) {
        ccm.helper.dataset( my.edit, function ( editsets ) {
          $element.html( '' );
          editsets.map( function ( editset, i ) {
            var id = self.index + '-' + i;
            $element.append( '<div id="ccm-' + id + '"></div>' );
            my.input.render( {
              element: jQuery( '#ccm-' + id ),
              data: { inputs: dataset.inputs },
              edit: editset,
              form: my.form
            } );
          } );
        } );
        if ( callback ) callback();
      } );
    };
  }
} );