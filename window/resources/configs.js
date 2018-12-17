/**
 * @overview configurations of ccm component for flying windows
 * @author André Kless <andre.kless@web.de> 2018
 * @license The MIT License (MIT)
 */

ccm.files[ 'configs.js' ] = {

  "local": {
    "key": "local",
    "css": [ "ccm.load", "../window/resources/default.css" ],
    "app": [ "ccm.start", "../../akless-components/blank/ccm.blank.js" ],
    "icon": "../../akless-components/dms/resources/component.png",
    "compact": false,
    "hidden": false
  },

  "demo": {
    "key": "demo",
    "app": [ "ccm.start", "https://ccmjs.github.io/akless-components/blank/ccm.blank.js" ]
  }

};