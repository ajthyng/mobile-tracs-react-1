import React, {Component} from 'react';
import {Platform, View, Text} from 'react-native';
import {connect} from 'react-redux';

class ActivityIndicator extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		if (Platform.OS === 'android') {
			return (
				<View>
					<Text>Hello, Android is loading...</Text>
				</View>
			)
		} else {
			return (
				<View>
					<Text>Hello, iOS is loading...</Text>
				</View>
			)
		}
	}
}

export default ActivityIndicator;