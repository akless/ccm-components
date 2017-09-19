( function () {

  var component = {

    name: 'openid_showcase',

    ccm: '../../ccm/ccm.js',

    config: {
      "html": {
        "main": {
          "tag": "div",
          "id": "openid-showcase",
          "class" : "row",
          "inner": [
            {
              "tag": "div",
              "class": "col"
            },
            {
              "tag": "div",
              "id": "content-div",
              "class": "col"
            },
            {
              "tag": "div",
              "class": "col"
            }
          ]
        },
        "content_default": {
          "tag": "div",
          "inner": [
            {
              "tag": "div",
              "class": "alert alert-warning",
              "inner": {
                "tag": "span",
                "class": "greeting",
                "inner": "You are currently not logged in."
              }
            },
            {
              "tag": "span",
              "id": "provider-text",
              "inner": "Choose your OpenID provider:<br>"
            },
            {
              "tag": "a",
              "id": "link",
              "target": "_blank",
              "class": "fa fa-google"
            }
          ]
        },
        "content_logged_in": {
          "tag": "div",
          "class": "alert alert-success",
          "inner": {
            "tag": "span",
            "class": "greeting",
            "inner": "Hello! You successfully logged in using OpenID Connect.<br> Your ID is: %name%"
          }
        }
      },
      "css": [ "ccm.load",
        "https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css",
        { "url": "https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css", "context": "head" },
        "https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta/css/bootstrap.min.css",
        { "url": "https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta/css/bootstrap.min.css", "context": "head" },
        "style.css"
      ],
      "openid": [ "ccm.instance" , "../openid/ccm.openid.js"/*, { "redirectUri": "https://sonny42.github.io/ccm-components/openid-showcase/index.html" }*/ ]
    },

    Instance: function () {

      var self = this;

      self.start = function ( callback ) {

        self.ccm.helper.setContent( self.element, self.ccm.helper.html( self.html.main ) );

        var content_div = self.element.querySelector( '#content-div' );

        if ( self.openid.isLoggedIn() )
          self.ccm.helper.setContent( content_div, self.ccm.helper.html( self.html.content_logged_in, { name: self.openid.getCurrentUser() } ) );
        else {
          self.ccm.helper.setContent( content_div, self.ccm.helper.html( self.html.content_default ) );
          self.element.querySelector( '#link' ).setAttribute( 'href', self.openid.getOpenIdURL() );
        }

        if ( callback ) callback();
      }

    }

  };

  function p(){window.ccm[v].component(component)}var f="ccm."+component.name+(component.version?"-"+component.version.join("."):"")+".js";if(window.ccm&&null===window.ccm.files[f])window.ccm.files[f]=component;else{var n=window.ccm&&window.ccm.components[component.name];n&&n.ccm&&(component.ccm=n.ccm),"string"==typeof component.ccm&&(component.ccm={url:component.ccm});var v=component.ccm.url.split("/").pop().split("-");if(v.length>1?(v=v[1].split("."),v.pop(),"min"===v[v.length-1]&&v.pop(),v=v.join(".")):v="latest",window.ccm&&window.ccm[v])p();else{var e=document.createElement("script");document.head.appendChild(e),component.ccm.integrity&&e.setAttribute("integrity",component.ccm.integrity),component.ccm.crossorigin&&e.setAttribute("crossorigin",component.ccm.crossorigin),e.onload=function(){p(),document.head.removeChild(e)},e.src=component.ccm.url}}
}() );