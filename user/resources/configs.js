/**
 * @overview configurations of ccm component for user authentication
 * @author André Kless <andre.kless@web.de> 2017-2018
 * @license The MIT License (MIT)
 */

ccm.files[ 'configs.js' ] = {
  "local": {
    "realm": "demo",
    "css": [ "ccm.load", "../user/resources/default.css" ],
    "logger": [ "ccm.instance", "../log/versions/ccm.log-2.0.1.js", [ "ccm.get", "../log/resources/configs.js", "greedy" ] ]
  },
  "demo": {
    "realm": "demo",
    "css": [ "ccm.load", "https://akless.github.io/ccm-components/user/resources/default.css" ],
    "logger": [ "ccm.instance", "https://akless.github.io/ccm-components/log/versions/ccm.log-2.0.1.js", [ "ccm.get", "https://akless.github.io/ccm-components/log/resources/configs.min.js", "greedy" ] ]
  },
  "lea": {
    "realm": "LEA",
    "css": [ "ccm.load",
      "https://akless.github.io/ccm-components/user/resources/tea.css",
      "https://tkless.github.io/ccm-components/libs/bootstrap/css/bootstrap.css",
      { "context": "head", "url": "https://tkless.github.io/ccm-components/libs/bootstrap/css/font-face.css" }
    ],
    "logger": [ "ccm.instance", "https://akless.github.io/ccm-components/log/versions/ccm.log-2.0.1.js", [ "ccm.get", "https://akless.github.io/ccm-components/log/resources/configs.min.js", "greedy" ] ]
  }
};