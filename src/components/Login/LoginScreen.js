import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Actions} from 'react-native-router-flux';
import {Button, Keyboard, StyleSheet, Text, TextInput, View} from 'react-native';

import {register} from '../../actions/registrar';
import {netidLogout} from '../../actions/login';
import user from '../../../config/config.json';

class LoginScreen extends Component {
	constructor(props) {
		super(props);
		let netid = user ? user.netid : '';
		let password = user ? user.password : '';
		this.state = {
			netid,
			password
		}
	}

	componentDidUpdate() {
		if (this.props.isLoggedIn === true) {
			Actions.sites();
		}
	}

	userLogin() {
		this.props.onLogin(this.state.netid, this.state.password);
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
		loggedInAs: state.login.netid
	}
};

const mapDispatchToProps = (dispatch) => {
	return {
		onLogout: () => dispatch(netidLogout()),
		onLogin: (netid, password) => dispatch(register(netid, password)),
	}
};

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

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);