/**
 * @overview configurations of ccm component for Create/Read/Update/Delete a Modular App
 * @author André Kless <andre.kless@web.de> 2018
 * @license The MIT License (MIT)
 */

ccm.files[ 'configs.js' ] = {
  "cloze": {
    "builder": [ "ccm.component", "../cloze_builder/ccm.cloze_builder.js", { "submit_button": false } ],
    "store": [ "ccm.store", { "store": "w2c_cloze", "url": "https://ccm.inf.h-brs.de" } ],
    "url": "https://akless.github.io/ccm-components/cloze/versions/ccm.cloze-2.2.0.min.js"
  }
};