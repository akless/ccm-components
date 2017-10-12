/**
 * @overview configurations of ccm component for rendering a kanban board
 * @author André Kless <andre.kless@web.de> 2017
 * @license The MIT License (MIT)
 */

ccm.files[ 'configs.js' ] = {

  "local": {
    "css": [ "ccm.load", "../kanban_board/resources/default.css" ],
    "data": {
      "store": [ "ccm.store", "../kanban_board/resources/datasets.js" ],
      "key": "local"
    },
    "card": {
      "component": "../kanban_card/ccm.kanban_card.js",
      "config": {
        "font": [ "ccm.load", { "context": "head", "url": "../libs/weblysleekui/font.css" } ],
        "css": [ "ccm.load", "../kanban_card/resources/weblysleek.css" ],
        "logger": [ "ccm.instance", "../log/ccm.log.js", [ "ccm.get", "../log/resources/configs.js", "greedy" ] ]
      }
    }
  },

  "remote": {
    "css": [ "ccm.load", "../kanban_board/resources/default.css" ],
    "data": {
      "store": [ "ccm.store", { "store": "kanban_board", "url": "wss://ccm.inf.h-brs.de" } ],
      "key": "test"
    },
    "card": {
      "component": "../kanban_card/ccm.kanban_card.js",
      "config": {
        "font": [ "ccm.load", { "context": "head", "url": "../libs/weblysleekui/font.css" } ],
        "css": [ "ccm.load", "../kanban_card/resources/weblysleek.css" ],
        "data": {
          "store": [ "ccm.store", { "store": "kanban_card", "url": "wss://ccm.inf.h-brs.de" } ],
          "permission_settings": { "access": "group" }
        },
        "logger": [ "ccm.instance", "../log/ccm.log.js", [ "ccm.get", "../log/resources/configs.js", "greedy" ] ]
      }
    }
  },

  "demo": {
    "css": [ "ccm.load", "https://akless.github.io/ccm-components/kanban_board/resources/default.css" ],
    "data": {
      "store": [ "ccm.store", { "store": "kanban_board", "url": "wss://ccm.inf.h-brs.de" } ],
      "key": "demo"
    },
    "kanban_card": [ "ccm.component", "https://akless.github.io/ccm-components/kanban_card/versions/ccm.kanban_card-1.0.0.min.js", {
      "font": [ "ccm.load", { "context": "head", "url": "https://akless.github.io/ccm-components/libs/weblysleekui/font.css" } ],
      "css": [ "ccm.load", "https://akless.github.io/ccm-components/kanban_card/resources/weblysleek.css" ],
      "data": {
        "store": [ "ccm.store", { "store": "kanban_card", "url": "wss://ccm.inf.h-brs.de" } ],
        "permission_settings": { "access": "group" }
      },
      "logger": [ "ccm.instance", "https://akless.github.io/ccm-components/log/versions/ccm.log-1.0.0.min.js", [ "ccm.get", "https://akless.github.io/ccm-components/log/resources/configs.min.js", "greedy" ] ]
    } ]
  },

  "showcase": {
    "css": [ "ccm.load", "https://akless.github.io/ccm-components/kanban_board/resources/default.css" ],
    "data": {
      "store": [ "ccm.store", "https://akless.github.io/ccm-components/kanban_board/resources/datasets.min.js" ],
      "key": "showcase"
    },
    "kanban_card": [ "ccm.component", "https://akless.github.io/ccm-components/kanban_card/versions/ccm.kanban_card-1.0.0.min.js", {
      "members": [ "Almut", "Andre", "Manfred", "Ralph", "Regina", "Tea", "Thorsten" ]
    } ]
  },

  "experimental": {
    "css": [ "ccm.load", "https://akless.github.io/ccm-components/kanban_board/resources/default.css" ],
    "data": {
      "store": [ "ccm.store", "resources/datasets.min.js" ],
      "key": "experimental"
    }
  }

};