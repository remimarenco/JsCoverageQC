'use strict';

var React = require('react/addons');

require('../../styles/report.css');

var Blocker = React.createClass({
	render: function(){
		return(
			<div id="blocker">
				<div>wait...</div>
			</div>
		);
	}
});

var VariantTSV = React.createClass({
	render: function(){
		var renderVariantTsv;
		if(this.props.variantTsvFileName){
			renderVariantTsv = <span id="tsvOk">
					<br/>variant TSV file line count (including header): {this.props.variantTsvFileLineCount}
					<br/>number of annoted variants displayed below: {this.props.filteredAnnotatedVariantCount}
				</span>;
		}
		else{
			renderVariantTsv = <span id="tsvNOk">
					<span>*** NO VARIANT TSV FILE IDENTIFIED ***</span>
					<span>
					    <br/>This report was likely created in error.
					</span>
				</span>;
		}
		return(
			<span>
				{renderVariantTsv}
			</span>
		);
	}
});

var InformationsTable = React.createClass({
	render: function(){
		return(
			<table>
				<tr>
					<td>version</td>
					<td>:</td>
					<td id="version">
						{this.props.version}
					</td>
				</tr>
				<tr>
					<td>report run date</td>
					<td>:</td>
					<td id="runDate">
						{this.props.runDate ? this.props.runDate.toDateString() : ''}
					</td>
				</tr>
				<tr>
					<td>gVCF file</td>
					<td>:</td>
					<td id="fileName">
						{this.props.fileName}
					</td>
				</tr>
				<tr>
					<td>variant TSV file</td>
					<td>:</td>
					<td>
						<VariantTSV variantTsvFileName={this.props.variantTsvFileName}
							variantTsvFileLineCount={this.props.variantTsvFileLineCount}
							filteredAnnotatedVariantCount={this.props.filteredAnnotatedVariantCount}/>
					</td>
				</tr>
				<tr>
					<td>exon BED file</td>
					<td>:</td>
					<td id="exonBedFileName">
						{this.props.exonBedFileName}
					</td>
				</tr>
				<tr>
					<td>amplicon BED file</td>
					<td>:</td>
					<td id="ampliconBedFileName">
						{this.props.ampliconBedFileName}
					</td>
				</tr>
				<tr>
					<td>Do NOT Call file</td>
					<td>:</td>
					<td id="doNotCallFileName">
						{this.props.doNotCallFileName}
					</td>
				</tr>
			</table>
		);
	}
});

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

var HeadReportTable = React.createClass({
	render: function(){
		var allReadsTh = [];
		this.props.bins.forEach(function(bin){
			allReadsTh.push(<th>{bin.name}<br/>reads</th>);
		});
		return(
			<thead>
				<tr>
					<th></th>
					<th colSpan="5">gene/exon</th>
					<th colSpan={this.props.bins.length}>base count by read depth</th>
				</tr>
				<tr>
					<th>
						<a href="#" id="geneExonExpandCollapseAllButton">+</a>
					</th>
					<th>QC</th>
					<th>name</th>
					<th>%exon
						<br>reported</br>
						<th>locus</th>
						<th>variant</th>
						{allReadsTh}
					</th>
				</tr>
			</thead>
		);
	}
});

var ReadHistogram = React.createClass({
	render: function(){
		return(
			<td className="readHistogram" data-pct={this.props.pct}>
				{this.props.bin.count}
			</td>
		);
	}
});

var GeneExonParent = React.createClass({
	getInitialState: function(){
		return{
			showOrHideButton: '+'
		};
	},
	showOrHideButtonCliked: function(e){
		e.preventDefault();
		if(this.state.showOrHideButton === '+')
		{
			this.setState({showOrHideButton: '-'});
		}
		else{
			this.setState({showOrHideButton: '+'});
		}
	},
	// TODO: The link to collapse or show should be on the entire TD and not only on the '+'' or '-' text for UX
	render: function(){
		var cx = React.addons.classSet; // To manipulate class(es)
		var geneExonProps = this.props.geneExon;

		var geneExonPosition = 'geneExon'+this.props.position;

		var variantCalled = geneExonProps.getVariantCalled();
		// TODO: Check why AKT1ex3 is not marked as variantCalled
		var variantAnnotated = geneExonProps.getVariantAnnotated() ? '(annotated)' : '';
		var onlyContainsText = <span><br/>Do Not Call, on lab list<br/> of definitive do-not-calls</span>;
		var onlyContainsDoNotCallAlways = geneExonProps.getOnlyContainsDoNotCallAlways() ? onlyContainsText : '';
		var trClasses = cx({
			'geneExon_parent': true,
			'variantCalled': variantCalled
		});
		var colorQcClasses = cx({
			'qcGeneExonColor_pass': (geneExonProps.qc === 'pass'),
			'qcGeneExonColor_warn': (geneExonProps.qc === 'warn'),
			'qcGeneExonColor_fail': (geneExonProps.qc === 'fail')
		});

		var ensemblID = "http://www.ensembl.org/id/" + geneExonProps.ensemblTranscriptId;
		var refSeqAccessionNo = "http://www.ncbi.nlm.nih.gov/nuccore/" + geneExonProps.refSeqAccNo;
		// TODO: locus url to add
		var locus = "";

		var readHistogram = [];

		geneExonProps.bins.forEach(function(bin){
			readHistogram.push(<ReadHistogram bin={bin}/>);
		});
		return(
			<span>
				<tr className={trClasses}>
					<td>
						<a href='#' id={geneExonPosition} className="geneExonExpandCollapseButton"
							onClick={this.showOrHideButtonCliked}>
							{this.state.showOrHideButton}
						</a>
					</td>
					<td className={colorQcClasses} data-export-label="qc">
					    {geneExonProps.qc}
					</td>
					<td data-export-label="exon">
						{geneExonProps.name}
						<br/>
						<span className="geneExonSmallDetails">Ensembl ID: 
							<a href="{ensemblID}">{ensemblID}</a>
							<br/>RefSeq accession no.: 
							<a href="{refSeqAccessionNo}">{refSeqAccessionNo}</a>
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
			</span>
		);
	}
});

var FilteredAndAnnotatedVariantRow = React.createClass({
	render: function(){
		var variantProp = this.props.variant;
		var dbSnpUrl = "http://www.ncbi.nlm.nih.gov/projects/SNP/snp_ref.cgi?"+variantProp.dbSnpIdPrefix+'='+variantProp.dbSnpIdSuffix;
		var cosmicUrl = "http://cancer.sanger.ac.uk/cosmic/search?q="+variantProp.cosmicId;
		var cosmicAlternate = "http://cancer.sanger.ac.uk/cosmic/search?q="+variantProp.geneMutation;
		return(
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
		);
	}
});

var FootNoteTable = React.createClass({
	render: function(){
		return(
			<table className="footNoteTable">
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
			</table>
		);
	}
});

var FilteredAndAnnotatedVariants = React.createClass({
	render: function(){
		var filteredAndAnnotatedVariantRows = [];
		this.props.geneExon.variants.forEach(function(variant){
			filteredAndAnnotatedVariantRows.push(<FilteredAndAnnotatedVariantRow variant={variant}/>);
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
					<tbody>
						{filteredAndAnnotatedVariantRows}
					</tbody>
				</table>
				<br/>
				<FootNoteTable/>
			</div>
		);
	}
});

var GeneExonChild = React.createClass({
	render: function(){
		var DrawingChart = require('../functions/DrawingChart');
		var cx = React.addons.classSet; // To manipulate class(es)
		var geneExonPositionId = 'geneExon'+ this.props.position;
		var geneExonPositionClass = geneExonPositionId+'_child';
		var geneExonPositionIdDiv = geneExonPositionId + '_div';
		var nbBinsPlusSixColumns = this.props.geneExon.bins.length + 6;
		var trClasses = cx(
			'tablesorter-childRow',
			'geneExon_child',
			geneExonPositionClass
		);

		var filteredAndAnnotatedVariants;
		if(this.props.geneExon.variants.length > 0){
			filteredAndAnnotatedVariants = <FilteredAndAnnotatedVariants geneExon={this.props.geneExon}/>;
		}
		return(
			<span>
				<tr style={{display:'none'}} className={trClasses}>
					<td colSpan={nbBinsPlusSixColumns}>
						<div id={geneExonPositionIdDiv}>
							<DrawingChart geneExon={this.props.geneExon} position={this.props.position}/>
						</div>
						{filteredAndAnnotatedVariants}
					</td>
				</tr>
			</span>
		);
	}
});

var BodyReportTable = React.createClass({
	render: function(){
		var allGeneExonRows = [];
		this.props.geneExons.forEach(function(geneExon, index){
			var position = index + 1;
			allGeneExonRows.push(
				<span>
					<GeneExonParent geneExon={geneExon} position={position}/>
					<GeneExonChild geneExon={geneExon} position={position}/>
				</span>
			);
		});
		return(
			<span>
				{allGeneExonRows}
			</span>
		);
	}
});

var QcReportTable = React.createClass({
	render: function(){
		return(
			<span>
				<table id="QcReportTable" className="dataTable">
					<HeadReportTable bins={this.props.geneExons.one().bins}/>
					<BodyReportTable geneExons={this.props.geneExons}/>
				</table>
			</span>
		);
	}
});

var Report = React.createClass({
	render: function(){
		var propsVcf = this.props.vcf;
		var filteredAnnotatedVariantCount;
		if(propsVcf && propsVcf.getFilteredAnnotatedVariantCount) {
			filteredAnnotatedVariantCount = propsVcf.getFilteredAnnotatedVariantCount();
		}

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

		return(
			<div>
				<Blocker/>
				<h2>Coverage QC Report</h2>
				<InformationsTable version={propsVcf.version}
					runDate={propsVcf.runDate}
					fileName={propsVcf.fileName}
					variantTsvFileName={propsVcf.variantTsvFileName}
					variantTsvFileLineCount={propsVcf.variantTsvFileLineCount}
					filteredAnnotatedVariantCount={filteredAnnotatedVariantCount}
					exonBedFileName={propsVcf.exonBedFileName}
					ampliconBedFileName={propsVcf.ampliconBedFileName}
					doNotCallFileName={propsVcf.doNotCallFileName}
					/>
				<QcRules pass={pass}
					warn={warn}
					fail={fail}/>
				<QcReportTable geneExons={propsVcf.geneExons}/>
				<p>Copyright &#169; 2015 Rémi Marenco and Jeremy Goecks. Java original version : 2014 Geoffrey H. Smith.</p>
			</div>
		);
	}
});

module.exports = Report;