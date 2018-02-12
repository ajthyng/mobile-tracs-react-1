import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Actions} from 'react-native-router-flux';
import {Alert, Dimensions, Image, ScrollView, StatusBar, StyleSheet, Text, TextInput, View} from 'react-native';
import user from '../../../config/config.json';
import ActivityIndicator from '../Helper/ActivityIndicator';
import {register} from '../../actions/registrar';
import {setCurrentScene} from '../../actions/routes';
import * as Storage from '../../utils/storage';
import LoginButton from './LoginButton';
import {clearError as clearLoginError} from '../../actions/login';
import Orientation from 'react-native-orientation';

const portraitStyles = StyleSheet.create({
	container: {
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'space-between',
		width: '100%',
		height: Dimensions.get('window').height - StatusBar.currentHeight,
		backgroundColor: '#fff'
	},
	tracsImage: {
		width: 80,
		height: 80,
		marginBottom: 16
	},
	loginPage: {
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		paddingTop: '30%',
		width: '100%'
	},
	loginGreeting: {
		flexDirection: 'column',
		alignItems: 'center',
		marginBottom: 50
	},
	loginForm: {
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		width: '65%'
	},
	inputText: {
		width: '100%',
		height: 40
	},
	uppsRequiredTextContainer: {
		margin: 10
	},
	uppsRequiredText: {
		textAlign: 'center',
		fontSize: 10
	}
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
			passwordTwo,
			view: null
		};
		this.underlineColor = '#000';
		this.uppsRequiredText = `Use of computer and network facilities owned or operated by Texas State University requires prior authorization. Unauthorized access is prohibited. Usage may be subject to security testing and monitoring, and affords no privacy guarantees or expectations except as otherwise provided by applicable privacy laws. Abuse is subject to criminal prosecution. Use of these facilities implies agreement to comply with the policies of Texas State University.`;
		StatusBar.setBackgroundColor('#fff');
		StatusBar.setBarStyle('dark-content');
		this.handleNetIDInput = this.handleNetIDInput.bind(this);
		this.handlePasswordInput = this.handlePasswordInput.bind(this);
		this.userLogin = this.userLogin.bind(this);
	}

	userLogin() {
		if (!this.props.loggingIn) {
			this.props.login(this.state.netid, this.state.password)
		}
	}

	componentWillMount() {
		if (Actions.currentScene === 'login') {
			if (this.props.loggingIn === false && this.props.registering === false) {
				Storage.credentials.get().then(creds => {
					if (creds !== false) {
						this.props.login(creds.username, creds.password);
					}
				});
			}
		}
		Orientation.lockToPortrait();
		Storage.clear();
	}

	handleNetIDInput(text) {
		this.setState({netid: text});
	}

	handlePasswordInput(text) {
		this.setState({password: text});
	}

	componentWillUpdate(nextProps, nextState) {
		if (nextProps.isAuthenticated && Actions.currentScene === 'login') {
			Actions.mainApp();
		}
	}

	componentDidUpdate() {
		if (this.props.loginError) {
			if ((this.props.loginError.message || "").length > 0) {
				this.props.clearLoginError();
			}
		}
	}

	componentWillUnmount() {
		Orientation.unlockAllOrientations();
	}

	render() {
		if (this.props.loggingIn || this.props.registering) {
			return (
				<ActivityIndicator/>
			);
		} else {
			if (this.props.loginError) {
				if ((this.props.loginError.message || "").length > 0) {
					console.log("Error message is ", this.props.loginError.message);
					Alert.alert(`Login Error`, `${this.props.loginError.message}`);
				}
			}
			return (
					<ScrollView ref={(ref) => this.scrollView = ref}>
						<View style={portraitStyles.container}>
							<View style={portraitStyles.loginPage}>
								<View style={portraitStyles.loginGreeting}>
									<Image
										source={require('../../../img/tracs.png')}
										style={portraitStyles.tracsImage}
									/>
									<Text style={{color: '#00557e', fontSize: 20}}>Welcome to TRACS</Text>
									<Text style={{color: '#959595'}}>Sign in to your account</Text>
								</View>
								<View style={portraitStyles.loginForm}>
									<TextInput
										style={portraitStyles.inputText}
										ref={ref => this.netid = ref}
										placeholder="Net ID"
										underlineColorAndroid={this.underlineColor}
										selectionColor='#909090'
										autoCapitalize='none'
										returnKeyType='next'
										value={this.state.netid}
										onChangeText={(text) => this.setState({netid: text})}
										onSubmitEditing={() => {
											this.password.focus();
										}}
									/>
									<TextInput
										style={portraitStyles.inputText}
										ref={ref => this.password = ref}
										underlineColorAndroid={this.underlineColor}
										placeholder="Password"
										selectionColor='#909090'
										autoCapitalize='none'
										autoCorrect={false}
										secureTextEntry={true}
										returnKeyType='send'
										value={this.state.password}
										onChangeText={(text) => this.setState({password: text})}
										onSubmitEditing={this.userLogin}
									/>
									<LoginButton
										onPress={this.userLogin}/>
								</View>
							</View>
							<View style={portraitStyles.uppsRequiredTextContainer}>
								<Text style={portraitStyles.uppsRequiredText}>
									{this.uppsRequiredText}
								</Text>
							</View>
						</View>
					</ScrollView>
			);
		}
	}
}

const mapStateToProps = (state, ownProps) => {
	return {
		isAuthenticated: state.login.isAuthenticated,
		loggingIn: state.login.isLoggingIn,
		registering: state.registrar.isRegistering,
		credentials: {netid: state.login.netid, password: state.login.password},
		loginError: state.login.errorMessage,
		registerError: state.registrar.errorMessage,
		currentScene: state.routes.scene
	}
};

const mapDispatchToProps = (dispatch) => {
	return {
		login: (netid, password) => dispatch(register(netid, password)),
		setScene: (scene) => dispatch(setCurrentScene(scene)),
		clearLoginError: () => dispatch(clearLoginError())
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);