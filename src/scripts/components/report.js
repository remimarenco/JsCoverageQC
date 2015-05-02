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
		return(
			<span>
				<span id="tsvOk">
					<br/>variant TSV file line count (including header):
					<br/>number of annoted variants displayed below:
				</span>
				<span id="tsvNOk">
					<span>*** NO VARIANT TSV FILE IDENTIFIED ***</span>
					<span>
					    <br/>This report was likely created in error.
					</span>
				</span>
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
					<td id="runDate"></td>
				</tr>
				<tr>
					<td>gVCF file</td>
					<td>:</td>
					<td id="fileName"></td>
				</tr>
				<tr>
					<td>variant TSV file</td>
					<td>:</td>
					<td>
						<VariantTSV/>
					</td>
				</tr>
				<tr>
					<td>exon BED file</td>
					<td>:</td>
					<td id="exonBedFileName">
					</td>
				</tr>
				<tr>
					<td>amplicon BED file</td>
					<td>:</td>
					<td id="ampliconBedFileName"></td>
				</tr>
				<tr>
					<td>Do NOT Call file</td>
					<td>:</td>
					<td id="doNotCallFileName"></td>
				</tr>
			</table>
		);
	}
});

var Report = React.createClass({
	render: function(){
		return(
			<div>
				<Blocker/>
				<h2>Coverage QC Report</h2>
				<InformationTable version={this.props.vcf.version}/>
			</div>
		);
	}
});

module.exports = Report;