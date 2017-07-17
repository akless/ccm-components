/**
 * Created by Dennis on 13.06.2017.
 */

( function () {

    var ccm_version = '8.1.0';
    var ccm_url = 'https://akless.github.io/ccm/version/ccm-8.1.0.min.js';

    var component_name = 'desktop';
    var component_obj = {

        name: component_name,

        config: {
            style: [
                ['ccm.load', './styles/example/desktop.css']
            ],
            apps: [ "ccm.get", "apps_config.js", "example"],
            html_templates: {
                'main': {
                    tag: 'div',
                    class: 'main',
                    inner: [
                        {
                            tag: 'div',
                            id: 'apps',
                            class: 'apps'
                        }
                    ]
                },
                'app': {
                    tag: 'a',
                    class: 'app',
                    draggable: true,
                    inner: [
                        {
                            tag: 'img',
                            src: '%image%',
                            draggable: false
                        },
                        {
                            tag: 'div',
                            class: 'name',
                            inner: '%name%'
                        }
                    ]
                },
                'add': {
                    tag: 'div',
                    class: 'app',
                    inner: [
                        {
                            tag: 'div',
                            class: 'icon',
                            inner: {
                                tag: 'img',
                                src: '%img_url%'
                            }
                        }
                    ]
                },
                'dialog': {
                    tag: 'div',
                    class: 'dialog',
                    inner: [
                        {
                            tag: 'div',
                            class: 'head',
                            draggable: true,
                            inner: [
                                '%name%', {
                                    tag: 'div',
                                    class: 'close',
                                    inner: '&#10060;'
                                }
                            ]
                        },
                        {
                            tag: 'div',
                            class: 'main'
                        }
                    ]
                }
            },
            ccm_add: false,
            ccm_app_onclick_new_window: true
        },

        Instance: function () {

            var self = this;
            var my;

            this.init = function (callback) {

                var apps = [];

                self.ccm.helper.makeIterable(self.node.children).map(function (tag) {

                    switch (tag.tagName) {
                        case 'CCM-DESKTOP-APP':
                            var app = self.ccm.helper.generateConfig( tag );
                            delete app.node; // node is not necessary
                            apps.push(app);
                            break;
                        case 'CCM-DESKTOP-ADD':
                            break;
                    }

                });

                if (apps.length > 0)
                    self.apps = apps;

                callback();
            };

            this.ready = function (callback) {
                my = self.ccm.helper.privatize(self);

                callback();
            };

            this.start = function (callback) {

                var main_elem = self.ccm.helper.html( my.html_templates.main );

                self.ccm.helper.setContent( self.element, self.ccm.helper.protect( main_elem ) );

                my.apps.forEach(function (app) {

                    var app_elem = self.ccm.helper.html( my.html_templates.app, app);

                    app_elem.onclick = function () {

                        var new_window = window.open("", app.name, "");

                        new_window.document.title = app.name;

                        app.config.element = new_window.document.body;

                        self.ccm.start( app.url, app.config );
                    };

                    var app_dif_x;
                    var app_dif_y;

                    app_elem.ondragstart = function (event) {
                        var rect = app_elem.getBoundingClientRect();

                        app_dif_x = event.pageX - (rect.left + window.scrollX) + 10;
                        app_dif_y = event.pageY - (rect.top + window.scrollY) + 10;
                    };

                    app_elem.ondragend = function (event) {

                        if(event.pageX - app_dif_x <= 0 || event.pageY - app_dif_y <= 0)
                            return;

                        console.log(event);

                        var dialog_elem = self.ccm.helper.html( my.html_templates.dialog, app);

                        app.config.element = dialog_elem.querySelector('.main');
                        var dialog_head_elem = dialog_elem.querySelector('.head');

                        var dif_x;
                        var dif_y;

                        dialog_head_elem.ondragstart = function (event){

                            var rect = dialog_elem.getBoundingClientRect();

                            dif_x = event.pageX - (rect.left + window.scrollX);
                            dif_y = event.pageY - (rect.top + window.scrollY);

                        };

                        dialog_head_elem.ondrag = function (event){

                            event.preventDefault();

                            if(event.screenX !== 0 && event.screenY !== 0) {
                                dialog_elem.style.top = (event.pageY - dif_y - 6) + 'px'; // 6 = padding + border
                                dialog_elem.style.left = (event.pageX - dif_x - 6) + 'px';
                            }

                        };

                        dialog_head_elem.querySelector('.close').onclick = function () {

                            dialog_elem.remove();
                        };

                        dialog_elem.style.top = (event.pageY - app_dif_y) + 'px'; // 6 = padding + border
                        dialog_elem.style.left = (event.pageX - app_dif_x) + 'px';

                        app_elem.parentElement.appendChild(dialog_elem);

                        self.ccm.start( app.url, app.config );
                    };

                    main_elem.querySelector('#apps').appendChild(app_elem);
                });

                if(my.ccm_add){
                    var add_elem = self.ccm.helper.html( my.html_templates.add);
                    main_elem.querySelector('#apps').appendChild(add_elem);
                }

                callback();
            };


        }
    };

    var namespace = window.ccm && ccm.components[component_name];
    if (namespace) {
        if (namespace.ccm_version) ccm_version = namespace.ccm_version;
        if (namespace.ccm_url) ccm_url = namespace.ccm_url;
    }
    if (!window.ccm || !ccm[ccm_version]) {
        var tag = document.createElement('script');
        document.head.appendChild(tag);
        tag.onload = register;
        tag.src = ccm_url;
    } else register();
    function register() {
        ccm[ccm_version].component(component_obj);
    }
}() );