import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Actions} from 'react-native-router-flux';
import {Button, StyleSheet, Text, TextInput, View} from 'react-native';
import user from '../../../config/config.json';
import location from '../../utils/location';
import ActivityIndicator from '../Helper/ActivityIndicator';
import {login} from '../../actions/login';
import {setCurrentScene} from '../../actions/routes';

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
		let netidTwo = user ? user.netidTwo : '';
		let passwordTwo = user ? user.passwordTwo : '';
		this.state = {
			netid,
			password,
			netidTwo,
			passwordTwo
		};
	}

	userLogin(netid, password) {
		if (!this.props.loggingIn) {
			this.props.login(netid, password)
		}
	}

	componentWillMount() {
		this.props.setScene(Actions.currentScene);
		if (Actions.currentScene === 'login') {
			if (this.props.loggingIn === false) {
				console.log("Attempting login");
				this.props.login();
			}
		}
	}

	componentWillUpdate(nextProps, nextState) {
		if (nextProps.isAuthenticated && Actions.currentScene === 'login') {
			Actions.mainApp();
		}
	}

	render() {
		if (this.props.loggingIn) {
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
					<TextInput
						placeholder="Net ID"
						autoCapitalize='none'
						returnKeyType='next'
						value={this.state.netidTwo}
						onChangeText={(text) => this.setState({netidTwo: text})}
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
						value={this.state.passwordTwo}
						onChangeText={(text) => this.setState({passwordTwo: text})}
						onSubmitEditing={() => {
							this.userLogin();
						}}
					/>
					<Button
						onPress={() => this.userLogin(this.state.netidTwo, this.state.passwordTwo)}
						title="Login"/>
				</View>
			);
		}
	}
}

const mapStateToProps = (state, ownProps) => {
	return {
		isAuthenticated: state.login.isAuthenticated,
		loggingIn: state.login.isLoggingIn,
		credentials: {netid: state.login.netid, password: state.login.password},
		errorMessage: state.login.errorMessage,
		currentScene: state.routes.scene
	}
};

const mapDispatchToProps = (dispatch) => {
	return {
		login: (netid, password) => dispatch(login(netid, password)),
		setScene: (scene) => dispatch(setCurrentScene(scene))
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);