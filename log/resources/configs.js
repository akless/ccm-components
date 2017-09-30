/**
 * @overview configurations of ccm component for data logging
 * @author André Kless <andre.kless@web.de> 2017
 * @license The MIT License (MIT)
 */

ccm.files[ 'configs.js' ] = {
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
  },
  "se_ws17_teambuild": {
    "logging": {
      "data": true,
      "browser": true,
      "parent": false,
      "root": false,
      "user": true,
      "website": true
    },
    "hash": [ "ccm.load", "https://akless.github.io/ccm-components/libs/md5/md5.min.js" ],
    "onfinish": {
      "store_settings": { "store": "se_ws17_teambuild_log", "url": "https://ccm.inf.h-brs.de" },
      "permissions": {
        "creator": "akless2m",
        "group": {
          "mkaul2m": true,
          "akless2m": true
        },
        "access": {
          "get": "group",
          "set": "creator",
          "del": "creator"
        }
      },
      "log": true
    }
  }
};