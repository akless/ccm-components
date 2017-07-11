/**
 * @overview configurations of <i>ccm</i> component for rendering a kanban card
 * @author André Kless <andre.kless@web.de> 2017
 * @license The MIT License (MIT)
 */

ccm.files[ "kanban_card_configs.min.js" ] = {
  "homework": {
    "css_layout": [ "ccm.load", "https://akless.github.io/ccm-components/kanban_card/layouts/default.css" ],
    "data": {
      "store": [ "ccm.store", "https://akless.github.io/ccm-components/kanban_card/kanban_card_datasets.min.js" ],
      "key": "homework"
    }
  },
  "presentation": {
    "css_layout": [ "ccm.load", "https://akless.github.io/ccm-components/kanban_card/layouts/demo.css" ],
    "data": {
      "store": [ "ccm.store", "https://akless.github.io/ccm-components/kanban_card/kanban_card_datasets.min.js" ],
      "key": "presentation"
    }
  },
  "realtime": {
    "css_layout": [ "ccm.load", "https://akless.github.io/ccm-components/kanban_card/layouts/demo.css" ],
    "data": {
      "store": [ "ccm.store", { "store": "kanban_cards", "url": "https://ccm.inf.h-brs.de" } ],
      "key": "demo"
    }
  }
};