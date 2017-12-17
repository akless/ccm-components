/**
 * @overview configurations of ccm component for rendering a fill-in-the-blank text
 * @author André Kless <andre.kless@web.de> 2017
 * @license The MIT License (MIT)
 */

ccm.files[ 'configs.js' ] = {
  "demo": {
    "css": [ "ccm.load", "https://akless.github.io/ccm-components/cloze/resources/lea.css", { "context": "head", "url": "https://fonts.googleapis.com/css?family=Montserrat:200" } ],
    "feedback": true,
    "time": 300,
    "keywords": [ "convenience", "conducting", "objectives", "durable", "competitive", "breakdown", "reasons", "evaluate", "adding", "breakthroughs", "withdraw", "patterns", "non-durable", "deleting", "feasible", "making", "sources", "niche" ],
    "text": "<ol><li>To stay competitive companies must [[evaluate]] their existing product line and make decisions about [[deleting]] or [[adding]] new products.</li><li>Innovation can have different [[sources]] e.g. “Discontinuous” innovation, which can change existing consumption [[patterns]].</li><li>Innovations are of extreme importance for organizations; some innovations are caused by technical [[breakthroughs]].</li><li>In order to be successful companies may need to look for a market [[niche]].</li><li> It is assumed that [[durable]] goods last more than one year. [[Non-durable]]  goods are tangible but provide benefits only for a short period of time. [[convenience]] products are goods that consumers buy frequently like soft drinks, newspapers etc.</li><li>A business model identifies such things as [[competitive]] advantage, and how to become profitable. Some business models may not be [[feasible]] any longer.</li><li>One way to evaluate a product is by [[conducting]] a discrimination test.</li><li>When a product fails i.e. it does not meet the [[objectives]] that were set by the organization, the company may be forced to [[withdraw]] it from the market, as was the case with Walmart in Germany.</li></ol>",
    "blank": true,
    "solutions": true,
    "captions.finish": "Restart",
    "logger": [ "ccm.instance", "https://akless.github.io/ccm-components/log/versions/ccm.log-1.0.0.min.js", [ "ccm.get", "https://akless.github.io/ccm-components/log/resources/configs.min.js", "greedy" ] ],
    "onfinish": { "log": true, "restart": true }
  },
  "local": {
    "css": [ "ccm.load", "resources/lea.css", { "context": "head", "url": "https://fonts.googleapis.com/css?family=Montserrat:200" } ],
    "feedback": true,
    "time": 300,
    "keywords": [ "convenience", "conducting", "objectives", "durable", "competitive", "breakdown", "reasons", "evaluate", "adding", "breakthroughs", "withdraw", "patterns", "non-durable", "deleting", "feasible", "making", "sources", "niche" ],
    "text": "<ol><li>To stay competitive companies must [[evaluate]] their existing product line and make decisions about [[deleting]] or [[adding]] new products.</li><li>Innovation can have different [[sources]] e.g. “Discontinuous” innovation, which can change existing consumption [[patterns]].</li><li>Innovations are of extreme importance for organizations; some innovations are caused by technical [[breakthroughs]].</li><li>In order to be successful companies may need to look for a market [[niche]].</li><li> It is assumed that [[durable]] goods last more than one year. [[Non-durable]]  goods are tangible but provide benefits only for a short period of time. [[convenience]] products are goods that consumers buy frequently like soft drinks, newspapers etc.</li><li>A business model identifies such things as [[competitive]] advantage, and how to become profitable. Some business models may not be [[feasible]] any longer.</li><li>One way to evaluate a product is by [[conducting]] a discrimination test.</li><li>When a product fails i.e. it does not meet the [[objectives]] that were set by the organization, the company may be forced to [[withdraw]] it from the market, as was the case with Walmart in Germany.</li></ol>",
    "blank": true,
    "solutions": true,
    "captions.finish": "Restart",
    "logger": [ "ccm.instance", "https://akless.github.io/ccm-components/log/versions/ccm.log-1.0.0.min.js", [ "ccm.get", "https://akless.github.io/ccm-components/log/resources/configs.min.js", "greedy" ] ],
    "onfinish": { "log": true, "restart": true }
  }
};