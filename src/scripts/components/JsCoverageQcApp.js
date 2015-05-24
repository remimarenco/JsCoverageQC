/*jshint bitwise: false*/

'use strict';

var React = require('react/addons');
var ReactTransitionGroup = React.addons.TransitionGroup;

// CSS
require('../../styles/normalize.css');
require('../../styles/main.css');

// Report
var Report = require('./report');

// Models
var Amplicon = require('../models/Amplicon');
var Bin = require('../models/Bin');
var Vcf = require('../models/Vcf');
//TODO: Is XLSX still needed ?
//var XLSX = require('xlsx');
var saveAs = require('browser-filesaver');

var imageURL = require('../../images/yeoman.png');

function s2ab(s) {
  var buf = new ArrayBuffer(s.length);
  var view = new Uint8Array(buf);
  for (var i=0; i!==s.length; ++i){
  	view[i] = s.charCodeAt(i) & 0xFF;
  }
  return buf;
}

function Workbook(){
	if(!(this instanceof Workbook)){
		return new Workbook();
	}
	this.SheetNames = [];
	this.Sheets = {};
}

/* TODO: Récupérer des fichiers en js client only
	TODO: Faire le découpage en classe comme coverageQC + Faire algo main Java -> Javascript
	TODO: Etablir une sortie pour vérifier que les données sont ok comme Java
	TODO: Faire le html qui correspond
	TODO: Utiliser les libs identiques pour faire le boulot

	TODO: doNotCallFile à traiter plus tard
 */

var InputFile = React.createClass({
	getInitialState: function(){
		return{
			reader: new FileReader()
		};
	},
	handleFile: function(e){
		var self = this;
		var file = e.target.files[0];

		// When the file is loaded
		this.state.reader.onload = function(upload){
			self.props.onLoadEnd({identifier: self.props.identifier,
				reader: self.state.reader,
				name: file.name});
		};

		this.state.reader.readAsText(file);
	},
	render: function(){
		return(
			<input type="file"
				id="{this.props.identifier}"
				ref="{this.props.identifier}"
				onChange={this.handleFile}/>
		);
	}
});

// TODO: Add a modification of the text (Processing) as long as the VCF is not generated
var SubmitInputFiles = React.createClass({
	render: function(){
		return(
			<div>
				<input type="submit" id="Process" value="Process"/>
			</div>
		);
	}
});

var InputFilesForm = React.createClass({
	getInitialState: function(){
		return{
			/** @type {Object} Parameters is an object to store all the input FileReader */
			parametersFileReader: {}
		};
	},
	// Each time a file is uploaded, we add his FileReader in the
	// parametersFileReader
	fileUploaded: function(file){
		this.state.parametersFileReader[file.identifier] = {reader: file.reader, name: file.name};
	},
	handleSubmit: function(e){
		e.preventDefault();

		// We can set a boolean to true when ok for processing files
		var parameters = this.state.parametersFileReader;

		// To process, we first need to check we have all the files
		if((parameters.vcfFile.reader && parameters.exonFile.reader && parameters.ampliconFile.reader && parameters.variantTsv.reader) &&
		 (parameters.vcfFile.reader.readyState === 2 &&
		 	parameters.exonFile.reader.readyState === 2 &&
		 	parameters.ampliconFile.reader.readyState === 2 &&
		 	parameters.variantTsv.reader.readyState === 2))
		{
			var vcf = new Vcf(parameters.vcfFile.name, parameters.vcfFile.reader.result,
				parameters.exonFile.name, parameters.exonFile.reader.result,
				parameters.ampliconFile.name, parameters.ampliconFile.reader.result,
				parameters.variantTsv.name, parameters.variantTsv.reader.result.split("\n").length,
				parameters.variantTsv.reader.result);

			// We notify we have our vcf object updated
			this.props.vcfUpdated(vcf);
		}
		else
		{
			// TODO: Find a better way to show messages to the user
			// to deactivate devel: true in jshintrc
			alert("One of the necessaries files (VCF, Exon, Amplicon or TSV) is not yet loaded. Please load them first before process.");
		}
	},
	render: function(){
		return (
			<div id="page-wrapper">
				<h1>JsCoverageQC</h1>
				<form className="formElem" onSubmit={this.handleSubmit}>
					<div>
						Select a vcf file:
						<InputFile identifier="vcfFile" onLoadEnd={this.fileUploaded}/>
					</div>
					<div>
						Select an exon bed file
						<InputFile identifier="exonFile" onLoadEnd={this.fileUploaded}/>
					</div>
					<div>
						Select an amplicon bed file
						<InputFile identifier="ampliconFile" onLoadEnd={this.fileUploaded}/>
					</div>
					<div>
						Select a TSV variant file
						<InputFile identifier="variantTsv" onLoadEnd={this.fileUploaded}/>
					</div>
					<div>
						Select a DoNotCallFile (optional)
						<InputFile identifier="doNotCallFile" onLoadEnd={this.fileUploaded}/>
					</div>
					<SubmitInputFiles/>
					<pre id="fileDisplayArea"></pre>
				</form>
			</div>
		);
	}
});

var JsCoverageQcApp = React.createClass({
	getInitialState: function(){
		return{
			vcf: {},
			report: React.addons.createFragment({}),
			googleChartLibLoaded: false
		};
	},
	googleChartLibLoaded: function(){
		this.setState({googleChartLibLoaded: true});
	},
	componentDidMount: function(){
		/* jshint ignore:start */
		google.load("visualization", "1", {packages: ["corechart"]});
		google.setOnLoadCallback(this.googleChartLibLoaded);
		/* jshint ignore:end */
	},
	setStateVcfEnded: function(){
		var report = React.addons.createFragment({
			report: <Report vcf={this.state.vcf} googleChartLibLoaded={this.state.googleChartLibLoaded}/>
		});
		this.setState({report: report});
	},
	handleChange: function(newVcf){
		this.setState({vcf: newVcf}, this.setStateVcfEnded);
	},
	render: function() {
		return (
		  <div className='main'>
		    <InputFilesForm vcfUpdated={this.handleChange}/>
			{this.state.report}
			<p>Copyright &#169; 2015 Rémi Marenco and Jeremy Goecks. Java original version : 2014 Geoffrey H. Smith.</p>
		  </div>
		);
	}
});

module.exports = JsCoverageQcApp;
