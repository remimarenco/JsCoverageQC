'use strict';

var launchApp = function(myParameter){
    var JsCoverageQcApp = require('components/JsCoverageQcApp');
    var React = require('react');
    var Router = require('react-router');
    var Route = Router.Route;

    var content = document.getElementById('content');

    var Routes = (
      <Route handler={JsCoverageQcApp}>
        <Route name="/" handler={JsCoverageQcApp}/>
      </Route>
    );

    Router.run(Routes, function (Handler) {
      React.render(<Handler test={myParameter}/>, content);
    });
};

// TODO: Put the React app available in a more secure manner
window.launchApp = launchApp;

