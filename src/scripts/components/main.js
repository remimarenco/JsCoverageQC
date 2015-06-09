'use strict';

var launchApp = function(myParameter){
    var JsCoverageQcApp = require('components/JsCoverageQcApp');
    var React = require('react');
    var Router = require('react-router');
    var Route = Router.Route;
    console.log( JsCoverageQcApp.render );
    var content = document.getElementById('content');

    React.render(<JsCoverageQcApp test={myParameter}/>, content);
};

// TODO: Put the React app available in a more secure manner
window.launchApp = launchApp;

