'use strict';

var React = require('react/addons');
var ReactTransitionGroup = React.addons.TransitionGroup;

// CSS
require('../../styles/normalize.css');
require('../../styles/main.css');

// Models
var Amplicon = require('../models/Amplicon');
var Bin = require('../models/Bin');
var Vcf = require('../models/Vcf');

var imageURL = require('../../images/yeoman.png');


/* TODO: Récupérer des fichiers en js client only
	TODO: Faire le découpage en classe comme coverageQC + Faire algo main Java -> Javascript
	TODO: Etablir une sortie pour vérifier que les données sont ok comme Java
	TODO: Faire le html qui correspond
	TODO: Utiliser les libs identiques pour faire le boulot

	TODO: doNotCallFile à traiter plus tard
 */
function generateReport(parameters){
	//var vcf = new Vcf()
	/*
	vcfFileUrl = "http://localhost:8080/base/test/data/sample.genome.vcf";
	vcfText = getResponseText(vcfFileUrl);
	exonBedFileUrl = "http://localhost:8080/base/test/data/cancer_panel_26.20140719.exons.bed";
	exonBedText = getResponseText(exonBedFileUrl);
	ampliconBedFileName = "cancer_panel_26.20140717.amplicons.bed";
	ampliconBedText = getResponseText("http://localhost:8080/base/test/data/"+ampliconBedFileName);
	variantFileUrl = "http://localhost:8080/base/test/data/sample.variant.tsv";
	variantText = getResponseText(variantFileUrl);
	variantFileLineCount = variantText.split("\n").length;
	*/
	debugger;
	var vcf = new Vcf("", parameters.vcfFile.result, "", parameters.exonFile.result,
		"", parameters.ampliconFile.result, "", parameters.variantTsv.result.split("\n").length);
	console.log(vcf);
}

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
				reader: self.state.reader});
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
		this.state.parametersFileReader[file.identifier] = file.reader;
	},
	handleSubmit: function(e){
		e.preventDefault();

		// We can set a boolean to true when ok for processing files
		var parameters = this.state.parametersFileReader;

		// To process, we first need to check we have all the files
		if((parameters.vcfFile && parameters.exonFile && parameters.ampliconFile && parameters.variantTsv) &&
		 (parameters.vcfFile.readyState === 2 &&
		 	parameters.exonFile.readyState === 2 &&
		 	parameters.ampliconFile.readyState === 2 &&
		 	parameters.variantTsv.readyState === 2))
		{
			console.log("It's good!");
			generateReport(parameters);
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
				<h1>JsCoverageQC Report</h1>
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
  render: function() {
    return (
      <div className='main'>
        <ReactTransitionGroup transitionName="fade">
          <img src={imageURL} />
        </ReactTransitionGroup>
        <InputFilesForm/>
      </div>
    );
  }
});

module.exports = JsCoverageQcApp;
