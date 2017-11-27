import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native';
import SettingSwitch from './SettingSwitch';
import {connect} from 'react-redux';

class SettingSwitchControl extends Component {
	constructor(props) {
		super(props);
		this.state = {
			switchIsOn: props.enabled
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

const mapStateToProps = (state, ownProps) => {
	return {
		token: state.registrar.deviceToken
	}
};

export default connect(mapStateToProps, null)(SettingSwitchControl);