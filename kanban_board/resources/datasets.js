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
          [ "ccm.get", "../kanban_card/resources/configs.js", "homework" ],
          [ "ccm.get", "../kanban_card/resources/configs.js", "presentation" ]
        ]
      }
    ]
  }
};