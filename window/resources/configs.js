/**
 * @overview configurations of ccm component for flying windows
 * @author André Kless <andre.kless@web.de> 2018
 * @license The MIT License (MIT)
 */

ccm.files[ 'configs.js' ] = {

  "local": {
    "key": "local",
    "css": [ "ccm.load", "../window/resources/default.css" ],
    "app": [ "ccm.instance", "../blank/ccm.blank.js" ],
    "icon": "../../digital-maker-space/dms/resources/component.png"
  },

  "demo": {
    "key": "demo",
    "app": [ "ccm.instance", "https://ccmjs.github.io/akless-components/blank/ccm.blank.js" ]
  }

};