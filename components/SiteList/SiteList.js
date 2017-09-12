import React, {Component} from 'react';
import {Platform, WebView} from 'react-native';
import {connect} from 'react-redux';
import WKWebView from 'react-native-wkwebview-reborn';
import {credentials} from '../../utils/storage';

class SiteList extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		credentials.get()
			.then( data => console.log(data) );
		let webView;
		let uri = "https://staging.tracs.txstate.edu/portal/pda";
		if (Platform.OS === 'ios') {
			webView = <WKWebView sendCookies={true}
													 source={ {uri: uri} } />;
		} else {
			webView = <WebView source={ {uri: uri} } />;
		}
		return (
			webView
		);
	}
}

const mapStateToProps = (state, ownProps) => {
	return {
		netid: state.register.registeredUser,
		isLoggedIn: state.login.isLoggedIn,
		deviceToken: state.register.deviceToken
	}
};

export default connect(mapStateToProps)(SiteList);