import React, {Component} from 'react';
import {connect} from 'react-redux';
import Ripple from 'react-native-material-ripple';
import {View, StyleSheet, Text} from 'react-native';
import {logout} from '../../actions/login';
import {NavigationActions, StackActions} from 'react-navigation';
import * as Storage from '../../utils/storage';

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'space-around',
		width: '100%'
	}
});

const LogoutButtonHOC = Comp => ({newRef, children, ...props}) => (
	<Comp
		style={{
			flexDirection: 'row',
			alignContent: 'center',
			justifyContent: 'center',
			backgroundColor: props.backgroundColor || "#1b3c80",
			width: 150,
			height: 50,
		}}
		ref={newRef}
		{...props}
	>
		<Text style={{
			color: "#fff",
			textAlign: 'center',
			alignSelf: 'center'
		}}>
			{props.text}
		</Text>
	</Comp>
);

const LogoutButton = LogoutButtonHOC(Ripple);

class HomeScreen extends Component {
	constructor(props) {
		super(props);
	}

	componentDidUpdate() {
		if (!this.props.authenticated) {
			this.props.navigation.navigate('Login');
		}
	}

	render() {
		return (
			<View style={styles.container}>
				<Text>
					Home Screen
				</Text>
				<LogoutButton
					onPress={() => this.props.logout()}
					text="Logout"
				/>
			</View>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		authenticated: state.login.isAuthenticated
	}
};

const mapDispatchToProps = (dispatch) => {
	return {
		logout: () => {
			Storage.credentials.reset();
			dispatch(logout())
		}
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);