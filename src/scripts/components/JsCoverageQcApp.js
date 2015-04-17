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

var InputFile = React.createClass({
	getInitialState: function(){
		return{
			reader: new FileReader()
		};
	},
	handleFile: function(e){
		var self = this;
		var reader = new FileReader();
		var file = e.target.files[0];

		console.log(this.props.identifier);
		// When the file is loaded
		reader.onload = function(upload){
			//alert(self.props.ref);
		};

		reader.readAsText(file);
	},
	render: function(){
		return(
			<input type="file"
				id="{this.props.identifier}"
				ref="{this.props.identifier}"
				onChange={this.handleFile} />
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
		};
	},
	getFile: function(ReactRefName){
		//var fileInput = document.getElementById(htmlIdName);
		var fileInput = React.findDOMNode(ReactRefName);
		//var fileDisplayArea = document.getElementById('fileDisplayArea');
		var reader = new FileReader();
		if(fileInput.files.length !== 0){
			var file = fileInput.files[0];
			reader.readAsText(file);
		}
		/*
		fileInput.addEventListener('change', function(e){
			var file = fileInput.files[0];

			// When the file is loaded
			reader.onload = function(e){
				//fileDisplayArea.innerText = reader.result;
				//alert("File loaded!");
			};

			reader.readAsText(file);
		});
		*/

		return reader;
	},
	getParameters: function(){
		var parameters = [];

		parameters.vcf = this.props.readerVcfFile;
		parameters.exon = this.props.readerExonFile;
		parameters.amplicon = this.props.readerAmpliconFile;
		parameters.doNotCallFile = this.props.readerDoNotCallFile;
		parameters.readerVariantTsv = this.props.readerVariantTsv;

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
			alert("One of the necessaries files (VCF, Exon or Amplicon) is not yet loaded. Please load them first before process.");
		}
	},
	render: function(){
		return (
			<div id="page-wrapper">
				<h1>JsCoverageQC Report</h1>
				<form className="formElem" onSubmit={ this.handleSubmit }>
					<div>
						Select a vcf file:
						<InputFile identifier="vcfFile"/>
					</div>
					<div>
						Select an exon bed file
						<InputFile identifier="exonFile"/>
					</div>
					<div>
						Select an amplicon bed file
						<InputFile identifier="ampliconFile"/>
					</div>
					<div>
						Select a DoNotCallFile (optional)
						<InputFile identifier="doNotCallFile"/>
					</div>
					<div>
						Select a TSV variant file (optional)
						<InputFile identifier="variantTsv"/>
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
