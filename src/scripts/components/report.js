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
					<br/>variant TSV file line count (including header):
					<br/>number of annoted variants displayed below:
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

var InformationTable = React.createClass({
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
						{this.props.runDate}
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

var Report = React.createClass({
	render: function(){
		var filteredAnnotatedVariantCount;
		if(this.props.vcf && this.props.vcf.getFilteredAnnotatedVariantCount) {
			filteredAnnotatedVariantCount = this.props.vcf.getFilteredAnnotatedVariantCount();
		}
		return(
			<div>
				<Blocker/>
				<h2>Coverage QC Report</h2>
				<InformationTable version={this.props.vcf.version}
					runDate={this.props.vcf.runDate}
					fileName={this.props.vcf.fileName}
					variantTsvFileName={this.props.vcf.variantTsvFileName}
					variantTsvFileLineCount={this.props.vcf.variantTsvFileLineCount}
					// TODO: Add the function to process filtered
					filteredAnnotatedVariantCount={this.filteredAnnotatedVariantCount}
					exonBedFileName={this.props.vcf.exonBedFileName}
					ampliconBedFileName={this.props.vcf.ampliconBedFileName}
					doNotCallFileName={this.props.doNotCallFileName}
					/>
			</div>
		);
	}
});

module.exports = Report;