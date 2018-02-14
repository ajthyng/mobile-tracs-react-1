import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native';
import SettingSwitch from '../NotificationSettings/SettingSwitch';

const styles = StyleSheet.create({
	container: {
		borderBottomWidth: StyleSheet.hairlineWidth,
		borderColor: "#767676"
	}
});

class SectionHeader extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isOn: props.isOn
		}
	}

	componentWillUpdate(nextProps) {
		if (nextProps.isOn !== this.state.isOn) {
			this.setState({
				isOn: nextProps.isOn
			});
		}
	}

	toggleSwitch = (value) => {
		this.setState({
			isOn: value
		});
		this.props.onToggle(value);
	};

	render() {
		return (
			<View style={styles.container}>
				<SettingSwitch label={this.props.title}
											 toggleSwitch={this.toggleSwitch}
											 switchValue={this.state.isOn} />
			</View>
		);
	}
}

export default SectionHeader;