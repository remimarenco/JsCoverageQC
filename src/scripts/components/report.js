'use strict';

var React = require('react/addons');
var classNames = require('classnames');

//require('../../styles/tablesorter.theme.default.css');
require('../../styles/report.css');

var QcRules = React.createClass({
	// TODO: Add the exportLink + content
	render: function(){
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
			    <li>After selecting variants for export, <a id="exportLink" href="#">click here</a> to see them as a text document suitable for cut-and-paste operations.</li>
			</ul>
		);
	}
});

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
	showOrHideButtonAllClicked: function(){
		this.props.showOrHideButtonAllClicked();
	},
	render: function(){
		var ExpandCollapseButton = require('./ExpandCollapseButton');

		var allReadsTh = [];
		this.props.bins.forEach(function(bin, index){
			allReadsTh.push(<th key={index}>{bin.name}<br/>reads</th>);
		});
		return(
			<tr>
				<th>
					<ExpandCollapseButton onClickShowOrHideButton={this.showOrHideButtonAllClicked} elementKey={this.props.key}/>
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
	showOrHideButtonAllClicked: function(){
		this.props.showOrHideButtonAllClicked();
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
		var ExpandCollapseButton = require('./ExpandCollapseButton');
		
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
			//console.log("Dans geneExonParent: "+bin.pct);
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
						<a href="{ensemblID}">{geneExonProps.ensemblTranscriptId}</a>
						<br/>RefSeq accession no.: 
						<a href="{refSeqAccessionNo}">{geneExonProps.refSeqAccNo}</a>
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

	clickShowOrUpdate: function(){
		this.refs.expandCollapseButton.showOrHide();
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
						<input type="checkbox" className="exportCheckbox"/>
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
		var filteredAndAnnotatedVariantRows = [];
		this.props.geneExon.variants.forEach(function(variant, index){
			filteredAndAnnotatedVariantRows.push(<FilteredAndAnnotatedVariantRow variant={variant} key={index}/>);
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
		var DrawingChart = require('./DrawingChart');
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
			filteredAndAnnotatedVariants = <FilteredAndAnnotatedVariants geneExon={this.props.geneExon}/>;
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
				<GeneExonParent ref={__parentKey} key={__parentKey} elementKey={__parentKey} geneExon={geneExon} position={position} onClickShowOrHideButton={self.showOrHideButtonClicked}/>
			);
			self.allGeneExonRows.push(
				<GeneExonChild key={__childKey} geneExon={geneExon} position={position} display={self.state.shouldDisplayChild[__parentKey]}/>
			);
		});
		return(
			<tbody>
				{this.allGeneExonRows}
			</tbody>
		);
	},

	// Functions made for external access
	showOrHideButtonAllClicked: function(){
		var self = this;

		this.props.geneExons.forEach(function(geneExon, index){
			var __parentKey = self.generateParentKey(index);
			self.refs[__parentKey].clickShowOrUpdate();
		});
	},
	geneExonShown: function(){
		//debugger;
		this.numberOfChildCurrentlyDisplayed++;

		// If we shown every child, update the UI
		if(this.numberOfChildCurrentlyDisplayed === this.numberOfChildToDisplay){
			this.geneExonAllShown();
		}
	},
	geneExonAllShown: function(){
		// Once it is finished, we send an event to notify the end
		this.props.showAllEnded();
	}
});

var QcReportTable = React.createClass({
	showOrHideButtonAllClicked: function(){
		this.props.showOrHideButtonAllClicked();

		this.refs.bodyReportTable.showOrHideButtonAllClicked();
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
					<BodyReportTable geneExons={this.props.geneExons} ref="bodyReportTable" showAllEnded={this.showAllEnded}/>
				</table>
			</span>
		);
	}
});

var Report = React.createClass({
	getInitialState: function(){
		return{
			showBlocker: false
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
			qcReportTable = <QcReportTable geneExons={this.props.vcf.geneExons} showOrHideButtonAllClicked={this.showOrHideButtonAllClicked} showAllEnded={this.showAllEnded}/>;
		}

		return(
			<div>
				{this.Blocker}
				<h2>Coverage QC Report</h2>
				{this.InformationsTable}
				<QcRules pass={pass}
					warn={warn}
					fail={fail}/>
				{qcReportTable}
			</div>
		);
	},

	// Custom functions
	showOrHideButtonAllClicked: function(){
		//debugger;
		this.setState({showBlocker: true});
	},
	showAllEnded: function(){
		//debugger;
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
	}
});

module.exports = Report;