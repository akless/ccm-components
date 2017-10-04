/**
 * @overview configurations of ccm component for realtime team building
 * @author André Kless <andre.kless@web.de> 2017
 * @license The MIT License (MIT)
 */

ccm.files[ 'configs.js' ] = {
  "local": {
    "css": [ "ccm.load", "../teambuild/resources/akless.css" ],
    "data": {
      "store": [ "ccm.store" ],
      "key": "demo"
    },
    "user": [ "ccm.instance", "../user/ccm.user.js", { "logged_in": true, "sign_on": "demo" } ],
    "logger": [ "ccm.instance", "../log/ccm.log.js", [ "ccm.get", "../log/resources/configs.js", "greedy" ] ]
  },
  "demo": {
    "css": [ "ccm.load", "https://akless.github.io/ccm-components/teambuild/resources/akless.css" ],
    "data": {
      "store": [ "ccm.store", { "store": "teambuild", "url": "wss://ccm.inf.h-brs.de", "db": "redis" } ],
      "key": "demo"
    },
    "user": [ "ccm.instance", "https://akless.github.io/ccm-components/user/versions/ccm.user-2.0.0.min.js", { "logged_in": true, "sign_on": "demo" } ],
    "logger": [ "ccm.instance", "https://akless.github.io/ccm-components/log/versions/ccm.log-1.0.0.min.js", [ "ccm.get", "https://akless.github.io/ccm-components/log/resources/configs.min.js", "greedy" ] ]
  },
  "clicker": {
    "css": [ "ccm.load", "https://akless.github.io/ccm-components/teambuild/resources/akless.css" ],
    "data": {
      "store": [ "ccm.store", { "store": "teambuild", "url": "wss://ccm.inf.h-brs.de", "db": "redis" } ],
      "key": "clicker"
    },
    "names": [ "Stimmt", "Stimmt nicht", "Kommt drauf an" ],
    "max_teams": 3,
    "editable": { "join": true, "leave": true, "rename": false },
    "user": [ "ccm.instance", "https://akless.github.io/ccm-components/user/versions/ccm.user-2.0.0.min.js", { "logged_in": true, "sign_on": "demo" } ],
    "logger": [ "ccm.instance", "https://akless.github.io/ccm-components/log/versions/ccm.log-1.0.0.min.js", [ "ccm.get", "https://akless.github.io/ccm-components/log/resources/configs.min.js", "greedy" ] ]
  },
  "se_ws17": {  // created for ccm.teambuild-1.0.0.js
    "css": [ "ccm.load", "https://akless.github.io/ccm-components/teambuild/resources/akless.css" ],
    "data": {
      "store": [ "ccm.store", { "store": "teambuild", "url": "wss://ccm.inf.h-brs.de" } ],
      "key": "se_ws17"
    },
    "max_members": 3,
    "user": [ "ccm.instance", "https://akless.github.io/ccm-components/user/versions/ccm.user-2.0.0.min.js", { "logged_in": true, "sign_on": "hbrsinfkaul" } ],
    "logger": [ "ccm.instance", "https://akless.github.io/ccm-components/log/versions/ccm.log-1.0.0.min.js", [ "ccm.get", "https://akless.github.io/ccm-components/log/resources/configs.min.js", "se_ws17_teambuild" ] ]
  },
  "sks_ws17": {  // created for ccm.teambuild-1.0.0.js
    "css": [ "ccm.load", "https://akless.github.io/ccm-components/teambuild/resources/akless.css" ],
    "data": {
      "store": [ "ccm.store", { "store": "teambuild", "url": "wss://ccm.inf.h-brs.de" } ],
      "key": "sks_ws17"
    },
    "names": [ "Gruppe Prof. Dr. Manfred Kaul", "Gruppe Prof. Dr. Rudolf Berrendorf", "Gruppe Prof. Dr. Sascha Alda", "Gruppe Prof. Dr. Simone Bürsner" ],
    "max_teams": 4,
    "max_members": 12,
    "editable": { "join": true, "leave": true, "rename": false },
    "user": [ "ccm.instance", "https://akless.github.io/ccm-components/user/versions/ccm.user-2.0.0.min.js", { "logged_in": true, "sign_on": "hbrsinfkaul" } ],
    "logger": [ "ccm.instance", "https://akless.github.io/ccm-components/log/versions/ccm.log-1.0.0.min.js", [ "ccm.get", "https://akless.github.io/ccm-components/log/resources/configs.min.js", "sks_ws17_teambuild" ] ]
  }
};