'use strict';

var React = require('react/addons');

var VariantTSV = React.createClass({
	render: function(){
		var renderVariantTsv;
		if(this.props.variantTsvFileName){
			renderVariantTsv = <span id="tsvOk" className="fontWeightNormal">
					<br/>variant TSV file line count (including header): {this.props.variantTsvFileLineCount}
					<br/>number of annoted variants displayed below: {this.props.filteredAnnotatedVariantCount}
				</span>;
		}
		else{
			renderVariantTsv = <span id="tsvNOk" className="fontWeightNormal">
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
				<tbody>
					<tr className="alignTop">
						<td>version</td>
						<td>:</td>
						<td id="version" className="fontWeightBold">
							{this.props.version}
						</td>
					</tr>
					<tr className="alignTop">
						<td>report run date</td>
						<td>:</td>
						<td id="runDate" className="fontWeightBold">
							{this.props.runDate ? this.props.runDate.toDateString() : ''}
						</td>
					</tr>
					<tr className="alignTop">
						<td>gVCF file</td>
						<td>:</td>
						<td id="fileName" className="fontWeightBold">
							{this.props.fileName}
						</td>
					</tr>
					<tr>
						<td>variant TSV file</td>
						<td>:</td>
						<td className="fontWeightBold">
							<VariantTSV variantTsvFileName={this.props.variantTsvFileName}
								variantTsvFileLineCount={this.props.variantTsvFileLineCount}
								filteredAnnotatedVariantCount={this.props.filteredAnnotatedVariantCount}/>
						</td>
					</tr>
					<tr>
						<td>exon BED file</td>
						<td>:</td>
						<td id="exonBedFileName" className="fontWeightBold">
							{this.props.exonBedFileName}
						</td>
					</tr>
					<tr>
						<td>amplicon BED file</td>
						<td>:</td>
						<td id="ampliconBedFileName" className="fontWeightBold">
							{this.props.ampliconBedFileName}
						</td>
					</tr>
					<tr>
						<td>Do NOT Call file</td>
						<td>:</td>
						<td id="doNotCallFileName" className="fontWeightBold">
							{this.props.doNotCallFileName}
						</td>
					</tr>
				</tbody>
			</table>
		);
	}
});

module.exports = InformationsTable;