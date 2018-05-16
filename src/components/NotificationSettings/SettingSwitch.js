import React, {Component} from 'react';
import {Switch, Text, View, StyleSheet} from 'react-native';
import {connect} from 'react-redux';

const styles = StyleSheet.create({
	container: {
		backgroundColor: '#FFF',
		alignItems: 'center',
		padding: 8,
		flexDirection: 'row',
	},
	label: {
		flex: 1,
		fontSize: 18
	}
});

class SettingSwitch extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<View style={styles.container}>
				<Text
					style={styles.label}
					numberOfLines={1}
					ellipsizeMode="tail"
				>
					{this.props.label}
				</Text>
				<Switch
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