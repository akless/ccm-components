/**
 * @overview datasets of ccm component for rendering a kanban board
 * @author André Kless <andre.kless@web.de> 2017
 * @license The MIT License (MIT)
 */

ccm.files[ 'datasets.js' ] = {
  "demo": {
    "lanes": [
      {
        "cards": [
          [ "ccm.get", "https://akless.github.io/ccm-components/kanban_card/resources/configs.min.js", "homework" ],
          [ "ccm.get", "https://akless.github.io/ccm-components/kanban_card/resources/configs.min.js", "presentation" ],
          [ "ccm.get", "https://akless.github.io/ccm-components/kanban_card/resources/configs.min.js", "realtime" ]
        ]
      }
    ]
  },
  "local": {
    "lanes": [
      {
        "cards": [
          [ "ccm.get", "../kanban_card/resources/configs.js", "homework" ],
          [ "ccm.get", "../kanban_card/resources/configs.js", "presentation" ],
          [ "ccm.get", "../kanban_card/resources/configs.js", "realtime" ]
        ]
      }
    ]
  }
};