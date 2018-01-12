/**
 * @overview configurations of ccm component for rendering a YouTube Player
 * @author André Kless <andre.kless@web.de> 2018
 * @license The MIT License (MIT)
 */

ccm.files[ 'configs.js' ] = {
  "local": {
    "css": [ "ccm.load", "../youtube/resources/default.css" ],
    "logger": [ "ccm.instance", "../log/ccm.log.js", [ "ccm.get", "../log/resources/configs.js", "greedy" ] ],
    "user": [ "ccm.instance", "../user/ccm.user.js" ],
    "onfinish": { "restart": true }
  },
  "demo": {
    "css": [ "ccm.load", "https://akless.github.io/ccm-components/youtube/resources/default.css" ],
    "logger": [ "ccm.instance", "https://akless.github.io/ccm-components/log/versions/ccm.log-2.0.0.min.js", [ "ccm.get", "https://akless.github.io/ccm-components/log/resources/configs.min.js", "greedy" ] ],
    "user": [ "ccm.instance", "https://akless.github.io/ccm-components/user/versions/ccm.user-2.0.1.min.js" ],
    "onfinish": { "restart": true }
  }
};