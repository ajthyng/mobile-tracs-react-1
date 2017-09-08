import React, {Component} from 'react';
import {Platform, WebView} from 'react-native';
import {connect} from 'react-redux';
import { credentials } from '../../utils/storage';
import WKWebView from 'react-native-wkwebview-reborn';

class SiteList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			netid: ''
		};
	}

	render() {
		let webView;
		let uri = "https://staging.tracs.txstate.edu/portal/pda";
		credentials.get('https://staging.tracs.txstate.edu/').then((data) => {
			console.log(`NetID: ${data.netid}\nPassword: ${data.password}`);
		});
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
		netid: state.netid
	}
};

export default connect(mapStateToProps)(SiteList);