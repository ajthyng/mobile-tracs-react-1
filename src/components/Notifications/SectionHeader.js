import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import SettingSwitch from '../NotificationSettings/SettingSwitch';

const styles = StyleSheet.create({
	container: {
		borderBottomWidth: StyleSheet.hairlineWidth,
		borderColor: "#767676"
	},
	title: {

	}
});

class SectionHeader extends Component {
	constructor(props) {
		super(props);
	}

	toggleSwitch = (value) => {
		this.props.onToggle(value);
	};

	render() {
		return (
			<View style={styles.container}>
				<SettingSwitch label={this.props.title}
											 toggleSwitch={this.toggleSwitch}
											 switchValue={this.props.isOn} />
			</View>
		);
	}
}

export default SectionHeader;