import React, {Component} from 'react';
import {Image, Platform, StyleSheet, Text, View} from 'react-native';

class ActivityIndicator extends Component {
	constructor(props) {
		super(props);
		this.getStyle = this.getStyle.bind(this);
	}

	getStyle() {
		return StyleSheet.create({
			container: {
				flex: 1,
				flexDirection: 'row',
				alignItems: 'center',
				justifyContent: 'center'
			},
			image: {
				width: 60,
				height: 60
			}
		});
	}

	render() {
		return (
			<View style={this.getStyle().container}>
				<Image source={require('../../../img/tracs.png')}
							 style={this.getStyle().image} />
			</View>
		)
	}
}

export default ActivityIndicator;