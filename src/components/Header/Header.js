import React, {Component} from 'react';
import {View, StatusBar, StatusBarIOS, StyleSheet, Text, NativeModules} from 'react-native';

const {StatusBarManager} = NativeModules;
const styles = StyleSheet.create({
	container: {
		height: 65 + 24,
		backgroundColor: '#365ba9'
	}
});

class Header extends Component {
	constructor(props) {
		super(props);
		console.log(props);
		this.state = {
			statusBarHeight: global.android ? StatusBar.currentHeight : 0
		};
	}

	render() {
		return (
			<View style={styles.container}>
				<Text>
				</Text>
			</View>
		);
	}
}

export default Header;