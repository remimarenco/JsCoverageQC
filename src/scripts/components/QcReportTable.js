'use strict';

var React = require('react/addons');
var ExpandCollapseButton = require('./ExpandCollapseButton');
var DrawingChart = require('./DrawingChart');

var classNames = require('classnames');

var FirstHeadRow = React.createClass({
	render: function(){
		return(
			<tr>
				<th></th>
				<th colSpan="5">gene/exon</th>
				<th colSpan={this.props.binsLength}>base count by read depth</th>
			</tr>
		);
	}
});

var SecondHeadRow = React.createClass({
	render: function(){

		var allReadsTh = [];
		this.props.bins.forEach(function(bin, index){
			allReadsTh.push(<th key={index}>{bin.name}<br/>reads</th>);
		});
		return(
			<tr>
				<th>
					<ExpandCollapseButton onClickShowOrHideButton={this.props.showOrHideButtonAllClicked} elementKey={this.props.key}/>
				</th>
				<th>QC</th>
				<th>name</th>
				<th>%exon<br/>reported</th>
				<th>locus</th>
				<th>variant</th>
				{allReadsTh}
			</tr>
		);
	}
});

var HeadReportTable = React.createClass({
	//TODO: Delete
	showOrHideButtonAllClicked: function(display){
		this.props.showOrHideButtonAllClicked(display);
	},
	render: function(){
		return(
			<thead>
				<FirstHeadRow binsLength={this.props.bins.length}/>
				<SecondHeadRow bins={this.props.bins} showOrHideButtonAllClicked={this.props.showOrHideButtonAllClicked}/>
			</thead>
		);
	}
});

var ReadHistogram = React.createClass({
	componentDidMount: function(){
		var domNodeReadHistogram = '#'+this.props.identifier;

		/* jshint ignore:start */
		$(domNodeReadHistogram).css("background-position", '0px ' +
		(((1.0 * (100 - this.props.bin.pct)) / 100) * $(domNodeReadHistogram).outerHeight()) + 'px');
		/* jshint ignore:end */
	},
	render: function(){
		return(
			<td className="readHistogram" id={this.props.identifier}>
				{this.props.bin.count}
			</td>
		);
	}
});

var GeneExonParent = React.createClass({
	showOrHideButtonCliked: function(e){
		this.props.onClickShowOrHideButton(this.props.elementKey);
	},
	// TODO: The link to collapse or show should be on the entire TD and not only on the '+'' or '-' text for UX
	render: function(){
		var geneExonProps = this.props.geneExon;

		var geneExonPosition = 'geneExon'+this.props.position;

		var variantCalled = geneExonProps.getVariantCalled();
		var variantAnnotated = geneExonProps.getVariantAnnotated() ? '(annotated)' : '';
		var onlyContainsText = <span><br/>Do Not Call, on lab list<br/> of definitive do-not-calls</span>;
		var onlyContainsDoNotCallAlways = geneExonProps.getOnlyContainsDoNotCallAlways() ? onlyContainsText : '';
		var trClasses = classNames({
			'geneExon_parent': true,
			'fontWeightBold': variantCalled
		});
		var colorQcClasses = classNames({
			'qcGeneExonColor_pass': (geneExonProps.qc === 'pass'),
			'qcGeneExonColor_warn': (geneExonProps.qc === 'warn'),
			'qcGeneExonColor_fail': (geneExonProps.qc === 'fail')
		});

		var ensemblID = "http://www.ensembl.org/id/" + geneExonProps.ensemblTranscriptId;
		var refSeqAccessionNo = "http://www.ncbi.nlm.nih.gov/nuccore/" + geneExonProps.refSeqAccNo;
		// TODO: locus url to add
		var locus = "";

		var readHistogram = [];

		var self = this;

		geneExonProps.bins.forEach(function(bin, index){
			var refReadHistogram = 'readHistogram_' + self.props.geneExon.name + index;
			readHistogram.push(<ReadHistogram bin={bin} identifier={refReadHistogram} key={index}/>);
		});

		return(
			<tr className={trClasses}>
				<td>
					<ExpandCollapseButton ref="expandCollapseButton" onClickShowOrHideButton={this.showOrHideButtonCliked} elementKey={this.props.elementKey}/>
				</td>
				<td className={colorQcClasses} data-export-label="qc">
				    {geneExonProps.qc}
				</td>
				<td data-export-label="exon">
					{geneExonProps.name}
					<br/>
					<span className="geneExonSmallDetails">Ensembl ID: 
						<a href={ensemblID} target="_blank">{geneExonProps.ensemblTranscriptId}</a>
						<br/>RefSeq accession no.: 
						<a href={refSeqAccessionNo} target="_blank">{geneExonProps.refSeqAccNo}</a>
						<br/>vendor ID: {geneExonProps.vendorGeneExonName}
					</span>
				</td>
				<td className="alignRight">{geneExonProps.pctOfExon}</td>
				<td data-export-label="locus">
					<a href="#">
						{geneExonProps.chr}:{geneExonProps.startPos}-{geneExonProps.endPos}
					</a>
				</td>
				<td>
					{variantCalled.toString()}
					{variantAnnotated}
					{onlyContainsDoNotCallAlways}
				</td>
				{readHistogram}
			</tr>
		);
	},

	clickShowOrUpdate: function(display){
		this.refs.expandCollapseButton.showOrHide(display);
	}
});

var FilteredAndAnnotatedVariantRow = React.createClass({
	render: function(){
		var variantProp = this.props.variant;
		var dbSnpUrl = "http://www.ncbi.nlm.nih.gov/projects/SNP/snp_ref.cgi?"+variantProp.dbSnpIdPrefix+'='+variantProp.dbSnpIdSuffix;
		var cosmicUrl = "http://cancer.sanger.ac.uk/cosmic/search?q="+variantProp.cosmicId;
		var cosmicAlternate = "http://cancer.sanger.ac.uk/cosmic/search?q="+variantProp.geneMutation;
		var geneNumber = variantProp.gene+'chr'+variantProp.chr+variantProp.coordinate;
		return(
			<tbody>
				<tr className="filteredAnnotatedVariant">
					<td className="alignMiddle">
						<input type="checkbox"
							className="exportCheckbox"
							onChange={this.onCheckedVariant}/>
					</td>
					<td data-export-label="gene">{variantProp.gene}</td>
					<td data-export-label="coordinate">chr{variantProp.chr}:{variantProp.coordinate}</td>
					<td data-export-label="filters">{variantProp.filters}</td>
					<td data-export-label="consequence">{variantProp.consequence}</td>
					<td data-export-label="genotype">{variantProp.genotype}</td>
					<td data-export-label="avf" className="alignRight">{variantProp.altVariantFreq}</td>
					<td data-export-label="cDna">{variantProp.hgvsc}</td>
					<td data-export-label="aminoAcid">{variantProp.hgvsp}</td>
					<td>
					    <a href={dbSnpUrl}>
					        {variantProp.dbSnpIdPrefix}
					        {variantProp.dbSnpIdSuffix}
					    </a>
					</td>
					<td data-export-label="maf" className="alignRight">
					    {variantProp.alleleFreqGlobalMinor}
					</td>
					<td>
					    <a href={cosmicUrl}>
					        {variantProp.cosmicId}
					    </a>
					</td>
					<td>
					    <a href={cosmicAlternate}>
					        {variantProp.geneMutation}
					    </a>
					</td>
					<td width="5%">
						{variantProp.typeOfDoNotCall}
					</td>
				</tr>
			</tbody>
		);
	},

	onCheckedVariant: function(){
		this.props.onCheckedVariant(this.props.geneKey, this.props.variantKey);
	}
});

var FootNoteTable = React.createClass({
	render: function(){
		return(
			<table className="footNoteTable">
				<tbody>
					<tr>
						<td colSpan="2" id="footNoteFiltersDescription">
							<sup>*</sup>filter descriptions
						</td>
					</tr>
					<tr>
						<td>LowDP</td>
						<td>
							= low coverage (DP tag), therefore no genotype called
						</td>
					</tr>
					<tr>
						<td>SB</td>
						<td>
							= variant strand bias too high
						</td>
					</tr>
					<tr>
						<td>PB</td>
						<td>
							= probe pool bias - variant not found, or found with low frequency, in one of two probe pools
						</td>
					</tr>
				</tbody>
			</table>
		);
	}
});

var FilteredAndAnnotatedVariants = React.createClass({
	render: function(){
		var self = this;
		var filteredAndAnnotatedVariantRows = [];
		this.props.geneExon.variants.forEach(function(variant, index){
			filteredAndAnnotatedVariantRows.push(
				<FilteredAndAnnotatedVariantRow variant={variant}
					key={index}
					geneKey={self.props.geneIndex}
					variantKey={index}
					onCheckedVariant={self.props.onCheckedVariant}/>);
		});
		return(
			<div id="filteredAndAnnotatedVariants">
				<h3>Filtered and Annotated Variant(s)</h3>
				<table className="dataTable">
					<thead>
						<tr>
							<th>export?</th>
							<th>gene</th>
							<th>coordinate</th>
							<th>filters</th>
							<th>consequence</th>
							<th>genotype</th>
							<th>AVF</th>
							<th>cDNA</th>
							<th>amino acid</th>
							<th>dbSNP</th>
							<th>MAF</th>
							<th>COSMIC ID</th>
							<th>COSMIC (alternate)</th>
							<th>call status</th>
						</tr>
					</thead>
					{filteredAndAnnotatedVariantRows}
				</table>
				<br/>
				<FootNoteTable/>
			</div>
		);
	}
});

var GeneExonChild = React.createClass({
	componentWillMount: function(){
		this.drawingChart = <DrawingChart geneExon={this.props.geneExon} position={this.props.position}/>;
	},
	render: function(){
		var geneExonPositionId = 'geneExon'+ this.props.position;
		var geneExonPositionIdDiv = geneExonPositionId + '_div';
		var geneExonPositionClass = geneExonPositionId+'_child';
		var nbBinsPlusSixColumns = this.props.geneExon.bins.length + 6;
		var trClasses = classNames(
			'tablesorter-childRow',
			'geneExon_child',
			geneExonPositionClass
		);

		var filteredAndAnnotatedVariants;
		if(this.props.geneExon.variants.length > 0){
			filteredAndAnnotatedVariants =
				<FilteredAndAnnotatedVariants geneExon={this.props.geneExon}
					geneIndex={this.props.position}
					onCheckedVariant={this.onCheckedVariant}/>;
		}

		var trDisplayStyle = {display: 'none'};
		var drawingChart;
		if(this.props.display){
			trDisplayStyle = {display: 'table-row'};
			drawingChart = this.drawingChart;
		}
		else{
			drawingChart = null;
		}

		return(
				<tr style={trDisplayStyle} className={trClasses}>
					<td colSpan={nbBinsPlusSixColumns}>
						{drawingChart}
						{filteredAndAnnotatedVariants}
					</td>
				</tr>
		);
	},

	onCheckedVariant: function(geneKey, variantKey){
		this.props.onCheckedVariant(this.props.geneExon, geneKey, variantKey);
	}
});

var BodyReportTable = React.createClass({
	getInitialState: function(){
		return{
			shouldDisplayChild: {}
		};
	},
	generateParentKey: function(number){
		return 'geneExonParent' + number;
	},
	generateChildKey: function(number){
		return 'geneExonChild' + number;
	},
	componentDidMount: function(){
		// We keep the number of child to display
		this.numberOfChildToDisplay = this.props.geneExons.length;

		this.opening = false;
		this.v_showOrHideButtonAllClicked = false;
		/** @type {Number} The number of child currently displayed */
		this.numberOfChildCurrentlyDisplayed = 0;

		var self = this;

		this.props.geneExons.forEach(function(geneExon, index){
			var __parentKey = self.generateParentKey(index);
			var __childKey = self.generateChildKey(index);

			var tempDict = self.state.shouldDisplayChild;
			tempDict[__parentKey] = false;
			self.setState({shouldDisplayChild: tempDict});
		});
	},
	showOrHideButtonClicked: function(parentKey, forceState){
		var tempDict = this.state.shouldDisplayChild;
		// In case we do not received a forceState, we guess we just want to change the state to the opposite
		if(forceState === null || typeof forceState === 'undefined'){
			tempDict[parentKey] = !this.state.shouldDisplayChild[parentKey];
		}
		else{
			tempDict[parentKey] = forceState;
		}

		this.setState({shouldDisplayChild: tempDict}, this.geneExonShown);
	},
	render: function(){
		this.allGeneExonRows = [];
		var self = this;
		this.props.geneExons.forEach(function(geneExon, index){
			var position = index + 1;
			var __parentKey = self.generateParentKey(index);
			var __childKey = self.generateChildKey(index);

			self.allGeneExonRows.push(
				<GeneExonParent ref={__parentKey}
					key={__parentKey}
					elementKey={__parentKey}
					geneExon={geneExon}
					position={position}
					onClickShowOrHideButton={self.showOrHideButtonClicked}/>
			);
			self.allGeneExonRows.push(
				<GeneExonChild key={__childKey}
					geneExon={geneExon}
					position={position}
					display={self.state.shouldDisplayChild[__parentKey]}
					onCheckedVariant={self.props.onCheckedVariant}/>
			);
		});
		return(
			<tbody>
				{this.allGeneExonRows}
			</tbody>
		);
	},

	// Functions made for external access
	showOrHideButtonAllClicked: function(display){
		var self = this;

		this.opening = display;
		this.v_showOrHideButtonAllClicked = true;

		this.props.geneExons.forEach(function(geneExon, index){
			var __parentKey = self.generateParentKey(index);
			self.refs[__parentKey].clickShowOrUpdate();
		});
	},
	geneExonShown: function(){
		this.numberOfChildCurrentlyDisplayed++;

		// If we shown every child, update the UI
		if(this.numberOfChildCurrentlyDisplayed === this.numberOfChildToDisplay){
			if(this.showOrHideButtonAllClicked){
				this.geneExonAllShown();
			}
			this.numberOfChildCurrentlyDisplayed = 0;
		}
	},
	geneExonAllShown: function(){
		this.opening = false;
		// Once it is finished, we send an event to notify the end
		this.props.showAllEnded();
	}
});

var QcReportTable = React.createClass({
	showOrHideButtonAllClicked: function(display){
		// If it is open, then ask to close all
		// Else, then ask to open all
		if(display === true){
			this.props.showButtonAllClicked(display);
		}
		else{
			this.refs.bodyReportTable.showOrHideButtonAllClicked(display);
		}
	},
	reportShowOrHideEnded: function(display){
		this.refs.bodyReportTable.showOrHideButtonAllClicked(display);
	},
	showAllEnded: function(){
		this.props.showAllEnded();
	},
	componentDidMount: function(){

		/* jshint ignore:start */
		$("#qcReportTable").tablesorter();
		/* jshint ignore:end */
	},
	render: function(){
		return(
			<span>
				<table id="qcReportTable" className="dataTable">
					<HeadReportTable bins={this.props.geneExons.one().bins} showOrHideButtonAllClicked={this.showOrHideButtonAllClicked}/>
					<BodyReportTable geneExons={this.props.geneExons}
						ref="bodyReportTable"
						showAllEnded={this.showAllEnded}
						onCheckedVariant={this.props.onCheckedVariant}/>
				</table>
			</span>
		);
	}
});

module.exports = QcReportTable;