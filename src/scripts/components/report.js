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

		var propVariantsChecked = this.props.variantsChecked;
		var variantsChecked = [];
		var toObjectVariantsChecked = Object.keys(propVariantsChecked);

		var exportTitle = "Export selected variant";

		var interpretationContent = [];
		var interpretation;
		var resultsContent;
		var results;
		var referenceAssembly;
		var failedExonsContent;
		var failedExons;
		var notes;
		if(toObjectVariantsChecked.length !== null &&
			typeof toObjectVariantsChecked.length !== 'undefined' &&
			toObjectVariantsChecked.length > 0){

			// TODO: Delete this repetition
			exportTitle = "Export selected variant";
			if(toObjectVariantsChecked.length > 1)
			{
				exportTitle += "s";
			}

			for(var key in propVariantsChecked){
				if (propVariantsChecked.hasOwnProperty(key)){
					var geneVariantsObj = propVariantsChecked[key];
					interpretationContent.push(this.writeInterpretationContent(geneVariantsObj));
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
	},

	writeInterpretationContent: function(geneVariantsObj){
		var interpretationContent = [];
		var boldClass = classNames('fontWeightBold');
		for(var key in geneVariantsObj.variants){
			var variant = geneVariantsObj.variants[key];
			if (geneVariantsObj.variants.hasOwnProperty(key)){
				interpretationContent.push(
					<p className={boldClass}>
						POSITIVE for detection of {variant.gene} sequence variant by 
						next generation sequencing: 
						{variant.gene} {variant.hgvsc} / {variant.hgvsp} in
						exon {geneVariantsObj.gene.name}
					</p>
				);
			}
		}
		return interpretationContent;
	}
});

var Report = React.createClass({
	getInitialState: function(){
		return{
			showBlocker: false,
			variantsChecked: {}
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
					variantsChecked={this.state.variantsChecked}/>
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

	onCheckedVariant: function(gene, geneIndex, variantIndex){
		var s_variantsChecked = this.state.variantsChecked;
		var new_VariantsChecked_State;

		// Check if it is an add or a a deletion
		if(s_variantsChecked[geneIndex] !== null &&
			typeof s_variantsChecked[geneIndex] !== 'undefined' &&
			Object.keys(s_variantsChecked).length > 0){

			/* TODO: See why it is not working
			var keyArraysToUnshift = [];
			keyArraysToUnshift.push(key);
			// Used to change immutable data : https://facebook.github.io/react/docs/update.html
			new_VariantsChecked_State = React.addons.update(this.state.variantsChecked, {
				$unshift: keyArraysToUnshift
			});
			*/
			// We check if there are already variants or not
			if(s_variantsChecked[geneIndex].variants !== null &&
				typeof s_variantsChecked[geneIndex].variants !== 'undefined' &&
				Object.keys(s_variantsChecked[geneIndex].variants).length > 0){
				// We check if the variants is already in the structure => Delete
				// Or if it is not => Add
				var s_variantsCheckedGene_variant = s_variantsChecked[geneIndex].variants[variantIndex];
				if(s_variantsCheckedGene_variant !== null &&
					typeof s_variantsCheckedGene_variant !== 'undefined'){

					var tempVariantsChecked = s_variantsChecked;
					delete tempVariantsChecked[geneIndex].variants[variantIndex];
					this.setState({variantsChecked: tempVariantsChecked}, function(){
						// if there is no more variants checked in this gene, we delete the gene structure
						if(Object.keys(s_variantsChecked[geneIndex].variants).length === 0){
							var tempVariantsChecked = s_variantsChecked;
							delete tempVariantsChecked[geneIndex];
							this.setState({variantsChecked: tempVariantsChecked});
						}
					});
				}
				else{
					var variant = [gene.variants[variantIndex]];
					var objVariantsCheckedGene_ToAdd = {
						variants: {
							$push: variant
						}
					};
					var new_VariantsCheckedGene_State = React.addons.update(s_variantsChecked[geneIndex].variants, objVariantsCheckedGene_ToAdd);
					this.setState({variantsChecked: {[geneIndex]: new_VariantsCheckedGene_State}});
				}
			}
			else{
				// Should never happen as we delete the s_variantsChecked[geneIndex] if there is no
				// more variants inside
				console.log("Something gone wrong => Else s_variantsChecked[geneIndex].variants");
			}
		}
		else{
			// If there is no variants yet for this gene, we add the gene in the tab + the variant
			// Used to change immutable data : https://facebook.github.io/react/docs/update.html
			var variants = {};
			variants = {[variantIndex]: gene.variants[variantIndex]};
			var objVariantsChecked_Gene_ToAdd = {
				gene: gene,
				variants
			};
			var objVariantsChecked_ToAdd = {
					[geneIndex]: {
						$set: objVariantsChecked_Gene_ToAdd
					}
				};
			new_VariantsChecked_State = React.addons.update(s_variantsChecked,
				objVariantsChecked_ToAdd);
			this.setState({variantsChecked: new_VariantsChecked_State});
		}
	}
});

module.exports = Report;