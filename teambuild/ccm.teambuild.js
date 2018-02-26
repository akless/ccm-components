/**
 * @overview ccm component for realtime team building
 * @author André Kless <andre.kless@web.de> 2015-2017
 * @license The MIT License (MIT)
 * @version latest (1.0.1)
 * @changes
 * version 1.0.1 (08.11.2017):
 * - changes in default instance configuration
 * - bugfix for default and initial team names
 * - uses ccm v12.12.0
 * version 1.0.0 (19.10.2017)
 * TODO: Teambuild für Member noch toLowerCase().trim() einbauen
 * TODO: lock and unlock for team joining
 * TODO: callback (onjoin, onleave, ...)
 */

( function () {

  var component = {

    name: 'teambuild',

    ccm: 'https://akless.github.io/ccm/ccm.js',

    config: {

      "html": {
        "main": {
          "tag": "main",
          "class": "teams"
        },
        "team": {
          "tag": "article",
          "class": "team",
          "inner": [
            {
              "tag": "header",
              "inner": [
                { "class": "icon fa fa-%icon% fa-lg" },
                {
                  "class": "name",
                  "inner": "%name%"
                },
                { "class": "button" },
                { "class": "status" }
              ]
            },
            {
              "tag": "section",
              "class": "members"
            }
          ]
        },
        "join": {
          "tag": "button",
          "inner": "%caption%",
          "onclick": "%click%"
        },
        "leave": {
          "tag": "button",
          "inner": "%caption%",
          "onclick": "%click%"
        },
        "member": {
          "class": "member",
          "inner": [
            { "class": "icon fa fa-%icon%" },
            {
              "class": "name",
              "inner": "%name%"
            }
          ]
        }
      },
      "css": [ "ccm.load", "../teambuild/resources/default.css" ],
      "icons": [ "ccm.load",
        {
          "context": "head",
          "url": "https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css",
          "integrity": "sha384-XdYbMnZ/QjLh6iI4ogqCTaIjrFk87ip+ekIjefZch0Y+PvJ8CDYtEs1ipDmPorQ+",
          "crossorigin": "anonymous"
        },
        {
          "url": "https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css",
          "integrity": "sha384-XdYbMnZ/QjLh6iI4ogqCTaIjrFk87ip+ekIjefZch0Y+PvJ8CDYtEs1ipDmPorQ+",
          "crossorigin": "anonymous"
        }
      ],
      "data": { "store": [ "ccm.store" ] },
      "text": {
        "team": "Team",
        "leave": "leave",
        "join": "join",
        "free": "free"
      },
      "icon": {
        "team": "group",
        "member": "user"
      },
      "editable": { "join": true, "leave": true, "rename": true }

  //  names: [ "Team Red", "Team Blue" ],
  //  max_teams: 10,
  //  max_members: 3,
  //  user: [ "ccm.instance", "https://akless.github.io/ccm-components/user/versions/ccm.user-2.0.0.min.js" ],
  //  logger: [ "ccm.instance", "https://akless.github.io/ccm-components/log/versions/ccm.log-1.0.0.min.js", [ "ccm.get", "https://akless.github.io/ccm-components/log/resources/log_configs.min.js", "greedy" ] ],

    },

    Instance: function () {

      var self = this;
      var my;           // contains privatized instance members

      this.init = function ( callback ) {

        // listen to the change event of the ccm realtime datastore => (re)render own content
        if ( self.data.store ) self.data.store.onchange = function () { self.start(); };

        callback();
      };

      this.ready = function ( callback ) {

        // privatize all possible instance members
        my = self.ccm.helper.privatize( self );

        // is user authentication used? => listen to the login and logout event => (re)render own content
        if ( self.user ) self.user.addObserver( self.index, function () { self.start(); } );

        // should events be logged? => log ready event
        if ( self.logger ) self.logger.log( 'ready', function () {
          var data = self.ccm.helper.clone( my );
          if ( data.data && data.data.store ) data.data.store = data.data.store.source();
          return data;
        }() );

        callback();
      };

      this.start = function ( callback ) {

        // get team building dataset
        self.ccm.helper.dataset( my.data, function ( dataset ) {

          // new dataset? => set initial state
          if ( !dataset.teams ) dataset.teams = [];

          // prepare main HTML structure
          var main_elem = self.ccm.helper.html( my.html.main );

          // add HTML structures for each team
          addTeams();

          // set content of own website area
          self.ccm.helper.setContent( self.element, main_elem );

          // should events be logged? => log start event
          if ( self.logger ) self.logger.log( 'start', dataset );

          // perform callback (all content is rendered)
          if ( callback ) callback();

          /** adds the teams to the main HTML structure */
          function addTeams() {

            // add existing teams
            dataset.teams.map( addTeam );

            // limited number of teams? => add empty teams
            if ( my.max_teams ) {
              var needed = my.max_teams - dataset.teams.length;
              for ( var i = 0; i < needed; i++ )
                addEmptyTeam();
            }

            // unlimited number of teams, last team is not empty and teams are joinable? => add empty team
            else if ( ( dataset.teams.length === 0 || !isEmptyTeam( dataset.teams[ dataset.teams.length - 1 ] ) ) && joinableTeams() ) addEmptyTeam();

            /**
             * adds a team to the main HTML structure
             * @param {object} team - team data
             * @param {number} [i] - team index (default is: number of existing teams - 1)
             */
            function addTeam( team, i ) {

              // no team index? => use default value (when rendering a empty team)
              if ( i === undefined ) i = dataset.teams.length - 1;

              // prepare HTML structure of the team
              var team_elem = self.ccm.helper.html( my.html.team, {
                icon: my.icon.team,
                name: team.name ? team.name : ( my.names && my.names[ i ] ? my.names[ i ] : my.text.team + ' ' + ( i + 1 ) )
              } );

              /**
               * maximum number of team members
               * @type {number}
               */
              var max_members = team.max_members || my.max_members;

              /**
               * user data
               * @type {object}
               */
              var user;

              /**
               * number of the team to which the user currently belongs
               * @type {number}
               */
              var user_team;

              // is there a logged on user?
              if ( self.user && self.user.isLoggedIn() ) {

                // remember username
                user = self.ccm.helper.filterProperties( self.user.data(), 'id', 'name', 'email' );

                // remember user team index
                user_team = getUserTeam();

                // user is member of this team?
                if ( isMember( team ) ) {

                  // should the team name be editable? => make team name editable
                  if ( isEditable( i, 'rename' ) ) makeEditable();

                  // should the user have the possibility to leave the team? => add leave button
                  if ( isEditable( i, 'leave' ) ) addLeaveButton();

                }

                // user is no member and team is joinable? => add join button
                else if ( isJoinable() ) addJoinButton();

              }

              // add HTML structure for each member
              addMembers();

              // add team to main HTML structure
              main_elem.appendChild( team_elem );

              /**
               * returns the number of the team to which the user currently belongs
               * @returns {number}
               */
              function getUserTeam() {

                // is user a team member? => return team number
                for ( var i = 0; i < dataset.teams.length; i++ )
                  if ( dataset.teams[ i ].members[ user.id ] ) return i + 1;

                // user is no team member => return undefined
              }

              /**
               * checks whether the user is a member of a particular team
               * @param {object} team - team data
               * @returns {boolean}
               */
              function isMember( team ) {

                return !!team.members[ user.id ];

              }

              /**
               * checks whether a particular action is allowed for a particular team
               * @param {number} team - team index
               * @param {string} action - 'join', 'leave' or 'rename'
               * @returns {boolean}
               */
              function isEditable( team, action ) {

                if ( team.editable === undefined )
                  return !( my.editable === false || my.editable && my.editable[ action ] === false );
                else
                  return !( team.editable === false || team.editable && team.editable[ action ] === false );

              }

              /** makes the team name editable */
              function makeEditable() {

                // select team name element
                var name_elem = team_elem.querySelector( '.name' );

                name_elem.setAttribute( 'contenteditable', true );
                name_elem.addEventListener( 'input', function () {

                  // show loading icon
                  loading( true );

                  /**
                   * renamed team name
                   * @type {string}
                   */
                  var value = name_elem.textContent.trim();

                  // update team name in team data
                  team.name = self.ccm.helper.protect( value );

                  // update team building dataset in datastore
                  my.data.store.set( dataset, function () {

                    // hide loading icon
                    loading( false );

                    // should events be logged? => log change of the team name
                    if ( self.logger ) self.logger.log( 'rename', { team: team.key, name: team.name } );

                  } );

                } );

              }

              /** adds the button that allows the user to leave the team */
              function addLeaveButton() {

                // use template for team button
                self.ccm.helper.setContent( team_elem.querySelector( '.button' ), self.ccm.helper.html( my.html.leave, {

                  icon: my.icon.leave,
                  caption: my.text.leave,
                  click: function () {

                    // show loading icon
                    loading( true );

                    // remove user from member list
                    delete team.members[ user.id ];

                    // unlimited number of teams and leaved team is now empty? => remove leaved team
                    if ( !my.max_teams && isEmptyTeam( team ) ) dataset.teams.splice( i , 1 );

                    // update team building dataset
                    my.data.store.set( dataset, function () {

                      // should events be logged? => log the leaving of the team
                      if ( self.logger ) self.logger.log( 'leave', { team: team.key } );

                      // (re)render own content
                      self.start();

                    } );

                  }

                } ) );

              }

              /**
               * checks if the user can join this team
               * @returns {boolean}
               */
              function isJoinable() {

                // join action for this team is not allowed? => negative result
                if ( !isEditable( i, 'join' ) ) return false;

                // is the user a member of a team that can not be left? => negative result
                if ( user_team && !isEditable( user_team - 1, 'leave' ) ) return false;

                // unlimited number of teams and this team is the last (always empty) team and not the only one?
                if ( !my.max_teams && i === dataset.teams.length - 1 && i > 0 ) {

                  // the user is the only member in the last not empty team? => team is not joinable
                  if ( isOnlyMember( dataset.teams[ i - 1 ] ) ) return false;

                  /**
                   * checks if the user is the only member in a particular team
                   * @param {object} team - team data
                   * @returns {boolean}
                   */
                  function isOnlyMember( team ) {

                    return team.members[ user.id ] && Object.keys( team.members ).length === 1;

                  }

                }

                // the team can be joined if the allowed number of team members is unlimited or is not exceeded by joining
                return !max_members || Object.keys( team.members ).length < max_members;

              }

              /** adds the button that allows the user to join the team */
              function addJoinButton() {

                // use template for team button
                self.ccm.helper.setContent( team_elem.querySelector( '.button' ), self.ccm.helper.html( my.html.join, {

                  icon: my.icon.join,
                  caption: my.text.join,
                  click: function () {

                    // show loading icon
                    loading( true );

                    // is the user already a member of another team? => the user must leave that team
                    if ( user_team ) {

                      /**
                       * data of the team that the user must leave
                       * @type {object}
                       */
                      var leaving_team = dataset.teams[ user_team - 1 ];

                      // remove the user from the member list
                      delete leaving_team.members[ user.id ];

                      // unlimited number of teams and leaved team is now empty? => remove leaved team
                      if ( !my.max_teams && isEmptyTeam( leaving_team ) ) dataset.teams.splice( user_team - 1, 1 );

                    }

                    // add the user to the member list
                    team.members[ user.id ] = self.ccm.helper.cleanObject( { id: user.id, name: user.name, email: user.email } );

                    // update team building dataset
                    my.data.store.set( dataset, function () {

                      // should events be logged? => log the joining of the team
                      if ( self.logger ) self.logger.log( 'join', function () {
                        var data = { team: team.key };
                        if ( user_team ) data.leaved = leaving_team.key;
                        return data;
                      }() );

                      // (re)render own content
                      self.start();

                    } );

                  }

                } ) );

              }

              /**
               * show or hide the loading icon in the status element of the team
               * @param {boolean} show_or_hide - true: show, false: hide
               */
              function loading( show_or_hide ) {

                self.ccm.helper.setContent( team_elem.querySelector( '.status' ), show_or_hide ? self.ccm.helper.loading( self ) : '' );

              }

              /** adds the members to the HTML structure of the team */
              function addMembers() {

                // add team members
                for ( var member in team.members ) addMember( team.members[ member ] );

                // is there a maximum number of team members? => add free member slots
                for ( var i = 0; i < max_members - Object.keys( team.members ).length; i++ ) addMember();

                /**
                 * adds a member to the HTML structure of the team
                 * @param {object} [member] - member data (default: free member slot)
                 */
                function addMember( member ) {

                  // prepare HTML structure of the member
                  var member_elem = self.ccm.helper.html( my.html.member, {
                    icon: my.icon.member,
                    name: member ? ( member.email && user.id !== member.id ? '<a href="mailto:' + member.email + '">' + member.name + '</a>' : member.name ) : my.text.free
                  } );

                  // select the element for the username of the member
                  var member_name_elem = member_elem.querySelector( '.name' );

                  // the member is the user? => mark it
                  if ( user && member && user.id === member.id ) member_name_elem.classList.add( 'user' );

                  // this is a free member slot? => mark it
                  if ( !member ) member_name_elem.classList.add( 'free' );

                  // add member to HTML structure of the team
                  team_elem.querySelector( '.members' ).appendChild( member_elem );

                }

              }

            }

            /**
             * checks if a particular team has no members
             * @param {object} team - team data
             * @returns {boolean}
             */
            function isEmptyTeam( team ) {

              return Object.keys( team.members ).length === 0;

            }

            /** adds a empty team slot */
            function addEmptyTeam() {

              /**
               * initial team data (empty team without members)
               * @type {object}
               */
              var team = { key: self.ccm.helper.generateKey(), members: {} };

              // add empty team data to existing teams
              dataset.teams.push( team );

              // add empty team to main HTML structure
              addTeam( team );

            }

            /**
             * checks if the teams are joinable
             * @returns {boolean}
             */
            function joinableTeams() {

              return !( my.editable === false || my.editable && my.editable.join === false );

            }

          }

        } );

      };

    }

  };

  function p(){window.ccm[v].component(component)}var f="ccm."+component.name+(component.version?"-"+component.version.join("."):"")+".js";if(window.ccm&&null===window.ccm.files[f])window.ccm.files[f]=component;else{var n=window.ccm&&window.ccm.components[component.name];n&&n.ccm&&(component.ccm=n.ccm),"string"==typeof component.ccm&&(component.ccm={url:component.ccm});var v=component.ccm.url.split("/").pop().split("-");if(v.length>1?(v=v[1].split("."),v.pop(),"min"===v[v.length-1]&&v.pop(),v=v.join(".")):v="latest",window.ccm&&window.ccm[v])p();else{var e=document.createElement("script");document.head.appendChild(e),component.ccm.integrity&&e.setAttribute("integrity",component.ccm.integrity),component.ccm.crossorigin&&e.setAttribute("crossorigin",component.ccm.crossorigin),e.onload=function(){p(),document.head.removeChild(e)},e.src=component.ccm.url}}
}() );