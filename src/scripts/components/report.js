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

var GeneExonParent = React.createClass({
	// TODO: The link to collapse or show should be on the entire TD and not only on the '+'' or '-' text for UX
	render: function(){
		var cx = React.addons.classSet; // To manipulate class(es)
		var geneExonProps = this.props.geneExon;
		var trClasses = cx({
			'geneExon_parent': true,
			'variantCalled': geneExonProps.getVariantCalled()
		});
		var colorQcClasses = cx({
			'qcGeneExonColor_pass': (geneExonProps.qc === 'pass'),
			'qcGeneExonColor_warn': (geneExonProps.qc === 'warn'),
			'qcGeneExonColor_fail': (geneExonProps.qc === 'fail')
		});

		return(
			<span>
				<tr className={trClasses}>
					<td>
						<a href='#' id={this.props.position} className="geneExonExpandCollapseButton">+</a>
					</td>
					<td className={colorQcClasses} data-export-label="qc">
					    {geneExonProps.qc}
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
			allGeneExonRows.push(
				<GeneExonParent geneExon={geneExon} position={index+1}/>
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
			</div>
		);
	}
});

module.exports = Report;