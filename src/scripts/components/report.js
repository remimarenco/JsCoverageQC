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

var Report = React.createClass({
	render: function(){
		var filteredAnnotatedVariantCount;
		if(this.props.vcf && this.props.vcf.getFilteredAnnotatedVariantCount) {
			filteredAnnotatedVariantCount = this.props.vcf.getFilteredAnnotatedVariantCount();
		}

		var pass;
		var warn = {warn1: '', warn2: ''};
		var fail = {fail1: '', fail2: ''};
		if(this.props.vcf && this.props.vcf.geneExons){
			pass = this.props.vcf.geneExons.one().bins[3].name;
			warn.warn1 = this.props.vcf.geneExons.one().bins[1].name;
			warn.warn2 = this.props.vcf.geneExons.one().bins[2].name;
			fail.fail1 = this.props.vcf.geneExons.one().bins[0].name;
			fail.fail2 = this.props.vcf.geneExons.one().bins[1].name;
		}
		return(
			<div>
				<Blocker/>
				<h2>Coverage QC Report</h2>
				<InformationsTable version={this.props.vcf.version}
					runDate={this.props.vcf.runDate}
					fileName={this.props.vcf.fileName}
					variantTsvFileName={this.props.vcf.variantTsvFileName}
					variantTsvFileLineCount={this.props.vcf.variantTsvFileLineCount}
					filteredAnnotatedVariantCount={filteredAnnotatedVariantCount}
					exonBedFileName={this.props.vcf.exonBedFileName}
					ampliconBedFileName={this.props.vcf.ampliconBedFileName}
					doNotCallFileName={this.props.doNotCallFileName}
					/>
				<QcRules pass={pass}
					warn={warn}
					fail={fail}/>
			</div>
		);
	}
});

module.exports = Report;