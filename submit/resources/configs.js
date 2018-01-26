/**
 * @overview configurations of ccm component for submitting data
 * @author André Kless <andre.kless@web.de> 2017
 * @license The MIT License (MIT)
 */

ccm.files[ 'configs.js' ] = {

  "local": {
    "content": [ "ccm.component", "https://akless.github.io/ccm-components/content/versions/ccm.content-2.0.0.js" ],
    "cloze_builder": [ "ccm.component", "https://akless.github.io/ccm-components/cloze_builder/versions/ccm.cloze_builder-1.3.0.js" ],
    "teambuild_builder": [ "ccm.component", "https://akless.github.io/ccm-components/teambuild_builder/versions/ccm.teambuild_builder-2.2.0.js" ],
    "thumb_rating": [ "ccm.component", "https://tkless.github.io/ccm-components/thumb_rating/versions/ccm.thumb_rating-1.0.0.js", [ "ccm.get", "https://tkless.github.io/ccm-components/thumb_rating/resources/configs.js", "demo" ] ],
    "user": [ "ccm.instance", "https://akless.github.io/ccm-components/user/versions/ccm.user-2.0.0.js" ],
    "logger": [ "ccm.instance", "https://akless.github.io/ccm-components/log/versions/ccm.log-1.0.0.js", [ 'ccm.get', 'https://akless.github.io/ccm-components/log/resources/configs.js', 'greedy' ] ],
    "data": {
      "store": [ "ccm.store", "../submit/resources/datasets.js" ],
      "key": "test"
    },
    "onfinish": { "log": true }
  },

  "remote": {
    "content": [ "ccm.component", "https://akless.github.io/ccm-components/content/versions/ccm.content-2.0.0.js" ],
    "cloze_builder": [ "ccm.component", "https://akless.github.io/ccm-components/cloze_builder/versions/ccm.cloze_builder-1.3.0.js" ],
    "teambuild_builder": [ "ccm.component", "https://akless.github.io/ccm-components/teambuild_builder/versions/ccm.teambuild_builder-2.2.0.js" ],
    "thumb_rating": [ "ccm.component", "https://tkless.github.io/ccm-components/thumb_rating/versions/ccm.thumb_rating-1.0.0.js", {
      "key": [ "ccm.get", "https://tkless.github.io/ccm-components/thumb_rating/resources/configs.js", "demo" ],
      "data": { "store": [ "ccm.store", { "store": "submit_rating", "url": "wss://ccm.inf.h-brs.de" } ] }
    } ],
    "user": [ "ccm.instance", "https://akless.github.io/ccm-components/user/versions/ccm.user-2.0.0.js", { "sign_on": "hbrsinfkaul" } ],
    "logger": [ "ccm.instance", "https://akless.github.io/ccm-components/log/versions/ccm.log-1.0.0.js", [ 'ccm.get', 'https://akless.github.io/ccm-components/log/resources/configs.js', 'greedy' ] ],
    "data": {
      "store": [ "ccm.store", { "store": "submit", "url": "https://ccm.inf.h-brs.de" } ],
      "key": "test"
    },
    "onfinish": {
      "log": true,
      "store": {
        "settings": { "store": "submit", "url": "https://ccm.inf.h-brs.de" },
        "key": "test",
        "user": false,
        "permissions": {
          "group": {
            "mkaul2m": true,
            "akless2m": true
          },
          "access": {
            "get": "group",
            "set": "creator",
            "del": "all"
          }
        }
      }
    }
  },

  "demo": {
    "content": [ "ccm.component", "https://akless.github.io/ccm-components/content/versions/ccm.content-2.0.0.min.js" ],
    "cloze_builder": [ "ccm.component", "https://akless.github.io/ccm-components/cloze_builder/versions/ccm.cloze_builder-1.3.0.min.js" ],
    "teambuild_builder": [ "ccm.component", "https://akless.github.io/ccm-components/teambuild_builder/versions/ccm.teambuild_builder-2.2.0.min.js" ],
    "thumb_rating": [ "ccm.component", "https://tkless.github.io/ccm-components/thumb_rating/versions/ccm.thumb_rating-1.0.0.min.js", {
      "key": [ "ccm.get", "https://tkless.github.io/ccm-components/thumb_rating/resources/configs.min.js", "demo" ],
      "data": { "store": [ "ccm.store", { "store": "submit_rating", "url": "wss://ccm.inf.h-brs.de" } ] }
    } ],
    "user": [ "ccm.instance", "https://akless.github.io/ccm-components/user/versions/ccm.user-2.0.0.min.js", { "sign_on": "demo" } ],
    "logger": [ "ccm.instance", "https://akless.github.io/ccm-components/log/versions/ccm.log-1.0.0.min.js", [ 'ccm.get', 'https://akless.github.io/ccm-components/log/resources/configs.min.js', 'greedy' ] ],
    "data": {
      "store": [ "ccm.store", { "store": "submit", "url": "https://ccm.inf.h-brs.de" } ],
      "key": "demo"
    },
    "onfinish": {
      "log": true,
      "store": {
        "settings": { "store": "submit", "url": "https://ccm.inf.h-brs.de" },
        "key": "demo",
        "user": false
      }
    }
  }

};