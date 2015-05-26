'use strict';

var React = require('react/addons');

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

var Report = React.createClass({
	getInitialState: function(){
		return{
			showBlocker: false,
			variantChecked: {}
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
	},

	onCheckedVariant: function(variant, key){
		debugger;
		
		var new_VariantChecked_State;
		// Check if it is an add or a a deletion
		if(this.state.variantChecked[key] !== null &&
			typeof this.state.variantChecked[key] !== 'undefined'){
			console.log("On UNset "+variant.gene+" de clé "+key);
			new_VariantChecked_State = React.addons.update(this.state.variantChecked, {
				[key]: {
					$set: null
				}
			});
		}
		else{
			console.log("On set "+variant.gene+" de clé "+key);
			// Used to change immutable data : https://facebook.github.io/react/docs/update.html
			var objVariantChecked_ToAdd = {
				[key]: {
					$set: variant
				}
			};
			new_VariantChecked_State = React.addons.update(this.state.variantChecked, objVariantChecked_ToAdd);
			console.log("Etat du new_VariantChecked_State before: "+ new_VariantChecked_State[key]);
		}

		this.setState(new_VariantChecked_State, function(){
			console.log("Ok for the new Variant gene checked: "+this.state.variantChecked[key]+ ", avec le variant:"+variant.gene);
		});
	}
});

module.exports = Report;