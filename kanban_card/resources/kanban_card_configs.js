/**
 * @overview configurations of <i>ccm</i> component for rendering a kanban card
 * @author André Kless <andre.kless@web.de> 2017
 * @license The MIT License (MIT)
 */

ccm.files[ "kanban_card_configs.min.js" ] = {
  "homework": {
    "css_layout": [ "ccm.load", "https://akless.github.io/ccm-components/kanban_card/resources/default.css" ],
    "data": {
      "store": [ "ccm.store", "https://akless.github.io/ccm-components/kanban_card/resources/kanban_card_datasets.min.js" ],
      "key": "homework"
    }
  },
  "presentation": {
    "css_layout": [ "ccm.load", "https://akless.github.io/ccm-components/kanban_card/resources/demo.css" ],
    "data": {
      "store": [ "ccm.store", "https://akless.github.io/ccm-components/kanban_card/resources/kanban_card_datasets.min.js" ],
      "key": "presentation"
    }
  },
  "realtime": {
    "font": [ "ccm.load", { "context": "head", "url": "https://akless.github.io/ccm-components/libs/weblysleekui/font.css" } ],
    "css_layout": [ "ccm.load", "https://akless.github.io/ccm-components/kanban_card/resources/weblysleek.css" ],
    "data": {
      "store": [ "ccm.store", { "store": "kanban_cards", "url": "wss://ccm.inf.h-brs.de" } ],
      "key": "demo",
      "permission_settings": {
        "access": "group"
      }
    }
  }
};