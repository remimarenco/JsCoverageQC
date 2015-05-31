'use strict';

var React = require('react/addons');

var Blocker = React.createClass({
	render: function(){
		var displayStyle = {
			display: 'block'
		};
		return(
			<div id="blocker" style={displayStyle}>
				<div>Please wait...</div>
			</div>
		);
	}
});

module.exports = Blocker;