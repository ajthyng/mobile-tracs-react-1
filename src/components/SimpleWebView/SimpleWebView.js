import React, {Component} from 'react';
import {Platform, WebView} from 'react-native';
import {WKWebView} from 'react-native-wkwebview-reborn'

class SimpleWebView extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		let webView;
		if (Platform.OS === 'android') {
			webView = (
					<WebView source={{uri: this.props.url}}/>
			);
		} else {
			webView = (
					<WKWebView source={{uri: this.props.url}}/>
			);
		}
		return webView;
	}
}

export default SimpleWebView;