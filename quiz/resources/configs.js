/**
 * @overview configurations of ccm component for rendering a quiz
 * @author André Kless <andre.kless@web.de> 2017
 * @license The MIT License (MIT)
 */

ccm.files[ 'configs.js' ] = {
  "demo": {
    "html.start.inner.inner": "Start Demo Quiz",
    "css": [
      "ccm.load",
      {
        "url": "https://akless.github.io/ccm-components/quiz/resources/weblysleek.css",
        "integrity": "sha384-GmccgQziA4tv4Dy2opWuAnLF0yDCLmWzhdgiJJFOikFuXjW2BMb4Lmkg/zSpRlzq",
        "crossorigin": "anonymous"
      },
      {
        "context": "head",
        "url": "https://akless.github.io/ccm-components/libs/weblysleekui/font.css",
        "integrity": "sha384-UgtnWIHnlTSiLL0vo8T6Uj3wogCGsz/L2e3HfaWPlMjpHkPt5GQC3kgVNS3uyKLe",
        "crossorigin": "anonymous"
      }
    ],
    "user": [ "ccm.instance", {
      "url": "https://akless.github.io/ccm-components/user/versions/ccm.user-1.0.0.min.js",
      "integrity": "sha384-Br7iSlRBDu1/G/NsGjmN4GLppMHwNowkGQw+DE0270c+REvimjdv1z2VpwWSwvbh",
      "crossorigin": "anonymous"
    } ],
    "logger": [
      "ccm.instance",
      {
        "url": "https://akless.github.io/ccm-components/log/versions/ccm.log-1.0.0.min.js",
        "integrity": "sha384-O3A4V3rxXG32G0LmZzr8nUQlTI3ceZQO5bdfs7N8GiLdZ10Ch3QTyeg4jUy5PItE",
        "crossorigin": "anonymous"
      },
      [
        "ccm.get",
        {
          "url": "https://akless.github.io/ccm-components/log/resources/configs.min.js",
          "integrity": "",
          "crossorigin": "anonymous"
        },
        "greedy"
      ]
    ],
    "questions": [
      {
        "text": "How many of these answers are correct?",
        "description": "Select the correct answer from the following answers.",
        "answers": [
          {
            "text": "one",
            "comment": "Because you can't choose more than one answer."
          },
          "two",
          "three"
        ],
        "input": "radio",
        "correct": 0
      },
      {
        "text": "How many answers can be correct here?",
        "description": "Pay attention to the input field type.",
        "answers": [
          "absolutely none",
          {
            "text": "maximum of one",
            "comment": "Because you can choose more than one answer."
          },
          "more than one"
        ],
        "correct": [ true, false, true ]
      },
      {
        "text": "What is the solution to the following arithmetical tasks?",
        "description": "Please enter the solutions into the input fields.",
        "answers": [
          "=&nbsp; 1 + 1",
          "=&nbsp; 1 - 1",
          "=&nbsp;-1 - 1"
        ],
        "input": "number",
        "attributes": {
          "min": -2,
          "max": 2
        },
        "correct": [ 2, 0, -2 ]
      }
    ],
    "start_button": true,
    "feedback": true,
    "navigation": true,
    "onfinish": { "restart": true }
  },
  "local": {
    "html.start.inner.inner": "Start Demo Quiz",
    "css": [ "ccm.load", "resources/weblysleek.css", { "context": "head", "url": "../libs/weblysleekui/font.css" } ],
    "user": [ "ccm.instance", "../user/ccm.user.js" ],
    "logger": [ "ccm.instance", "../log/ccm.log.js", [ "ccm.get", "../log/resources/configs.js", "greedy" ] ],
    "questions": [
      {
        "text": "How many of these answers are correct?",
        "description": "Select the correct answer from the following answers.",
        "answers": [
          {
            "text": "one",
            "comment": "Because you can't choose more than one answer."
          },
          "two",
          "three"
        ],
        "input": "radio",
        "correct": 0
      },
      {
        "text": "How many answers can be correct here?",
        "description": "Pay attention to the input field type.",
        "answers": [
          "absolutely none",
          {
            "text": "maximum of one",
            "comment": "Because you can choose more than one answer."
          },
          "more than one"
        ],
        "correct": [ true, false, true ]
      },
      {
        "text": "What is the solution to the following arithmetical tasks?",
        "description": "Please enter the solutions into the input fields.",
        "answers": [
          "=&nbsp; 1 + 1",
          "=&nbsp; 1 - 1",
          "=&nbsp;-1 - 1"
        ],
        "input": "number",
        "attributes": {
          "min": -2,
          "max": 2
        },
        "correct": [ 2, 0, -2 ]
      }
    ],
    "start_button": true,
    "feedback": true,
    "navigation": true,
    "onfinish": { "restart": true }
  }
};