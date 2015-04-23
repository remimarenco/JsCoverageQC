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

  var Amplicon;

  beforeEach(function(){
    Amplicon = require('models/Amplicon.js');
  });

  it('should create an instance with a string parameter', function(){
    var amplicon = new Amplicon("");
    expect(amplicon).toEqual(jasmine.any(Amplicon));
  });

  // Test the existence of the compareTo function
  it('should have a compareTo function', function(){
    var amplicon = new Amplicon("");
    expect(amplicon.compareTo).toBeDefined();
  });

  describe('File management', function(){
    var ampliconsBedFile;
    var ampliconsBedText = '';
    var ampliconBedLine = '';

    beforeEach(function(done){
      ampliconsBedFile = "http://localhost:8080/base/test/data/cancer_panel_26.20140311.amplicons.bed";

      var req = new XMLHttpRequest();
      req.open("GET", ampliconsBedFile, true);
      req.responseType = "text";

      req.onreadystatechange = function (oEvent) {
        if (req.readyState === 4 && (req.status === 200 || req.status === 0)) {
          ampliconsBedText = req.responseText; // Note: not oReq.responseText
          ampliconBedLine = ampliconsBedText.split('\n')[1];
          done();
        }
      };

      req.send(null);
    });

    // Test the construction of the Amplicon with a given file
    it('should still create an amplicon object with a given file', function(){
      //var ampliconFile = require('file!../../data/cancer_panel_26.20140311.amplicons.bed');
      var amplicon = new Amplicon(ampliconBedLine);
      expect(amplicon.chr).toEqual('chr14');
    });

    // Test the comparison of the Amplicon with an other amplicon
    it('should be equals to an other Amplicon having the same input', function(){
      var first_amplicon = new Amplicon(ampliconBedLine);
      var second_amplicon = new Amplicon(ampliconBedLine);

      expect(first_amplicon.compareTo(second_amplicon)).toEqual(0);
    });

    // Test the comparison of the Amplicon with an other amplicon
    it('should be inferior to an other Amplicon having an input with a superior chromosome position', function(){
      var first_amplicon = new Amplicon(ampliconBedLine);

      var ampliconBedLineChr16 = ampliconsBedText.split('\n')[6];
      var second_amplicon = new Amplicon(ampliconBedLineChr16);

      expect(first_amplicon.compareTo(second_amplicon)).toEqual(-1);
    });

    // Test the comparison of the Amplicon with an other amplicon
    it('should be superior to an other Amplicon having an input with a inferior chromosome position', function(){
      var first_amplicon = new Amplicon(ampliconBedLine);

      var ampliconBedLineChr2 = ampliconsBedText.split('\n')[2];
      var second_amplicon = new Amplicon(ampliconBedLineChr2);

      expect(first_amplicon.compareTo(second_amplicon)).toEqual(1);
    });
  });
});
