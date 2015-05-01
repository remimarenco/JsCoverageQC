'use strict';

var React = require('react/addons');

require('../../styles/report.css');

var Table = React.createClass({
	render: function(){
		return(
			<table>
				<tr>
					<td>version</td>
					<td>:</td>
					<td id="version"></td>
				</tr>
				<tr></tr>
			</table>
		);
	}
});

var Report = React.createClass({
	render: function(){
		return(
			<div>
				<h2>Coverage QC Report</h2>
				<Table/>
			</div>
		);
	}
});

module.exports = Report;