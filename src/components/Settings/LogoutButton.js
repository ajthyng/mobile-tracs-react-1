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
import {View, Text, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import Ripple from 'react-native-material-ripple';

class LogoutButton extends Component {
	constructor(props) {
		super(props);
		this.styles = StyleSheet.create({
			container: {
				flexDirection: 'row',
				alignItems: 'center',
				justifyContent: 'center',
				backgroundColor: props.backgroundColor || "transparent",
				width: 100,
				height: 40
			},
			logoutText: {
				fontSize: props.fontSize || 16,
				color: props.color || "#501214"
			},
			logoutIcon: {
				fontSize: props.fontSize || 16,
				transform: [{
					rotate: '180deg'
				}],
				marginLeft: 8,
				color: props.color || "#501214"
			}
		});
		this.logoutText = props.text || "Logout"
	}

	render() {
		return (
			<Ripple style={this.styles.container} onPress={this.props.onPress || (() => {})}>
				<Text style={this.styles.logoutText}>{this.logoutText}</Text>
				<Icon name={this.props.name} style={this.styles.logoutIcon}/>
			</Ripple>
		);
	}
}

export default LogoutButton;