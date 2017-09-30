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
  "se_ws17_teambuild": {  // created for ccm.log-1.0.0.js, ccm.teambuild-1.0.0.js, ccm.user-2.0.0.js
    "events": {
      "ready": {
        "browser": true,
        "user": true,
        "website": true
      },
      "start": {
        "data": true,
        "user": true
      },
      "join": {
        "data": true,
        "user": true
      },
      "leave": {
        "data": true,
        "user": true
      },
      "rename": {
        "data": true,
        "user": true
      }
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
      }
    }
  }
};