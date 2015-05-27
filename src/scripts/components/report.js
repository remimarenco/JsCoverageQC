'use strict';

var React = require('react/addons');

//require('../../styles/tablesorter.theme.default.css');
require('../../styles/report.css');

var classNames = require('classnames');

var Modal = require('react-modal');

var appElement = document.getElementById('content');

Modal.setAppElement(appElement);
Modal.injectCSS();

var QcRules = React.createClass({
	// TODO: Separate the modal from the QCRules
	getInitialState: function() {
	    return { modalIsOpen: false };
	},
	openModal: function() {
	    this.setState({modalIsOpen: true});
	},
	closeModal: function() {
	    this.setState({modalIsOpen: false});
	},
	// TODO: Add the exportLink + content
	render: function(){
		var Modal = require('react-modal');

		var propVariantChecked = this.props.variantChecked;
		var variantsChecked = [];
		var toObjectVariantChecked = Object.keys(propVariantChecked);

		var exportTitle = "Export selected variant";

		var interpretationContent = [];
		var interpretation;
		var resultsContent;
		var results;
		var referenceAssembly;
		var failedExonsContent;
		var failedExons;
		var notes;
		if(toObjectVariantChecked.length !== null &&
			typeof toObjectVariantChecked.length !== 'undefined' &&
			toObjectVariantChecked.length > 0){

			// TODO: Delete this repetition
			exportTitle = "Export selected variant";
			if(toObjectVariantChecked.length > 1)
			{
				exportTitle += "s";
			}

			var boldClass = classNames('fontWeightBold');

			for(var key in propVariantChecked){
				if (propVariantChecked.hasOwnProperty(key)){
					interpretationContent.push(
						<p className={boldClass}>
							POSITIVE for detection of {propVariantChecked[key].gene} sequence variant by 
							next generation sequencing: 
							{propVariantChecked[key].gene} {propVariantChecked[key].hgvsc} / {propVariantChecked[key].hgvsp} 
							in exon {propVariantChecked[key].gene}
						</p>
					);
				}
			}
		}
		else{
			interpretationContent = <p>No variants detected by next-generation sequencing.</p>;
			resultsContent = <p>No variants detected by next-generation sequencing.</p>;
		}

		interpretation =
			<div>
				<h2>Interpretation</h2>
				{interpretationContent}
			</div>;

		results =
			<div>
				<h2>Results</h2>
				{resultsContent}
			</div>;

		referenceAssembly = <p id="referenceAssembly">The reference assembly is hg19, GRCh37.</p>;

		// TODO: The failedExons loop
		failedExons = 
			<div>
				<h2>Portions of the following captured regions were not sequenced 
					sufficiently for clinical interpretation (at least one base in the sequenced portion 
					of the coding region was read less than 500 times):
				</h2>
				{failedExonsContent}
			</div>;

		var modal = <Modal isOpen={this.state.modalIsOpen}
          onRequestClose={this.closeModal}>
          	<h1>{exportTitle}</h1>
          	{interpretation}
          	{results}
          	{referenceAssembly}
          	{failedExons}
          	{notes}
          	<button onClick={this.closeModal}>Close</button>
          </Modal>;
		return(
			<ul>
			    <li>QC rules are applied to bases <i>in the coding region</i> of each locus:
			        <ul>
			            <li>pass: <i>all</i> bases read {this.props.pass} times</li>
			            <li>warn: <i>all</i> bases read {this.props.warn.warn1} or {this.props.warn.warn2} times</li>
			            <li>fail: <i>any</i> base read {this.props.fail.fail1} or {this.props.fail.fail2} times</li>
			        </ul>
			    </li>
			    <li>Coding regions and amplicons are specified by vendor.</li>
			    <li>If the gVCF file contains multiple entries for the same position (e.g., indels), the maximum read depth value is reported here.</li>
			    <li>After selecting variants for export, <a id="exportLink" href="#" onClick={this.openModal}>click here</a> to see them as a text document suitable for cut-and-paste operations.</li>
				{modal}
			</ul>
		);
	}
});

var Report = React.createClass({
	getInitialState: function(){
		return{
			showBlocker: false,
			variantChecked: {}
		};
	},
	componentWillMount: function(){
		// TODO: Warning about the componentWillMount called only once? The blocker would not be update...
		this.initBlocker();

		this.initInformationsTable();
	},
	render: function(){
		var propsVcf = this.props.vcf;

		var pass;
		var warn = {warn1: '', warn2: ''};
		var fail = {fail1: '', fail2: ''};
		if(propsVcf && propsVcf.geneExons){
			pass = propsVcf.geneExons.one().bins[3].name;
			warn.warn1 = propsVcf.geneExons.one().bins[1].name;
			warn.warn2 = propsVcf.geneExons.one().bins[2].name;
			fail.fail1 = propsVcf.geneExons.one().bins[0].name;
			fail.fail2 = propsVcf.geneExons.one().bins[1].name;
		}

		// Only show the bodyReportTable once the googleLibChar has been loaded
		var qcReportTable;
		if(this.props.googleChartLibLoaded){
			var QcReportTable = require('./QcReportTable');
			qcReportTable = <QcReportTable geneExons={this.props.vcf.geneExons}
				showOrHideButtonAllClicked={this.showOrHideButtonAllClicked}
				showAllEnded={this.showAllEnded}
				onCheckedVariant={this.onCheckedVariant}/>;
		}

		return(
			<div>
				{this.Blocker}
				<h2>Coverage QC Report</h2>
				{this.InformationsTable}
				<QcRules pass={pass}
					warn={warn}
					fail={fail}
					variantChecked={this.state.variantChecked}/>
				{qcReportTable}
			</div>
		);
	},

	// Custom functions
	showOrHideButtonAllClicked: function(){
		this.setState({showBlocker: true});
	},
	showAllEnded: function(){
		this.setState({showBlocker: false});
	},

	initBlocker: function(){
		// Load the Blocker Component
		var Blocker = require('./Blocker');
		this.Blocker = <Blocker displayMe={this.state.showBlocker}/>;
	},
	initInformationsTable: function(){
		// Load the InformationsTable Component
		var InformationsTable = require('./InformationsTable');

		var propsVcf = this.props.vcf;
		var filteredAnnotatedVariantCount;
		if(propsVcf && propsVcf.getFilteredAnnotatedVariantCount) {
			filteredAnnotatedVariantCount = propsVcf.getFilteredAnnotatedVariantCount();
		}

		this.InformationsTable = <InformationsTable version={propsVcf.version}
					runDate={propsVcf.runDate}
					fileName={propsVcf.fileName}
					variantTsvFileName={propsVcf.variantTsvFileName}
					variantTsvFileLineCount={propsVcf.variantTsvFileLineCount}
					filteredAnnotatedVariantCount={filteredAnnotatedVariantCount}
					exonBedFileName={propsVcf.exonBedFileName}
					ampliconBedFileName={propsVcf.ampliconBedFileName}
					doNotCallFileName={propsVcf.doNotCallFileName}
					/>;
	},

	onCheckedVariant: function(gene, key){
		debugger;
		var new_VariantChecked_State;

		// Check if it is an add or a a deletion
		if(this.state.variantChecked[key] !== null &&
			typeof this.state.variantChecked[key] !== 'undefined' &&
			Object.keys(this.state.variantChecked).length > 0){

			/* TODO: See why it is not working
			var keyArraysToUnshift = [];
			keyArraysToUnshift.push(key);
			// Used to change immutable data : https://facebook.github.io/react/docs/update.html
			new_VariantChecked_State = React.addons.update(this.state.variantChecked, {
				$unshift: keyArraysToUnshift
			});
			*/

			var tempVariantChecked = this.state.variantChecked;
			delete tempVariantChecked[key];
			this.setState({variantChecked: tempVariantChecked});
		}
		else{
			// Used to change immutable data : https://facebook.github.io/react/docs/update.html
			var objVariantChecked_ToAdd = {
				[key]: {
					$set: gene
				}
			};
			new_VariantChecked_State = React.addons.update(this.state.variantChecked, objVariantChecked_ToAdd);
			this.setState({variantChecked: new_VariantChecked_State});
		}
	}
});

module.exports = Report;