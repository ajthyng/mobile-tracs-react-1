import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Actions} from 'react-native-router-flux';
import {Alert, Dimensions, Image, ScrollView, StatusBar, StyleSheet, Text, TextInput, View} from 'react-native';
import user from '../../../config/config.json';
import ActivityIndicator from '../Helper/ActivityIndicator';
import {clearRegisterError, register} from '../../actions/registrar';
import * as Storage from '../../utils/storage';
import {firstLoad} from '../../utils/storage';
import LoginButton from './LoginButton';
import {clearError as clearLoginError} from '../../actions/login';
import Orientation from 'react-native-orientation';
import {Analytics} from '../../utils/analytics';
import {main} from '../../constants/scenes';

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
		this.state = {
			netid,
			password,
			checkingCredentials: true,
			view: null
		};
		this.underlineColor = '#000';
		this.uppsRequiredText = `Use of computer and network facilities owned or operated by Texas State University requires prior authorization. Unauthorized access is prohibited. Usage may be subject to security testing and monitoring, and affords no privacy guarantees or expectations except as otherwise provided by applicable privacy laws. Abuse is subject to criminal prosecution. Use of these facilities implies agreement to comply with the policies of Texas State University.`;
		StatusBar.setBackgroundColor('#fff');
		StatusBar.setBarStyle('dark-content');
		this.handleNetIDInput = this.handleNetIDInput.bind(this);
		this.handlePasswordInput = this.handlePasswordInput.bind(this);
		this.userLogin = this.userLogin.bind(this);
		Analytics().setScreen('Login', 'LoginScreen');
	}

	userLogin() {
		if (!this.props.loggingIn) {
			this.props.login(this.state.netid, this.state.password)
		}
	}

	componentWillMount() {
		if (Actions.currentScene === 'login') {
			firstLoad.get().then(firstLoad => {
				if (firstLoad) {
					Actions.about();
				}
			});
			if (this.props.loggingIn === false && this.props.registering === false) {
				this.setState({
					checkingCredentials: true
				});
				Storage.credentials.get().then(creds => {
					if (creds !== false) {
						this.props.login(creds.username, creds.password);
					}
					this.setState({
						checkingCredentials: false
					});
				}).catch(err => {
					this.setState({
						checkingCredentials: false
					});
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
			Actions.reset(main);
		}
	}

	componentDidUpdate() {
		if ((this.props.loginError || {}).message) {
			if ((this.props.loginError.message || "").length > 0) {
				this.props.clearLoginError();
			}
		}
		if ((this.props.registerError || {}).message) {
			if ((this.props.registerError.message || "").length > 0) {
				this.props.clearRegisterError();
			}
		}
	}

	componentWillUnmount() {
		Orientation.unlockAllOrientations();
	}

	render() {
		if (this.props.loggingIn || this.props.registering || this.state.checkingCredentials) {
			return (
				<ActivityIndicator/>
			);
		} else {
			if (this.props.registerError || this.props.loginError) {
				if ((this.props.registerError || "").length > 0) {
					Alert.alert(`Login Error`, `${this.props.registerError}`);
				} else if ((this.props.loginError.message || "").length > 0) {
					Alert.alert(`Login Error`, `${this.props.loginError.message}`);
				}
			}

			return (
				<ScrollView style={{backgroundColor: '#fff'}} ref={(ref) => this.scrollView = ref}>
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
									keyboardType={'ascii-capable'}
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
		clearLoginError: () => dispatch(clearLoginError()),
		clearRegisterError: () => dispatch(clearRegisterError())
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);