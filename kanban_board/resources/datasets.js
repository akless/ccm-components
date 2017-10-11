/**
 * @overview datasets of ccm component for rendering a kanban board
 * @author André Kless <andre.kless@web.de> 2017
 * @license The MIT License (MIT)
 */

ccm.files[ 'datasets.js' ] = {

  "local": {
    "key": "local",
    "lanes": [
      {
        "cards": [
          [ "ccm.instance", "../kanban_card/ccm.kanban_card.js", [ "ccm.get", "../kanban_card/resources/configs.js", "homework" ] ],
          [ "ccm.instance", "../kanban_card/ccm.kanban_card.js", [ "ccm.get", "../kanban_card/resources/configs.js", "presentation" ] ]
        ]
      }
    ]
  },

  "showcase": {
    "key": "showcase",
    "lanes": [
      {
        "cards": [
          [ "ccm.instance", "https://akless.github.io/ccm-components/kanban_card/versions/kanban_card-1.0.0.min.js", [ "ccm.get", "https://akless.github.io/ccm-components/kanban_card/resources/configs.min.js", "test" ] ],
          [ "ccm.instance", "https://akless.github.io/ccm-components/kanban_card/versions/kanban_card-1.0.0.min.js", [ "ccm.get", "https://akless.github.io/ccm-components/kanban_card/resources/configs.min.js", "realtime" ] ]
        ]
      },
      {
        "cards": [
          [ "ccm.instance", "https://akless.github.io/ccm-components/kanban_card/versions/kanban_card-1.0.0.min.js", [ "ccm.get", "https://akless.github.io/ccm-components/kanban_card/resources/configs.min.js", "w2c" ] ]
        ]
      },
      {
        "cards": [
          [ "ccm.instance", "https://akless.github.io/ccm-components/kanban_card/versions/kanban_card-1.0.0.min.js", [ "ccm.get", "https://akless.github.io/ccm-components/kanban_card/resources/configs.min.js", "lea" ] ],
          [ "ccm.instance", "https://akless.github.io/ccm-components/kanban_card/versions/kanban_card-1.0.0.min.js", [ "ccm.get", "https://akless.github.io/ccm-components/kanban_card/resources/configs.min.js", "more" ] ]
        ]
      }
    ]
  }

};