import React, {Component} from 'react';
import {StyleSheet, View, Text} from 'react-native';

const styles = StyleSheet.create({
	container: {
		margin: 10,
		padding: 10,
		backgroundColor: "#fefefe",
	}
});

class Site extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<View style={styles.container}
						elevation={2}
			>
				<Text>{this.props.siteData.name}</Text>
				<Text>{this.props.siteData.id}</Text>
				<Text>{this.props.siteData.contactInfo.name}</Text>
				<Text>{this.props.siteData.contactInfo.email}</Text>
			</View>
		);
	}
}

export default Site;