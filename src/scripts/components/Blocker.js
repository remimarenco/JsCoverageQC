'use strict';

var React = require('react/addons');

var Blocker = React.createClass({
	render: function(){
		var blocker;
		var displayStyle;
		if(this.props.displayMe){
			displayStyle = {
				display: 'block'
			};
		}
		return(
			<div id="blocker" style={displayStyle}>
				<div>wait...</div>
			</div>
		);
	}
});

module.exports = Blocker;