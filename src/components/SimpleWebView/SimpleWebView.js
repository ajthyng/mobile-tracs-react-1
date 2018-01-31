import React, {Component} from 'react';
import {Platform, WebView, BackHandler} from 'react-native';
import {WKWebView} from 'react-native-wkwebview-reborn';
import {Actions} from 'react-native-router-flux';

const WEBVIEW_REF = "WEBVIEW_REF";

class SimpleWebView extends Component {
	constructor(props) {
		super(props);
		this.state = {
			canGoBack: false
		};


	}

	componentWillMount() {
		BackHandler.addEventListener('hardwareBackPress', this.handleBack);
	}

	componentWillUnmount() {
		BackHandler.removeEventListener('hardwareBackPress', this.handleBack);
	}

	handleBack = () => {
		if (this.state.canGoBack) {
			this.refs[WEBVIEW_REF].goBack();
		} else {
			Actions.pop();
		}
		return true;
	};

	onNavigationStateChange(navState) {
		this.setState({
			canGoBack: navState.canGoBack
		})
	};

	render() {
		let webView;
		if (Platform.OS === 'android') {
			webView = (
				<WebView
					ref={WEBVIEW_REF}
					source={{uri: this.props.url}}
					onNavigationStateChange={this.onNavigationStateChange.bind(this)}
				/>
			);
		} else {
			webView = <WKWebView source={{uri: this.props.url}}/>;
		}
		return webView;
	}
}

export default SimpleWebView;