'use strict';

var React = require('react/addons');

// Load the InformationsTable Component
var InformationsTable = require('components/InformationsTable');

// Load the table containing all the exons report
var QcReportTable = require('components/QcReportTable');

require('styles/report.css');

var classNames = require('classnames');

require('jquery-ui');

var appElement = document.getElementById('content');

var DialogContent = React.createClass({
  render: function(){
  	// TODO: Use CSS to manage the style of the content (not hX => X a number)
  	var self = this;

  	var propVariantsChecked = this.props.variantsChecked;
  	var variantsChecked = [];
  	var toObjectVariantsChecked = Object.keys(propVariantsChecked);

  	var interpretationContent = [];
  	var interpretation;
  	var resultsContent = [];
  	var results;
  	var referenceAssembly;
  	var failedExonsContent = [];
  	var failedExonsText;
  	var notes;

  	/////////////////////
  	// FailedContent //
  	/////////////////////
  	var failedExons = this.props.failedExons;

  	failedExonsContent = failedExons.map(function(failedExonAndPct, index){
  		var failedExonContentHtml =
  			<p key={index}>
  				gene/exon: {failedExonAndPct.exon.name};
  				{failedExonAndPct.exon.chr}: {failedExonAndPct.exon.startPos}-{failedExonAndPct.exon.endPos}; 
  				pct-of-locus-failing-QC: {failedExonAndPct.pct}
  			</p>;
  		return failedExonContentHtml;
  	});

  	/////////////////////////////////
  	// Interpretation and Result //
  	/////////////////////////////////
  	if(toObjectVariantsChecked.length !== null &&
  		typeof toObjectVariantsChecked.length !== 'undefined' &&
  		toObjectVariantsChecked.length > 0){

  		// For each variantChecked Object, we look into it to push the interpretation Content
  		for(var key in propVariantsChecked){
  			if (propVariantsChecked.hasOwnProperty(key)){
  				var geneVariantsObj = propVariantsChecked[key];
  				var content = this.writeContent(geneVariantsObj);
  				interpretationContent.push(content.interpretationContent);
  				resultsContent.push(content.resultsContent);
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
  	// TODO: Do not display this if there is no failed
  	failedExonsText = 
  		<div>
  			<h2>Portions of the following captured regions were not sequenced 
  				sufficiently for clinical interpretation (at least one base in the sequenced portion 
  				of the coding region was read less than 500 times):
  			</h2>
  			{failedExonsContent}
  		</div>;
    return(
	    <div>
          	{interpretation}
          	<p>- See comment.</p>
          	{results}
          	{referenceAssembly}
          	{failedExonsText}
          	{notes}
	    </div>
    );
  },

  writeContent: function(geneVariantsObj){
  	var interpretationContent = [];
  	var resultsContent = [];
  	var boldClass = classNames('fontWeightBold');
  	for(var key in geneVariantsObj.variants){
  		var variant = geneVariantsObj.variants[key];
  		if (geneVariantsObj.variants.hasOwnProperty(key)){
  			///////////////////////
  			// Interpretation //
  			///////////////////////
  			var aminoAcid;
  			if(variant.hgvsp !== null && typeof variant.hgvsp !== 'undefined' &&
  				variant.hgvsp !== ''){
  				aminoAcid = "/ " + variant.hgvsp;
  			}

  			interpretationContent.push(
  				<div key={'interpretation_'+key}>
  					<p className={boldClass}>
  						POSITIVE for detection of {variant.gene} sequence variant by 
  						next generation sequencing: {variant.gene} {variant.hgvsc} {aminoAcid} in
  						exon {geneVariantsObj.gene.name}
  					</p>
  				</div>
  			);

  			/////////////////
  			// Results //
  			/////////////////
  			resultsContent.push(
  				<div key={'result_'+key}>
      				<p className={boldClass}>
      					{geneVariantsObj.gene.name} (EnsemblID: {geneVariantsObj.gene.ensemblExonId}
      					; RefSeq accession no: {geneVariantsObj.gene.refSeqAccNo}; {geneVariantsObj.gene.chr}: 
      					{geneVariantsObj.gene.startPos}-{geneVariantsObj.gene.endPos}
      				</p>
      				<p>
      					gene: {geneVariantsObj.gene.name}; coordinate: {variant.coordinate}; genotype: {variant.genotype}; 
      					alt-variant-freq: {variant.altVariantFreq}; cDna: {variant.hgvsc}; amino-acid: {variant.hgvsp}
      				</p>
  				</div>
  			);
  		}
  	}
  	return {interpretationContent: interpretationContent, resultsContent: resultsContent};
  }
});

var QcRules = React.createClass({
	openModal: function(e) {
		e.preventDefault();

		// TODO: Check if there is already a dialog open, if yes => Do nothing

		var propVariantsChecked = this.props.variantsChecked;
		var toObjectVariantsChecked = Object.keys(propVariantsChecked);

		// TODO: Create a function to put this code outside of "openModal"
		var exportTitle = "Export selected variant";
		if(toObjectVariantsChecked.length !== null &&
			typeof toObjectVariantsChecked.length !== 'undefined' &&
			toObjectVariantsChecked.length > 0){

			if(toObjectVariantsChecked.length > 1)
			{
				exportTitle += "s";
			}
		}

		var $dialog = $('<div id="exportDialog">').dialog({
	        title: exportTitle,
	        width:$(window).width() * 0.6,
	        height:$(window).height() * 0.8,
	        close: function(e){
	          React.unmountComponentAtNode(this);
	          $( this ).remove();
	        }
      	});

		var closeDialog = function(e){
			e.preventDefault();
			$dialog.dialog('close');
		};

		React.render(
			<DialogContent closeDialog={closeDialog}
				variantsChecked={this.props.variantsChecked}
				failedExons={this.props.failedExons}/>,
			$dialog[0]
		);
	},
	// TODO: Add the exportLink + content
	render: function(){
        // TODO: Put the Dialog in a better place
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
			</ul>
		);
	}
});

var Report = React.createClass({
	getInitialState: function(){
		return{
			variantsChecked: {}
		};
	},
	componentWillMount: function(){
		// TODO: Warning about the componentWillMount called only once? The blocker would not be update...
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
		var qcReportTable = <QcReportTable
				ref="qcReportTable"
				geneExons={this.props.vcf.geneExons}
				showButtonAllClicked={this.props.showButtonAllClicked}
				showAllEnded={this.props.showAllEnded}
				onCheckedVariant={this.onCheckedVariant}/>;

		/////////////////////////
		// Failed Gene Exons //
		/////////////////////////
		var failedExons = this.processFailedExons(this.props.vcf.geneExons);

		return(
			<div>
				<h2>Coverage QC Report</h2>
				{this.InformationsTable}
				<QcRules pass={pass}
					warn={warn}
					fail={fail}
					variantsChecked={this.state.variantsChecked}
					failedExons={failedExons}/>
				{qcReportTable}
			</div>
		);
	},

	// Custom functions
	initInformationsTable: function(){

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
	reportShowOrHideEnded: function(display){
		this.refs.qcReportTable.reportShowOrHideEnded(display);
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
					var variant = s_variantsChecked[geneIndex].variants;
					variant[variantIndex] = gene.variants[variantIndex];
					var objVariantsCheckedGene_ToAdd = {
						variants: {
							$merge: variant
						}
					};
					var new_VariantsCheckedGene_State = React.addons.update(s_variantsChecked[geneIndex], objVariantsCheckedGene_ToAdd);
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
	},
	processFailedExons: function(geneExons){
		var failedExons = [];
		var failedGeneAndPct = {};

		// TODO: Sort by order, using a collectionjs
		failedExons = geneExons
		    .filter(function(geneExon){
		        return geneExon.bins[0].pct > 0 || geneExon.bins[1].pct > 0;
		    })
		    .map(function(geneExon){
		        return {
		            exon: geneExon,
		            pct: geneExon.bins[0].pct + geneExon.bins[1].pct
		        };
		    });

		return failedExons;
	}
});

module.exports = Report;