/**
 * @overview configurations of ccm component for interpreting a given JavaScript expression
 * @author André Kless <andre.kless@web.de> 2017
 * @license The MIT License (MIT)
 */

ccm.files[ 'configs.js' ] = {
  "demo": {
    "expression": "{\n  \"foo\": \"bar\",\n  \"numbers\": [ 1, 2, 3 ],\n  \"i\": 5711,\n  \"valid\": true\n}",
    "json_parse": true,
    "user": [ "ccm.instance", "https://akless.github.io/ccm-components/user/ccm.user.js" ],
    "logger": [ "ccm.instance", "https://akless.github.io/ccm-components/log/ccm.log.js", [ "ccm.get", "https://akless.github.io/ccm-components/log/resources/configs.js", "greedy" ] ]
  },
  "local": {
    "expression": "{\n  \"foo\": \"bar\",\n  \"numbers\": [ 1, 2, 3 ],\n  \"i\": 5711,\n  \"valid\": true\n}",
    "json_parse": true,
    "user": [ "ccm.instance", "../user/ccm.user.js" ],
    "logger": [ "ccm.instance", "../log/ccm.log.js", [ "ccm.get", "../log/resources/configs.js", "greedy" ] ]
  }
};