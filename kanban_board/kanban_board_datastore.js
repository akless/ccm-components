/**
 * @overview <i>ccm</i> datasets of ccm component for rendering a kanban board
 * @author André Kless <andre.kless@web.de> 2017
 * @license The MIT License (MIT)
 */

ccm.files[ "kanban_board_datastore.min.js" ] = {
  "demo": {
    "lanes": [
      {
        "title": "ToDo",
        "cards": [
          {},
          { "data.key": "presentation" },
          { "data": { "store": [ "ccm.store", { "store": "kanban_cards", "url": "wss://ccm.inf.h-brs.de" } ], "key": "demo" } }
        ]
      },
      "Doing",
      "Done"
    ]
  }
};