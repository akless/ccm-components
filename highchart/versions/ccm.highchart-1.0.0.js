/**
 * @overview ccm component for rendering a "Highchart.js" chart
 * @author André Kless <andre.kless@web.de> 2017
 * @copyright Copyright (c) 2017 Andre Kless
 * @license
 * Creative Commons Attribution-NonCommercial 3.0: https://creativecommons.org/licenses/by-nc/3.0/
 * Only for not-for-profit educational use.
 *
 * This ccm component uses „Highcharts JS“: https://www.highcharts.com
 * Make sure that you have a valid license of „Highcharts JS“ before using this ccm component.
 *
 * The developer Andre Kless of this component has a valid license of „Highcharts JS“ for not-for-profit educational use for the following product(s): Highcharts, Highstock, Highmaps
 * @version 1.0.0
 */

{
  var component = {

    /**
     * unique component name
     * @type {string}
     */
    name: 'highchart',

    /**
     * component version
     * @type {number[]}
     */
    version: [ 1, 0, 0 ],

    /**
     * reference to used framework version
     * @type {object}
     */
    ccm: {
      url: 'https://akless.github.io/ccm/version/ccm-12.12.0.min.js',
      integrity: 'sha384-1pDRNaBU2okRlEuyNp8icKgmsidtnoBsvFtbReMBrQv1bgQqCun0aw5DuTKu61Ts',
      crossorigin: 'anonymous'
    },

    /**
     * default instance configuration
     * @type {object}
     */
    config: {

      "html": {
        "id": "main",
        "inner": [
          { "id": "switcher" },
          { "id": "chart" }
        ]
      },
      "libs": [ "ccm.load", "https://code.highcharts.com/highcharts.js" ],
      "chart": "line"  // line|area|bar|column|pie|pie-semi-circle

  //  "css": [ "ccm.load": "https://akless.github.io/ccm-components/highchart/resources/default.css" ],
  //  "logger": [ "ccm.instance", "https://akless.github.io/ccm-components/log/versions/ccm.log-2.0.0.min.js", [ "ccm.get", "https://akless.github.io/ccm-components/log/resources/configs.min.js", "greedy" ] ]
  //  "switcher": true,
  //  "settings": {},
  //  "title": "My Chart",
  //  "subtitle": "Source: My Database",
  //  "categories": [ "Africa", "America", "Asia", "Europe", "Oceania" ],
  //  "y_title": "Total",
  //  "tooltip": "{series.name} produced <b>{point.y:,.0f}</b><br/>products in {point.x}",
  //  "point_start": 0,
  //  "data_label": "<b>{point.name}</b>: {point.percentage:.1f} %",
  //  "tooltip_label": "Brands",
  //  "no_style": true,
  //  "data": [ "Passed", 4 ], [ "Failed", 6 ] ]

    },

    /**
     * for creating instances out of this component
     * @constructor
     */
    Instance: function () {

      /**
       * own reference for inner functions
       * @type {Instance}
       */
      const self = this;

      /**
       * privatized instance members
       * @type {object}
       */
      let my;

      /**
       * shortcut to help functions
       * @type {Object.<string,function>}
       */
      let $;

      /**
       * is called once after the initialization and is then deleted
       * @param {function} callback - called after all synchronous and asynchronous operations are complete
       */
      this.ready = callback => {

        // set shortcut to help functions
        $ = self.ccm.helper;

        // privatize all possible instance members
        my = $.privatize( self );

        // logging of 'ready' event
        if ( self.logger ) self.logger.log( 'ready', my );

        callback();
      };

      /**
       * starts the instance
       * @param {function} [callback] - called after all synchronous and asynchronous operations are complete
       */
      this.start = callback => {

        // get dataset for rendering
        $.dataset( my.data, data => {
          my.data = data;

          // logging of 'start' event
          self.logger && self.logger.log( 'start', { chart: my.chart, data: data } );

          /**
           * main HTML structure
           * @type {Element}
           */
          const main_elem = $.html( my.html );

          /**
           * contains the chart
           * @type {Element}
           */
          const chart_elem = main_elem.querySelector( '#chart' );

          // add selector box to main HTML structure
          $.setContent( main_elem.querySelector( '#switcher' ), getSwitcher() );

          // add chart to main HTML structure
          Highcharts.chart( chart_elem, getChartSettings() );

          // add main HTML structure to own website area
          $.setContent( self.element, main_elem );

          // rendering completed => perform callback
          callback && callback();

          /**
           * returns the selector box for switching to an other chart type
           * @type {Element}
           */
          function getSwitcher() {

            const list = getCompatibilityList();
            if ( !list || list.length < 2 || !my.switcher ) return $.removeElement( main_elem.querySelector( '#switcher' ) );

            const switcher = $.html( { tag: 'select', onchange: () => {
              my.chart = switcher.value;
              self.start();

              // logging of 'switch' event
              self.logger && self.logger.log( 'switch', my.chart );

            } } );
            list.map( chart => switcher.appendChild( $.html( { tag: 'option', value: chart, inner: chart, selected: chart === my.chart } ) ) );
            return switcher;

            function getCompatibilityList() {
              const compatibility_lists = [ [ 'line', 'area', 'bar', 'column' ], [ 'pie', 'pie-semi-circle' ] ];
              for ( let i = 0; i < compatibility_lists.length; i++ )
                for ( let j = 0; j < compatibility_lists[ i ].length; j++ )
                  if ( compatibility_lists[ i ][ j ] === my.chart )
                    return compatibility_lists[ i ];
            }

          }

          /**
           * returns the chart settings
           * @type {object}
           */
          function getChartSettings() {

            let style, settings = {};
            if ( my.chart )
              switch ( my.chart ) {
                case 'line':
                  $.integrate( {
                    yAxis: {
                      title: {
                        text: my.y_title
                      }
                    },
                    legend: {
                      layout: 'vertical',
                      align: 'right',
                      verticalAlign: 'middle'
                    },
                    plotOptions: {
                      series: {
                        label: {
                          connectorAllowed: false
                        },
                        pointStart: my.point_start
                      }
                    },
                    series: my.data,
                    responsive: {
                      rules: [
                        {
                          condition: {
                            maxWidth: 500
                          },
                          chartOptions: {
                            legend: {
                              layout: 'horizontal',
                              align: 'center',
                              verticalAlign: 'bottom'
                            }
                          }
                        }
                      ]
                    }
                  }, settings );
                  style = 'min-width: 310px; max-width: 800px; height: 400px; margin: 0 auto';
                  break;
                case 'area':
                  $.integrate( {
                    yAxis: {
                      title: {
                        text: my.y_title
                      }
                    },
                    plotOptions: {
                      area: {
                        pointStart: my.point_start,
                        marker: {
                          enabled: false,
                          symbol: 'circle',
                          radius: 2,
                          states: {
                            hover: {
                              enabled: true
                            }
                          }
                        }
                      }
                    },
                    series: my.data
                  }, settings );
                  style = 'min-width: 310px; height: 400px; margin: 0 auto';
                  break;
                case 'bar':
                  $.integrate( {
                    xAxis: {
                      categories: my.categories
                    },
                    yAxis: {
                      min: 0,
                      title: {
                        text: my.y_title,
                        align: 'high'
                      },
                      labels: {
                        overflow: 'justify'
                      }
                    },
                    plotOptions: {
                      bar: {
                        dataLabels: {
                          enabled: true
                        }
                      }
                    },
                    legend: {
                      layout: 'vertical',
                      align: 'right',
                      verticalAlign: 'top',
                      x: -40,
                      y: 80,
                      floating: true,
                      borderWidth: 1,
                      backgroundColor: ( ( Highcharts.theme && Highcharts.theme.legendBackgroundColor ) || '#FFFFFF' ),
                      shadow: true
                    },
                    credits: {
                      enabled: false
                    },
                    series: my.data
                  }, settings );
                  style = 'min-width: 310px; max-width: 800px; height: 400px; margin: 0 auto';
                  break;
                case 'column':
                  $.integrate( {
                    xAxis: {
                      categories: my.categories,
                      crosshair: true
                    },
                    yAxis: {
                      min: 0,
                      title: {
                        text: my.y_title
                      }
                    },
                    plotOptions: {
                      column: {
                        pointPadding: 0.2,
                        borderWidth: 0
                      }
                    },
                    series: my.data
                  }, settings );
                  style = 'min-width: 310px; height: 400px; margin: 0 auto';
                  break;
                case 'pie':
                  $.integrate( {
                    plotOptions: {
                      pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        dataLabels: {
                          enabled: true,
                          format: my.data_label,
                          style: {
                            color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                          }
                        }
                      }
                    },
                    series: [ {
                      name: my.tooltip_label,
                      colorByPoint: true,
                      data: my.data
                    } ]
                  }, settings );
                  style = 'min-width: 310px; height: 400px; max-width: 600px; margin: 0 auto';
                  break;
                case 'pie-semi-circle':
                  $.integrate( {
                    chart: {
                      plotBackgroundColor: null,
                      plotBorderWidth: 0,
                      plotShadow: false
                    },
                    title: {
                      text: my.title,
                      align: 'center',
                      verticalAlign: 'middle',
                      y: 40
                    },
                    plotOptions: {
                      pie: {
                        dataLabels: {
                          enabled: true,
                          distance: -50,
                          style: {
                            fontWeight: 'bold',
                            color: 'white'
                          }
                        },
                        startAngle: -90,
                        endAngle: 90,
                        center: [ '50%', '75%' ]
                      }
                    },
                    series: [
                      {
                        type: 'pie',
                        name: my.tooltip_label,
                        innerSize: '50%',
                        data: my.data
                      }
                    ]
                  }, settings );
                  style = 'min-width: 310px; height: 400px; max-width: 600px; margin: 0 auto';
                  break;
              }
            if ( my.chart && !settings.chart ) settings.chart = { type: my.chart };
            if ( my.title && !settings.title ) settings.title = { text: my.title };
            if ( my.subtitle && !settings.subtitle ) settings.subtitle = { text: my.subtitle };
            if ( my.tooltip && !settings.tooltip ) settings.tooltip = { pointFormat: my.tooltip };
            if ( style && !my.no_style ) chart_elem.style = style;
            if ( my.settings ) $.integrate( $.toDotNotation( $.solveDotNotation( $.clone( my.settings ) ) ), settings );
            return settings;

          }

        } );

      };

    }

  };

  function p(){window.ccm[v].component(component)}const f="ccm."+component.name+(component.version?"-"+component.version.join("."):"")+".js";if(window.ccm&&null===window.ccm.files[f])window.ccm.files[f]=component;else{const n=window.ccm&&window.ccm.components[component.name];n&&n.ccm&&(component.ccm=n.ccm),"string"==typeof component.ccm&&(component.ccm={url:component.ccm});var v=component.ccm.url.split("/").pop().split("-");if(v.length>1?(v=v[1].split("."),v.pop(),"min"===v[v.length-1]&&v.pop(),v=v.join(".")):v="latest",window.ccm&&window.ccm[v])p();else{const e=document.createElement("script");document.head.appendChild(e),component.ccm.integrity&&e.setAttribute("integrity",component.ccm.integrity),component.ccm.crossorigin&&e.setAttribute("crossorigin",component.ccm.crossorigin),e.onload=function(){p(),document.head.removeChild(e)},e.src=component.ccm.url}}
}