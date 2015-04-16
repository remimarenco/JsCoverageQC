'use strict';

var React = require('react/addons');
var ReactTransitionGroup = React.addons.TransitionGroup;

// CSS
require('../../styles/normalize.css');
require('../../styles/main.css');

var imageURL = require('../../images/yeoman.png');

var InputFilesForm = React.createClass({
	render: function(){
		return (
			<div id="page-wrapper">
				<h1>JsCoverageQC Report</h1>
				<div>
					Select a vcf file:
					<input type="file" id="vcfFile"/>
				</div>
				<div>
					Select an exon bed file
					<input type="file" id="exonFile"/>
				</div>
				<div>
					Select an amplicon bed file
					<input type="file" id="ampliconFile"/>
				</div>
				<div>
					Select a DoNotCallFile (optional)
					<input type="file" id="doNotCallFile"/>
				</div>
				<div>
					Select a TSV variant file (optional)
					<input type="file" id="variantTsv"/>
				</div>
				<div>
					<input type="submit" id="Process" value="Process"/>
				</div>
				<pre id="fileDisplayArea"></pre>
			</div>
		);
	}
});

var JsCoverageQcApp = React.createClass({
  render: function() {
    return (
      <div className='main'>
        <ReactTransitionGroup transitionName="fade">
          <img src={imageURL} />
        </ReactTransitionGroup>
        <InputFilesForm/>
      </div>
    );
  }
});

module.exports = JsCoverageQcApp;
