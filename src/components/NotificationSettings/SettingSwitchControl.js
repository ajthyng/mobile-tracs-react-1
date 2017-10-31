import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native';
import SettingSwitch from './SettingSwitch';

class SettingSwitchControl extends Component {
	constructor(props) {
		super(props);
		this.state = {
			switchIsOn: true
		};
	}

	toggleSwitch = (value) => {
		this.props.onChange(value, this);
	};

	getStyle() {
		borderColor = "#000000";
		borderWidth = StyleSheet.hairlineWidth;
		return StyleSheet.create({
			container: {
				borderTopWidth: this.props.topItem === true ? borderWidth : 0,
				borderBottomWidth: borderWidth,
				borderTopColor: borderColor,
				borderBottomColor: borderColor
			},
			switch: {
				flex: 1,
				flexDirection: 'column'
			}
		})
	}

	render() {
		return (
			<View style={this.getStyle().container}>
				<SettingSwitch toggleSwitch={this.toggleSwitch}
											 label={this.props.title}
											 switchValue={this.state.switchIsOn}/>
			</View>
		);
	}
}

export default SettingSwitchControl;