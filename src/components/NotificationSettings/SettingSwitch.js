import React from 'react';
import {Switch, Text, View, StyleSheet} from 'react-native';

export default SettingSwitch = (props) => {
	const styles = StyleSheet.create({
		container: {
			backgroundColor: '#FFF',
			alignItems: 'center',
			justifyContent: 'space-between',
			padding: 8,
			flexDirection: 'row',
		},
		label: {

		},
		switch: {
			alignSelf: 'flex-end'
		}
	});
	return (
		<View style={styles.container}>
			<Text style={styles.label}>{props.label}</Text>
			<Switch
				style={styles.switch}
				onValueChange={props.toggleSwitch}
				value={props.switchValue}/>
		</View>
	)
}