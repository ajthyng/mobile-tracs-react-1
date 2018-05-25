import React, {Component} from 'react';
import {Platform, View, StyleSheet, Text} from 'react-native';

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		width: '100%'
	}
});

class HiddenCourses extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<View style={styles.container}>
				<Text>

				</Text>
			</View>
		);
	}
}

export default HiddenCourses;