/**
 * @overview configurations of ccm component for rendering a listing
 * @author André Kless <andre.kless@web.de> 2018
 * @license The MIT License (MIT)
 */

ccm.files[ 'configs.js' ] = {
  "local": {
    "user": [ "ccm.instance", "../user/ccm.user.js", { "realm": "hbrsinfkaul", "logged_in": true } ],
    "data": {
      "store": [ "ccm.store", { "url": "http://localhost:8080", "store": "show_solutions", "method": "POST" } ],
      "key": "{}"
    },
    "target": [ "ccm.component", "https://tkless.github.io/ccm-components/table/ccm.table.js" ]
  },
  "we_ss18_le01_a1": {
    "user": [ "ccm.instance", "https://akless.github.io/ccm-components/user/versions/beta/ccm.user-4.0.0.min.js", { "realm": "hbrsinfkaul", "logged_in": true } ],
    "data": {
      "store": [ "ccm.store", { "url": "https://ccm2.inf.h-brs.de", "store": "we_ss18_solutions", "method": "POST" } ],
      "key": { "_id": { "$regex": "le01_a1$" } }
    },
    "target": [ "ccm.component", "https://tkless.github.io/ccm-components/table/ccm.table.min.js" ]
  }
};