import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';

class Spacer extends Component {
	constructor(props) {
		super(props);
	}

	getStyle() {
		return StyleSheet.create({
			spacer: {
				height: this.props.height,
				flexDirection: 'row',
				alignItems: 'center',
				backgroundColor: this.props.color
			},
			label: {
				padding: 5,
				fontSize: this.props.height / 2.25
			}
		});
	}

	render() {
		const label = this.props.label ? this.props.label : "";
		return (
			<View style={this.getStyle().spacer}>
				<Text style={this.getStyle().label}>{label}</Text>
			</View>
		);
	}
}

export default Spacer;