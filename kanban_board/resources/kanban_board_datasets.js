/**
 * @overview datasets of ccm component for rendering a kanban board
 * @author André Kless <andre.kless@web.de> 2017
 * @license The MIT License (MIT)
 */

ccm.files[ "kanban_board_datasets.min.js" ] = {
  "demo": {
    "lanes": [
      {
        "cards": [
          [ "ccm.get", "https://akless.github.io/ccm-components/kanban_card/resources/kanban_card_configs.min.js", "homework" ],
          [ "ccm.get", "https://akless.github.io/ccm-components/kanban_card/resources/kanban_card_configs.min.js", "presentation" ],
          [ "ccm.get", "https://akless.github.io/ccm-components/kanban_card/resources/kanban_card_configs.min.js", "realtime" ]
        ]
      }
    ]
  }
};