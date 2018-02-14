import React, {Component} from 'react';
import {Switch, Text, View, StyleSheet, ToastAndroid} from 'react-native';
import {connect} from 'react-redux';

const styles = StyleSheet.create({
	container: {
		backgroundColor: '#FFF',
		alignItems: 'center',
		justifyContent: 'space-between',
		padding: 8,
		flexDirection: 'row',
	},
	label: {
		fontSize: 18
	},
	switch: {
		alignSelf: 'flex-end'
	}
});

class SettingSwitch extends Component {
	constructor(props) {
		super(props);
	}



	render() {
		return (
			<View style={styles.container}>
				<Text style={styles.label}>{this.props.label}</Text>
				<Switch
					style={styles.switch}
					onValueChange={this.props.toggleSwitch}
					value={this.props.switchValue}
					disabled={this.props.pending}
				/>
			</View>
		)
	}
}

const mapStateToProps = (state) => {
	return {
		pending: state.settings.isSaving,
		success: state.settings.isSaved
	}
};

export default connect(mapStateToProps, null)(SettingSwitch);