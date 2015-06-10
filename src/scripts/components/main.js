'use strict';

var launchApp = function( oArg ){
    var self = this;
    var JsCoverageQcApp = require('components/JsCoverageQcApp');
    var React = require('react');
    var Router = require('react-router');
    var Route = Router.Route;

    var content = document.getElementById('content');

    if(oArg !== null || oArg !== 'undefined'){
        React.render(<JsCoverageQcApp />, content);
    }
    else{
        React.render(
            <JsCoverageQcApp needHtml5Upload={oArg.needHtml5Upload}
            vcfGalaxyResult={oArg.vcfGalaxyResult}
            exonGalaxyResult={oArg.exonGalaxyResult}
            ampliconGalaxyResult={oArg.ampliconGalaxyResult}
            variantGalaxyResult={oArg.variantGalaxyResult}/>,
            content);
    }
};

// TODO: Put the React app available in a more secure manner
window.launchApp = launchApp;

