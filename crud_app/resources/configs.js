/**
 * @overview configurations of ccm component for Create/Read/Update/Delete a Modular App
 * @author André Kless <andre.kless@web.de> 2018
 * @license The MIT License (MIT)
 */

ccm.files[ 'configs.js' ] = {
  "cloze": {
    "builder": [ "ccm.component", "https://akless.github.io/ccm-components/cloze_builder/versions/ccm.cloze_builder-1.6.0.min.js", { "submit_button": false } ],
    "store": [ "ccm.store", { "store": "w2c_cloze", "url": "https://ccm.inf.h-brs.de" } ],
    "url": "https://akless.github.io/ccm-components/cloze/versions/ccm.cloze-2.2.0.min.js",
    "logger": [ "ccm.instance", "https://akless.github.io/ccm-components/log/versions/ccm.log-2.0.1.min.js", [ "ccm.get", "https://akless.github.io/ccm-components/log/resources/configs.min.js", "greedy" ] ]
  },
  "cloze_lea": {
    "builder": [ "ccm.component", "https://194.95.67.24/ccm-components/cloze_builder/versions/ccm.cloze_builder-1.6.0.js", { "submit_button": false } ],
    "store": [ "ccm.store", { "store": "cloze", "url": "https://10.100.2.108" } ],
    "url": "https://194.95.67.24/ccm-components/cloze/versions/ccm.cloze-2.2.0.js"
  },
  "pdf_viewer": {
    "builder": [ "ccm.component", "https://tkless.github.io/ccm-components/pdf_viewer_builder/versions/ccm.pdf_viewer_builder-1.0.0.min.js", [ "ccm.get", "https://tkless.github.io/ccm-components/pdf_viewer_builder/resources/configs.min.js", "local" ] ],
    "store": [ "ccm.store", { "store": "w2c_pdf_viewer", "url": "https://ccm.inf.h-brs.de" } ],
    "url": "https://tkless.github.io/ccm-components/pdf_viewer/versions/ccm.pdf_viewer-1.0.0.min.js"
  },
  "pdf_viewer_lea": {
    "builder": [ "ccm.component", "https://194.95.67.24/ccm-components/pdf_viewer_builder/versions/ccm.pdf_viewer_builder-1.0.0.js", [ "ccm.get", "https://194.95.67.24/ccm-components/pdf_viewer_builder/resources/configs.js", "local" ] ],
    "store": [ "ccm.store", { "store": "w2c_pdf_viewer", "url": "https://10.100.2.108" } ],
    "url": "https://194.95.67.24/ccm-components/pdf-viewer/versions/ccm.pdf_viewer-1.0.0.js"
  },
  "teambuild": {
    "builder": [ "ccm.component", "https://akless.github.io/ccm-components/teambuild_builder/versions/ccm.teambuild_builder-2.3.0.min.js" ],
    "store": [ "ccm.store", { "store": "w2c_teambuild", "url": "https://ccm.inf.h-brs.de" } ],
    "url": "https://akless.github.io/ccm-components/teambuild/versions/ccm.teambuild-1.0.1.min.js",
    "logger": [ "ccm.instance", "https://akless.github.io/ccm-components/log/versions/ccm.log-2.0.1.min.js", [ "ccm.get", "https://akless.github.io/ccm-components/log/resources/configs.min.js", "greedy" ] ]
  },
  "teambuild_lea": {
    "builder": [ "ccm.component", "https://194.95.67.24/ccm-components/teambuild_builder/versions/ccm.teambuild_builder-2.3.0.js" ],
    "store": [ "ccm.store", { "store": "w2c_teambuild", "url": "https://10.100.2.108" } ],
    "url": "https://194.95.67.24/ccm-components/teambuild/versions/ccm.teambuild-1.0.1.js"
  }
};