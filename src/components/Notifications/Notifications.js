import React, {Component} from 'react';
import {Text, View} from 'react-native';
import {connect} from 'react-redux';

class Notifications extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<View>
				<Text>Hello from {this.props.title}</Text>
			</View>
		);
	}
}

const mapStateToProps = (state, ownProps) => {
	return {
		//Object mapping state variables to props variables
		//netid: state.register.registeredUser
	}
};

const mapDispatchToProps = (dispatch) => {
	return {
		//Object mapping action functions to props as functions
		//getMemberships: () => dispatch(getSiteInfo())        
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(Notifications);