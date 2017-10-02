import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Actions} from 'react-native-router-flux';
import {Button, Keyboard, StyleSheet, Text, TextInput, View} from 'react-native';
import CookieManager from 'react-native-cookies';

import * as Storage from '../../utils/storage';
import {register} from '../../actions/registrar';
import {logout} from '../../actions/login';
import user from '../../../config/config.json';

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

	componentDidUpdate() {
		this.checkLoginStatus();
	}

	checkLoginStatus() {
		if (this.props.isLoggedIn === true && this.props.loggingIn === false) {

			Actions.mainApp();
		} else if (this.props.loggingIn === false) {
			this.userLogout();
			CookieManager.clearAll();
		}
	}

	userLogin() {
		console.log(this.props);
		if (this.props.isRegistering === false) {
			this.props.onLogin(this.state.netid, this.state.password);
		}
		Keyboard.dismiss();
	}

	userLogout() {
		this.props.onLogout();
	}

	render() {
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
					onPress={() => this.userLogin()}
					title="Login"/>
			</View>

		);
	}
}

const mapStateToProps = (state, ownProps) => {
	return {
		loginHasFailed: state.login.loginHasFailed,
		loginIsGuestAccount: state.login.loginIsGuestAccount,
		isLoggedIn: state.login.isLoggedIn,
		loggedInAs: state.login.netid,
		loggingIn: state.login.loggingIn,
		isRegistering: state.register.isRegistering,
		routes: state.routes
	}
};

const mapDispatchToProps = (dispatch) => {
	return {
		onLogout: () => dispatch(logout()),
		onLogin: (netid, password) => dispatch(register(netid, password)),
	}
};


export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);