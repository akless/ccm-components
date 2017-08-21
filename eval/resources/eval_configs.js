/**
 * @overview configurations of <i>ccm</i> component for interpreting JavaScript expressions
 * @author André Kless <andre.kless@web.de> 2017
 * @license The MIT License (MIT)
 */

ccm.files[ "eval_configs.js" ] = {
  "demo": {
    "expression": "{\n  \"foo\": \"bar\",\n  \"numbers\": [ 1, 2, 3 ],\n  \"i\": 5711,\n  \"valid\": true\n}",
    "json_parse": true,
    "user": [ "ccm.instance", "https://akless.github.io/ccm-components/user/versions/ccm.user-1.0.0.min.js" ],
    "logger": [ "ccm.instance", "https://akless.github.io/ccm-components/log/versions/ccm.log-1.0.0.min.js", [ "ccm.get", "https://akless.github.io/ccm-components/log/resources/log_configs.min.js", "greedy" ] ]
  }
};