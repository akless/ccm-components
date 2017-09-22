/**
 * @overview configurations of ccm component for user authentication
 * @author André Kless <andre.kless@web.de> 2017
 * @license The MIT License (MIT)
 */

ccm.files[ 'configs.js' ] = {
  "demo": {
    "sign_on": "demo",
    "css": [ "ccm.load", "https://akless.github.io/ccm-components/user/resources/default.css" ]
  },
  "local": {
    "sign_on": "demo",
    "css": [ "ccm.load", "resources/default.css" ]
  }
};