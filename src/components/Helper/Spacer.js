import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native';

class Spacer extends Component {
	constructor(props) {
		super(props);
	}

	getStyle() {
		return StyleSheet.create({
				spacer: {
					height: this.props.height,
					backgroundColor: this.props.color
				}
			});
	}

	render() {
		return (
			<View style={this.getStyle().spacer}/>
		);
	}
}

export default Spacer;