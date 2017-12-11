/**
 * @overview ccm instance configurations
 * @author André Kless <andre.kless@web.de> 2017
 * @license The MIT License (MIT)
 */
ccm.files[ "configs.js" ] = {
  "le": {
    "css": [ "ccm.load", "https://akless.github.io/ccm-components/le/resources/weblysleek.css", { "context": "head", "url": "https://akless.github.io/ccm-components/libs/weblysleekui/font.css" } ],
    "content": [ "ccm.component", "https://akless.github.io/ccm-components/content/versions/ccm.content-2.0.0.min.js" ],
    "innerHTML": "Hello, World!",
    "logo": "https://akless.github.io/akless/we/logo.png",
    "topic_prefix": "Lerneinheit:",
    "topic": "Einstieg in JavaScript",
    "link_prefix": "Link: ",
    "target": "_blank",
    "author": "André Kless"
  }
};