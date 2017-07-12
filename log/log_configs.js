/**
 * @overview configurations of <i>ccm</i> component for data logging
 * @author André Kless <andre.kless@web.de> 2017
 * @license The MIT License (MIT)
 */

ccm.files[ "log.configs.min.js" ] = {
  "greedy": {
    "logging": {
      "data": true,
      "browser": true,
      "parent": true,
      "root": true,
      "user": true,
      "website": true
    },
    "onfinish": { "log": true }
  }
};