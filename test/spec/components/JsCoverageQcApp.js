'use strict';

describe('Main', function () {
  var React = require('react/addons');
  var JsCoverageQcApp, component;

  beforeEach(function () {
    var container = document.createElement('div');
    container.id = 'content';
    document.body.appendChild(container);

    JsCoverageQcApp = require('components/JsCoverageQcApp.js');
    component = React.createElement(JsCoverageQcApp);
  });

  it('should create a new instance of JsCoverageQcApp', function () {
    expect(component).toBeDefined();
  });
});
