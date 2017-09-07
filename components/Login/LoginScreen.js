import React, {Component} from 'react';
import CookieManager from 'react-native-cookies';
import {connect} from 'react-redux';
import {Actions} from 'react-native-router-flux';
import {Button, Keyboard, StyleSheet, Text, TextInput, View} from 'react-native';

import {isLoggedIn, login, logoutUser} from '../../actions/login';

class LoginScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {
			netid: '',
			password: ''
		}
	}

	componentWillUpdate() {
		if (this.props.isLoggedIn === true) {
			Actions.sites();
		}
	}

	componentDidUpdate() {
		if (this.props.isLoggedIn === true) {
			this.userLogout();
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
					onBlur={() => this.userLogin()}
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
		loginHasFailed: state.loginHasFailed,
		loginIsGuestAccount: state.loginIsGuestAccount,
		isLoggedIn: state.auth.isLoggedIn
	}
};

const mapDispatchToProps = (dispatch) => {
	return {
		onLogout: () => dispatch(login('','')),
		onLogin: (netid, password, url) => dispatch(login(netid, password))
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