'use strict';

var React = require('react/addons');

var ExpandCollapseButton = React.createClass({
	getInitialState: function(){
		return{
			showOrHideButton: '+'
		};
	},
	showOrHideButtonCliked: function(e){
		e.preventDefault();
		this.showOrHide();
	},
	render: function(){
		return(
				<a href='#' className="geneExonExpandCollapseButton"
					onClick={this.showOrHideButtonCliked}>
					{this.state.showOrHideButton}
				</a>
		);
	},

	// Functions made for external access
	showOrHide: function(){
		var display = false;
		if(this.state.showOrHideButton === '+')
		{
			display = true;
			this.setState({showOrHideButton: '-'});
		}
		else{
			this.setState({showOrHideButton: '+'});
		}

		this.props.onClickShowOrHideButton(display);
	}
});

module.exports = ExpandCollapseButton;