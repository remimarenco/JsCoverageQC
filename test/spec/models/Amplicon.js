'use strict';

describe('Amplicon', function () {
  /*
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
  */

  var Amplicon = require('models/Amplicon.js');

  it('should create an instance with a string parameter', function(){
    var amplicon = new Amplicon("");
    expect(amplicon).toEqual(jasmine.any(Amplicon));
  });

  // Test the existence of the compareTo function
  it('should have a compareTo function', function(){
    var amplicon = new Amplicon("");
    expect(amplicon.compareTo).toBeDefined();
  });

  // Test the construction of the Amplicon with a given file
  it('', function(){
    return true;
  });

  // Test the comparison of the Amplicon with an other amplicon
});
