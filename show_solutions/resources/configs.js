/**
 * @overview configurations of ccm component for rendering a listing
 * @author André Kless <andre.kless@web.de> 2018
 * @license The MIT License (MIT)
 */

ccm.files[ 'configs.js' ] = {
  "local": {
  //"css": [ "ccm.load", "resources/default.css" ],
    "user": [ "ccm.instance", "../../ccm-components/user/ccm.user.js", { "realm": "hbrsinfkaul", "logged_in": true } ],
  //"logger": [ "ccm.instance", "../log/ccm.log.js", [ "ccm.get", "../log/resources/configs.js", "greedy" ] ],
    "data": {
      "store": [ "ccm.store", { "url": "https://ccm2.inf.h-brs.de", "store": "we_ss18_solutions", "method": "POST" } ],
    //"key": { "_id": { "$regex": "^akless2s" } }
      "key": { "_id": { "$regex": "le01_a1$" } }
    },
    "target": [ "ccm.component", "../../tkless-ccm-components/table/ccm.table.js" ],
  //"onfinish": { "log": true }
  }
};