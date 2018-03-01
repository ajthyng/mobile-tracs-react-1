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
import {StyleSheet, Text, ToastAndroid} from 'react-native';
import Ripple from 'react-native-material-ripple';

const styles = StyleSheet.create({
	container: {
		backgroundColor: '#00557e',
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		width: '100%',
		height: 50,
		marginTop: 16
	},
	text: {
		color: '#fff',
		fontSize: 18
	}
});

class LoginButton extends Component {
	defaultOnPress = () => {};

	render() {
		return (
			<Ripple style={styles.container} onPress={this.props.onPress || this.defaultOnPress} {...this.props}>
				<Text style={styles.text}>
					Login
				</Text>
			</Ripple>
		)
	}
}

export default LoginButton;