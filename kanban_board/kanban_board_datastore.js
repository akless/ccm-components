/**
 * @overview <i>ccm</i> datasets of ccm component for rendering a kanban board
 * @author André Kless <andre.kless@web.de> 2017
 * @license The MIT License (MIT)
 */

ccm.files[ "kanban_board_datastore.min.js" ] = {
  "demo": {
    "lanes": [
      {
        "cards": [
          {},
          { "data": { "key": "presentation", "store": [ "ccm.store", "https://akless.github.io/ccm-components/kanban_card/resources/kanban_card_dataset.min.js" ] } },
          { "data": { "key": "demo", "store": [ "ccm.store", { "store": "kanban_cards", "url": "wss://ccm.inf.h-brs.de" } ] } }
        ]
      }
    ]
  }
};