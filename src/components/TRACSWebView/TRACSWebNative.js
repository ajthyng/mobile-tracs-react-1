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
import {requireNativeComponent, BackHandler} from 'react-native';
import {Actions} from 'react-native-router-flux';
const TRACSWeb = requireNativeComponent('TRACSWeb', TRACSWebView);

export default class TRACSWebView extends Component {
	componentWillMount() {
		BackHandler.addEventListener('hardwareBackPress', () => {
			if (Actions.currentScene.indexOf('tracs') >= 0) {
				Actions.pop();
			}
			return true;
		});
	}
	componentWillUnmount() {
		BackHandler.removeEventListener('hardwareBackPress');
	}
	render() {
		return <TRACSWeb style={{height: "100%", width: "100%"}} {...this.props}/>
	}
}