import React, {Component} from 'react';
import {Platform, View} from 'react-native';
import WKWebView from 'react-native-wkwebview-reborn'
import {connect} from 'react-redux';

class SimpleWebView extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<View>
				Hello, component!
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

export default connect(mapStateToProps, mapDispatchToProps)(SimpleWebView);