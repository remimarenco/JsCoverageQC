'use strict';

var React = require('react/addons');
var ReactTransitionGroup = React.addons.TransitionGroup;

// CSS
require('../../styles/normalize.css');
require('../../styles/main.css');

var imageURL = require('../../images/yeoman.png');


/* TODO:
	- Récupérer des fichiers en js client only
	- Faire le découpage en classe comme coverageQC + Faire algo main Java -> Javascript
	- Etablir une sortie pour vérifier que les données sont ok comme Java
	- Faire le html qui correspond
	- Utiliser les libs identiques pour faire le boulot

	- doNotCallFile à traiter plus tard
 */

function generateReport(){

}

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
	getFile: function(ReactRefName){
		//var fileInput = document.getElementById(htmlIdName);
		var fileInput = React.findDOMNode(ReactRefName);
		//var fileDisplayArea = document.getElementById('fileDisplayArea');

		var reader = new FileReader();

		fileInput.addEventListener('change', function(e){
			var file = fileInput.files[0];

			// When the file is loaded
			reader.onload = function(e){
				//fileDisplayArea.innerText = reader.result;
				//alert("File loaded!");
			};

			reader.readAsText(file);
		});

		return reader;
	},
	getParameters: function(){
		var readerVcfFile = this.getFile(this.refs.vcfFile);
		var readerExonFile = this.getFile(this.refs.exonFile);
		var readerAmpliconFile = this.getFile(this.refs.ampliconFile);
		var readerDoNotCallFile = this.getFile(this.refs.doNotCallFile);
		var readerVariantTsv = this.getFile(this.refs.variantTsv);

		var parameters = [];

		parameters.vcf = readerVcfFile;
		parameters.exon = readerExonFile;
		parameters.amplicon = readerAmpliconFile;
		parameters.doNotCallFile = readerDoNotCallFile;
		parameters.readerVariantTsv = readerVariantTsv;

		return parameters;
	},
	handleSubmit: function(e){
		e.preventDefault();

		// We can set a boolean to true when ok for processing files
		var parameters = this.getParameters();

		// To process, we first need to check we have all the files
		if((parameters.vcf && parameters.exon && parameters.amplicon) &&
		 (parameters.vcf.readyState === 2 && parameters.exon.readyState === 2 && parameters.amplicon.readyState === 2))
		{
			console.log("C'est good!");
			generateReport();
		}
		else
		{
			// TODO: Find a better way to show messages to the user
			alert("One of the necessaries files (VCF, Exon ou Aplicon) are not yet loaded. Please load them first before process.");
		}
	},
	render: function(){
		return (
			<div id="page-wrapper">
				<h1>JsCoverageQC Report</h1>
				<form className="formElem" onSubmit={ this.handleSubmit }>
					<div>
						Select a vcf file:
						<input type="file" id="vcfFile" ref="vcfFile"/>
					</div>
					<div>
						Select an exon bed file
						<input type="file" id="exonFile" ref="exonFile"/>
					</div>
					<div>
						Select an amplicon bed file
						<input type="file" id="ampliconFile" ref="ampliconFile"/>
					</div>
					<div>
						Select a DoNotCallFile (optional)
						<input type="file" id="doNotCallFile" ref="doNotCallFile"/>
					</div>
					<div>
						Select a TSV variant file (optional)
						<input type="file" id="variantTsv" ref="variantTsv"/>
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
