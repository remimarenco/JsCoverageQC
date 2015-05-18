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
		if(this.state.showOrHideButton === '+')
		{
			this.setState({showOrHideButton: '-'});
		}
		else{
			this.setState({showOrHideButton: '+'});
		}
		this.props.onClickShowOrHideButton();
	}
});

module.exports = ExpandCollapseButton;