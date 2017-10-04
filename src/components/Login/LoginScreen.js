import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Actions} from 'react-native-router-flux';
import {Button, Keyboard, StyleSheet, Text, TextInput, View} from 'react-native';
import CookieManager from 'react-native-cookies';

import * as Storage from '../../utils/storage';
import {isRegistering, register} from '../../actions/registrar';
import {loggingIn, logout} from '../../actions/login';
import user from '../../../config/config.json';
import ActivityIndicator from '../Helper/ActivityIndicator';

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'column',
		margin: 32,
	},
	netid: {},
	password: {},
	submit: {}
});

class LoginScreen extends Component {
	constructor(props) {
		super(props);
		let netid = user ? user.netid : '';
		let password = user ? user.password : '';
		this.state = {
			netid,
			password
		};
	}

	componentWillMount() {
		Storage.credentials.get().then(credentials => {
			if (credentials !== false) {
				this.autoLogin(credentials.username, credentials.password);
			} else {
				this.props.onRegistering(false);
				this.props.onLoggingIn(false);
			}
		});
	}

	componentWillUnmount() {
		console.log("Unmounting LoginScreen");
	}


	componentDidUpdate() {
		this.checkLoginStatus();
	}

	checkLoginStatus() {
		if (this.props.isLoggedIn === true) {
			console.log("Loading Main App...");
			Keyboard.dismiss();
			Actions.mainApp();
		} else if (this.props.loginHasFailed === true) {
			this.props.loginHasFailed(false);
			this.userLogout();
			CookieManager.clearAll();
		}
	}

	autoLogin(netid, password) {
		this.baseLogin(netid, password);
	}

	userLogin(netid, password) {
		if (this.props.isRegistering === false) {
			this.baseLogin(netid, password);
		}
	}

	baseLogin(netid, password) {
		this.props.onLogin(netid, password);
		Keyboard.dismiss();
	}

	userLogout() {
		this.props.onLogout();
	}

	render() {
		if (this.props.isRegistering || this.props.loggingIn) {
			return (
				<ActivityIndicator/>
			);
		} else {
			return (
				<View style={styles.container}>
					<Text>Welcome to TRACS Mobile</Text>
					<TextInput
						placeholder="Net ID"
						autoCapitalize='none'
						autoFocus={true}
						returnKeyType='next'
						value={this.state.netid}
						onChangeText={(text) => this.setState({netid: text})}
						onSubmitEditing={() => {
							this.refs.Password.focus();
						}}
					/>
					<TextInput
						ref='Password'
						placeholder="Password"
						autoCapitalize='none'
						autoCorrect={false}
						secureTextEntry={true}
						returnKeyType='send'
						value={this.state.password}
						onChangeText={(text) => this.setState({password: text})}
						onSubmitEditing={() => {
							this.userLogin();
						}}
					/>
					<Button
						onPress={() => this.userLogin(this.state.netid, this.state.password)}
						title="Login"/>
				</View>
			);
		}
	}
}

const mapStateToProps = (state, ownProps) => {
	return {
		loginHasFailed: state.login.hasFailed,
		loginIsGuestAccount: state.login.loginIsGuestAccount,
		isLoggedIn: state.login.isLoggedIn,
		credentials: { netid: state.login.netid, password: state.login.password },
		loggingIn: state.login.loggingIn,
		isRegistering: state.register.isRegistering,
		registrationHasFailed: state.register.hasFailed
	}
};

const mapDispatchToProps = (dispatch) => {
	return {
		onLogout: () => dispatch(logout()),
		onLogin: (netid, password) => dispatch(register(netid, password)),
		onRegistering: (bool) => dispatch(isRegistering(bool)),
		onLoggingIn: (bool) => dispatch(loggingIn(bool))
	}
};


export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);