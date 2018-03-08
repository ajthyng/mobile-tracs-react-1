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
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {Actions} from 'react-native-router-flux';

const styles = StyleSheet.create({
	container: {
		width: '100%',
		height: 64,
		alignContent: 'center',
		justifyContent: 'center',
		backgroundColor: "#501214"
	},
	leftIcon: {
		color: 'white',
		fontSize: 34,
		position: 'absolute',
		left: 2,
		top: 12,
		paddingLeft: 8,
		flexDirection: 'row'
	},
	leftIconContainer: {
		backgroundColor: 'transparent',
		position: 'absolute',
		height: 50,
		width: 70,
		top: 12,
		left: 0
	},
	titleContainer: {
		backgroundColor: 'transparent',
		height: 50,
		top: 16,
		width: '100%',
		position: 'absolute',
		alignItems: 'center',
		justifyContent: 'center'
	},
	titleText: {
		fontSize: 17,
		fontWeight: '600',
		color: 'white'
	}
});

class NavBar extends Component {
	constructor(props) {
		super(props);
		console.log(props);
	}

	onBack() {
		console.log("Back");
		Actions.pop();
	}

	render() {
		return (
			<View style={styles.container}>
				<View style={styles.titleContainer}>
					<Text style={styles.titleText}>{this.props.title || ""}</Text>
				</View>
				<TouchableOpacity style={styles.leftIconContainer} onPress={this.onBack.bind(this)}>
					<Icon name="ios-arrow-back"
								style={styles.leftIcon}
					/>
				</TouchableOpacity>
			</View>
		)
	}
}

export default NavBar;