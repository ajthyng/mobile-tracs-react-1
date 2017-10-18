import React, {Component} from 'react';
import {Platform, View, Text, StyleSheet} from 'react-native';
import {connect} from 'react-redux';



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
		if (Platform.OS === 'android') {
			return (
				<View style={ActivityIndicator.getStyle().container}>
					<Text>Hello, Android is loading...</Text>
				</View>
			)
		} else {
			return (
				<View style={ActivityIndicator.getStyle().container}>
					<Text>Hello, iOS is loading...</Text>
				</View>
			)
		}
	}
}

export default ActivityIndicator;