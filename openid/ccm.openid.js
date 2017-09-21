( function () {

  var component = {

    name: 'openid',

    ccm: 'https://akless.github.io/ccm/ccm.js',

    config: {
      "html": {
        "main": {
          "tag": "div",
          "id": "openid_main"
        },
        "logout": {
          "tag": "button",
          "type": "button",
          "inner": "%text%",
          "onclick": "%onclick%"
        },
        "input": {
          "tag": "div",
          "class": "inputdiv",
          "inner": {
            "tag": "form",
            "method": "get",
            "action": "%actionUrl%&%actionUrl2",
            "class": "form",
            "inner": [
              {
                "tag": "input",
                "type": "submit",
                "value": "Login with OpenId"
              }
            ],
            "onsubmit": "%onsubmit%"
          }
        }
      },
      "openid": [ "ccm.load", "../openid/openidconnect.js" ],
      "clientId": "1096722142749-hcr71g909c47htrucd1ib31oaogfd0am.apps.googleusercontent.com",
      "redirectUri": "http://localhost:63342/sonnenberger-components/openid/index.html",
      "discoveryUri": "https://accounts.google.com/"
    },

    Instance: function () {

      var self = this;
      var currentUser = null;

      this.start = function ( callback ) {

        self.ccm.helper.setContent( self.element, self.ccm.helper.html( self.html.main ) );
        var main_div = self.element.querySelector( '#openid_main' );

        currentUser = self.getCurrentUser();

        if ( !currentUser )
          displayLoginButton( main_div );
        else
          displayLoggedIn( main_div );

        if ( callback ) callback();
      };

      this.getCurrentUser = function () {

        try {
          OIDC.restoreInfo();
          var id_token = OIDC.getValidIdToken();
          var id_token_payload = OIDC.getIdTokenPayload( id_token );
          return id_token_payload.email;
        }
        catch ( e ) {
          if ( e.name === 'OidcException' )
            return null;
          throw e;
        }
      };

      //Build OpenID URL
      this.getOpenIdURL = function () {

        var clientInfo = {
          client_id: self.clientId,
          redirect_uri: self.redirectUri
        };
        OIDC.setClientInfo( clientInfo );

        var providerInfo = OIDC.discover( self.discoveryUri );
        OIDC.setProviderInfo( providerInfo );
        OIDC.storeInfo( providerInfo, clientInfo );

        var requestData =	{
          scope: 'openid+email',
          response_type: 'id_token'
        };

        return OIDC.login( requestData );

      };

      this.isLoggedIn = function () {
        return !!self.getCurrentUser();
      };

      //This gets rendered when the user is logged in
      function displayLoggedIn( parentElement ) {

        if ( !parentElement ) return;
        displayGreeting( parentElement );
        displayLogoutButton( parentElement );

        function displayGreeting( parentElement ) {
          if( !parentElement ) return;
          parentElement.innerHTML = 'Welcome ' + currentUser + '!<br>';
        }

        function displayLogoutButton( parentElement ) {

          if ( !parentElement ) return;

          parentElement.appendChild( self.ccm.helper.html( self.html.logout, {
            text: 'Logout',
            onclick: function () {
              currentUser = null;
              window.location.href = self.redirectUri;
              self.start();
            }
          } ) );

        }

      }

      function displayLoginButton( parentElement ) {

        if ( !parentElement ) return;

        var url = self.getOpenIdURL();
        parentElement.innerHTML = '<a href=' + url + '>click</a>';

      }

    }

  };

  function p(){window.ccm[v].component(component)}var f="ccm."+component.name+(component.version?"-"+component.version.join("."):"")+".js";if(window.ccm&&null===window.ccm.files[f])window.ccm.files[f]=component;else{var n=window.ccm&&window.ccm.components[component.name];n&&n.ccm&&(component.ccm=n.ccm),"string"==typeof component.ccm&&(component.ccm={url:component.ccm});var v=component.ccm.url.split("/").pop().split("-");if(v.length>1?(v=v[1].split("."),v.pop(),"min"===v[v.length-1]&&v.pop(),v=v.join(".")):v="latest",window.ccm&&window.ccm[v])p();else{var e=document.createElement("script");document.head.appendChild(e),component.ccm.integrity&&e.setAttribute("integrity",component.ccm.integrity),component.ccm.crossorigin&&e.setAttribute("crossorigin",component.ccm.crossorigin),e.onload=function(){p(),document.head.removeChild(e)},e.src=component.ccm.url}}
}() );