import React, {Component} from 'react';
import {WebView, BackHandler} from 'react-native';

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
			this.props.navigation.pop()
		}
		return true;
	};

	onNavigationStateChange(navState) {
		this.setState({
			canGoBack: navState.canGoBack
		})
	};

	render() {
		return (
			<WebView
				ref={WEBVIEW_REF}
				source={{uri: this.props.url}}
				onNavigationStateChange={this.onNavigationStateChange.bind(this)}
			/>
		);
	}
}

export default SimpleWebView;