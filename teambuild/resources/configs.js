/**
 * @overview configurations of ccm component for realtime team building
 * @author André Kless <andre.kless@web.de> 2017-2018
 * @license The MIT License (MIT)
 */

ccm.files[ 'configs.js' ] = {
  "local": {
    "css": [ "ccm.load", "../teambuild/resources/akless.css" ],
    "data": {
      "store": [ "ccm.store", {} ],
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
    "user": [ "ccm.instance", "https://akless.github.io/ccm-components/user/versions/ccm.user-2.0.0.min.js", { "logged_in": true, "sign_on": "guest" } ],
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
  "se_ws17_gr1": {  // created for ccm.teambuild-1.0.0.js
    "css": [ "ccm.load", "https://akless.github.io/ccm-components/teambuild/resources/akless.css" ],
    "data": {
      "store": [ "ccm.store", { "store": "teambuild", "url": "wss://ccm.inf.h-brs.de" } ],
      "key": "se_ws17_gr1"
    },
    "editable": false,
    "max_members": 3,
    "user": [ "ccm.instance", "https://akless.github.io/ccm-components/user/versions/ccm.user-2.0.0.min.js", { "logged_in": true, "sign_on": "hbrsinfkaul" } ],
    "logger": [ "ccm.instance", "https://akless.github.io/ccm-components/log/versions/ccm.log-1.0.0.min.js", [ "ccm.get", "https://akless.github.io/ccm-components/log/resources/configs.min.js", "se_ws17_teambuild" ] ]
  },
  "se_ws17_gr2": {  // created for ccm.teambuild-1.0.0.js
    "css": [ "ccm.load", "https://akless.github.io/ccm-components/teambuild/resources/akless.css" ],
    "data": {
      "store": [ "ccm.store", { "store": "teambuild", "url": "wss://ccm.inf.h-brs.de" } ],
      "key": "se_ws17_gr2"
    },
    "editable": false,
    "max_members": 3,
    "user": [ "ccm.instance", "https://akless.github.io/ccm-components/user/versions/ccm.user-2.0.0.min.js", { "logged_in": true, "sign_on": "hbrsinfkaul" } ],
    "logger": [ "ccm.instance", "https://akless.github.io/ccm-components/log/versions/ccm.log-1.0.0.min.js", [ "ccm.get", "https://akless.github.io/ccm-components/log/resources/configs.min.js", "se_ws17_teambuild" ] ]
  },
  "se_ws17_gr3": {  // created for ccm.teambuild-1.0.0.js
    "css": [ "ccm.load", "https://akless.github.io/ccm-components/teambuild/resources/akless.css" ],
    "data": {
      "store": [ "ccm.store", { "store": "teambuild", "url": "wss://ccm.inf.h-brs.de" } ],
      "key": "se_ws17_gr3"
    },
    "editable": false,
    "max_members": 3,
    "user": [ "ccm.instance", "https://akless.github.io/ccm-components/user/versions/ccm.user-2.0.0.min.js", { "logged_in": true, "sign_on": "hbrsinfkaul" } ],
    "logger": [ "ccm.instance", "https://akless.github.io/ccm-components/log/versions/ccm.log-1.0.0.min.js", [ "ccm.get", "https://akless.github.io/ccm-components/log/resources/configs.min.js", "se_ws17_teambuild" ] ]
  },
  "se_ws17_gr4": {  // created for ccm.teambuild-1.0.0.js
    "css": [ "ccm.load", "https://akless.github.io/ccm-components/teambuild/resources/akless.css" ],
    "data": {
      "store": [ "ccm.store", { "store": "teambuild", "url": "wss://ccm.inf.h-brs.de" } ],
      "key": "se_ws17_gr4"
    },
    "editable": false,
    "max_members": 3,
    "user": [ "ccm.instance", "https://akless.github.io/ccm-components/user/versions/ccm.user-2.0.0.min.js", { "logged_in": true, "sign_on": "hbrsinfkaul" } ],
    "logger": [ "ccm.instance", "https://akless.github.io/ccm-components/log/versions/ccm.log-1.0.0.min.js", [ "ccm.get", "https://akless.github.io/ccm-components/log/resources/configs.min.js", "se_ws17_teambuild" ] ]
  },
  "se_ws17_gr5": {  // created for ccm.teambuild-1.0.0.js
    "css": [ "ccm.load", "https://akless.github.io/ccm-components/teambuild/resources/akless.css" ],
    "data": {
      "store": [ "ccm.store", { "store": "teambuild", "url": "wss://ccm.inf.h-brs.de" } ],
      "key": "se_ws17_gr5"
    },
    "editable": false,
    "max_members": 3,
    "user": [ "ccm.instance", "https://akless.github.io/ccm-components/user/versions/ccm.user-2.0.0.min.js", { "logged_in": true, "sign_on": "hbrsinfkaul" } ],
    "logger": [ "ccm.instance", "https://akless.github.io/ccm-components/log/versions/ccm.log-1.0.0.min.js", [ "ccm.get", "https://akless.github.io/ccm-components/log/resources/configs.min.js", "se_ws17_teambuild" ] ]
  },
  "se_ws17_gr6": {  // created for ccm.teambuild-1.0.0.js
    "css": [ "ccm.load", "https://akless.github.io/ccm-components/teambuild/resources/akless.css" ],
    "data": {
      "store": [ "ccm.store", { "store": "teambuild", "url": "wss://ccm.inf.h-brs.de" } ],
      "key": "se_ws17_gr6"
    },
    "editable": false,
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
    "editable": false,
    "user": [ "ccm.instance", "https://akless.github.io/ccm-components/user/versions/ccm.user-2.0.0.min.js", { "logged_in": true, "sign_on": "hbrsinfkaul" } ],
    "logger": [ "ccm.instance", "https://akless.github.io/ccm-components/log/versions/ccm.log-1.0.0.min.js", [ "ccm.get", "https://akless.github.io/ccm-components/log/resources/configs.min.js", "sks_ws17_teambuild" ] ]
  }
};