/**
 * @overview configurations of ccm component for rendering a kanban board
 * @author André Kless <andre.kless@web.de> 2017
 * @license The MIT License (MIT)
 */

ccm.files[ "kanban_board_configs.min.js" ] = {
  "demo": {
    "css_layout": [ "ccm.load", "https://akless.github.io/ccm-components/kanban_board/resources/default.css" ],
    "data": {
      "store": [ "ccm.store", "https://akless.github.io/ccm-components/kanban_board/resources/kanban_board_datasets.min.js" ],
      "key": "demo"
    }
  }
};