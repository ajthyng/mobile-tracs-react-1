import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';

class ActivityIndicator extends Component {
	constructor(props) {
		super(props);
	}

	static getStyle() {
		return StyleSheet.create({
			container: {
				flex: 1,
				flexDirection: 'row',
				alignItems: 'center',
				justifyContent: 'center'
			}
		});
	}

	render() {
		return (
			<View style={ActivityIndicator.getStyle().container}>
				<Text>Hello, {Platform.OS} is loading...</Text>
			</View>
		)
	}
}

export default ActivityIndicator;