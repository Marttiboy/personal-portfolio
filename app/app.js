// NPM
var React      = require('react/addons');

// Routes
var Router        = require('react-router');
var RRoutes       = require('./routes');

// Actions
var Actions			= require('./actions/actions');

// Config
var Config			= require('./app.config');


if(Config.isBrowser) {

	Router.run(RRoutes, Router.HistoryLocation, function(Handler, State) {
		//console.log("Client: Router.run");

		Actions.routeLoad.triggerPromise(State).then(function (res) {
			//console.log("CLIENT: Route changed");

			ga('send', 'pageview', window.location.pathname);
			React.render(<Handler path={window.location.pathname} />, document.getElementById('app'));
			return false;
		});
	});
}
