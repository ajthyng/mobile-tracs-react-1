import React, {Component} from 'react';
import {Platform, WebView} from 'react-native';
import {connect} from 'react-redux';
import WKWebView from 'react-native-wkwebview-reborn';
import {getSiteInfo} from '../../actions/sites';

class SiteList extends Component {
	constructor(props) {
		super(props);
	}

	componentWillMount() {
		if (props.isLoggedIn) {
			props.getMemberships();
		}
	}

	render() {
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
		deviceToken: state.register.deviceToken,
		sites: state.tracsSites.userSites
	}
};

const mapDispatchToProps = (dispatch) => {
	return {
		getMemberships: () => dispatch(getSiteInfo())
	}
};
export default connect(mapStateToProps, mapDispatchToProps)(SiteList);