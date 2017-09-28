import React, {Component} from 'react';
import {Platform, WebView} from 'react-native';
import {connect} from 'react-redux';
import WKWebView from 'react-native-wkwebview-reborn';
import {getSiteInfo} from '../../actions/sites';


class SiteList extends Component {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
		this.props.getMemberships();
	}

	render() {
		let webView;
		if (Platform.OS === 'ios') {
			webView = <WKWebView sendCookies={true}
													 source={ {uri: this.props.portalUrl} } />;
		} else {
			webView = <WebView source={ {uri: this.props.portalUrl} } />;
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