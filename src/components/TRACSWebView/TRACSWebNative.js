/**
 * Copyright 2018 Andrew Thyng
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
import React, {Component} from 'react';
import {BackHandler, WebView, StyleSheet, requireNativeComponent, View, Text} from 'react-native';
import WebError from './WebError';
import {Actions} from 'react-native-router-flux';
import {Analytics} from '../../utils/analytics';

const TRACSWeb = requireNativeComponent('TRACSWeb', TRACSWebView);
const styles = StyleSheet.create({
	webView: {
		height: '100%',
		width: '100%'
	}
});
export default class TRACSWebView extends Component {
	handleBack = () => {
		if (Actions.currentScene.indexOf('tracs') >= 0) {
			Actions.pop();
		}
		return true;
	};

	static onLeft(props) {
		console.log("LEFT");
	}

	componentWillMount() {
		BackHandler.addEventListener(BackHandler.DEVICE_BACK_EVENT, this.handleBack);
		Analytics().logTracsWebOpen();
		Analytics().setScreen('TRACSWeb', 'TRACSWebView');
	}

	componentWillUnmount() {
		BackHandler.removeEventListener(BackHandler.DEVICE_BACK_EVENT, this.handleBack);
	}

	render() {
		if (global.android) {
			return <TRACSWeb style={styles.webView} {...this.props}/>
		} else {
			return (
				<WebView
					style={styles.webView}
					sendCookies={true}
					source={{
						url: this.props.baseUrl
					}}
					{...this.props}
					renderError={(error) => {
						return (
							<WebError/>
						)
					}}
				/>
			);
		}
	}
}