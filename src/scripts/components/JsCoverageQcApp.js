/*jshint bitwise: false*/

'use strict';

var React = require('react/addons');
var ReactTransitionGroup = React.addons.TransitionGroup;

// CSS
require('../../styles/normalize.css');
require('../../styles/main.css');

// Models
var Amplicon = require('models/Amplicon');
var Bin = require('models/Bin');
var Vcf = require('models/Vcf');
var XLSX = require('xlsx');
var saveAs = require('browser-filesaver');
var jx = require('jsonix');
var VCFDescription = require('../../vcfDescription.js');

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
	//debugger;
	var vcf = new Vcf("", parameters.vcfFile.result, "", parameters.exonFile.result,
		"", parameters.ampliconFile.result, "", parameters.variantTsv.result.split("\n").length);
	//console.log(vcf);
	//debugger;

	var workbookcopy = new Workbook();
	if(parameters.variantTsv !== null || typeof parameters.variantTsv !== 'undefined'){
		var tsvResultSplitted = parameters.variantTsv.result.split("\n");
		var variantTsvHeadingLine = tsvResultSplitted[0];

		var sn_tsvCopy = "TSV copy";
		workbookcopy.SheetNames.push(sn_tsvCopy);
		workbookcopy.Sheets[sn_tsvCopy] = ""; // TODO: Put formatted row

		/* bookType can be 'xlsx' or 'xlsm' or 'xlsb' */
		var wopts = { bookType:'xlsx', bookSST:false, type:'binary' };

		var wbout = XLSX.write(workbookcopy, wopts);

		//TODO: if (variantTsvFile != null) {
            // String variantTsvDataLine;
            // String variantTsvHeadingLine = variantTsvBufferedReader.readLine();

		/* the saveAs call downloads a file on the local machine */
		//saveAs(new Blob([s2ab(wbout)],{type:""}), "TSV_copy.xlsx");
	}
	debugger;
	// Create Jsonix context
	var context = new jx.Jsonix.Context([VCFDescription]);
	var marshaller = context.createMarshaller();

	// We process all the auto-triggered by JAXB
	vcf.baseCount = vcf.getBaseCount();
	vcf.filteredAnnotatedVariantCount = vcf.getFilteredAnnotatedVariantCount();
	vcf.ampliconCount = vcf.getAmpliconCount();
	vcf.readDepthCount = vcf.getReadDepthCount();
	// TODO: Delete this and replace it by watchers on these variables to updated them by themselves

	// We wrap the vcf object into a marshallable jsonix object
	var vcfMarshallable = {
		name: {
			localPart: 'vcf'
		},
		value: vcf
	};
	var doc = marshaller.marshalString(vcfMarshallable);
	console.log("Voici le doc: "+doc);
	/*
	// Write to XML
        File xmlTempFile = new File(vcfFile.getCanonicalPath() + ".coverage_qc.xml");
        OutputStream xmlOutputStream = new FileOutputStream(xmlTempFile);
        JAXBContext jc = JAXBContext.newInstance("coverageqc.data");
        Marshaller m = jc.createMarshaller();
        m.setProperty(Marshaller.JAXB_FORMATTED_OUTPUT, new Boolean(true));
        m.marshal(vcf, xmlOutputStream);
        xmlOutputStream.close();
        LOGGER.info(xmlTempFile.getCanonicalPath() + " created");
	 */

	// Write to xlsx
	/*
	File xslxTempFile = new File(variantTsvFile.getCanonicalPath() + ".coverage_qc.xlsx");
	OutputStream xslxOutputStream = new FileOutputStream(xslxTempFile);
	workbookcopy.write(xslxOutputStream);
	xslxOutputStream.close();
	LOGGER.info(xslxTempFile.getCanonicalPath() + " created");
	*/
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
