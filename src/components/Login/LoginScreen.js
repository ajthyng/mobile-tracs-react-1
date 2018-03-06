import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Actions} from 'react-native-router-flux';
import {Alert, Keyboard, Dimensions, Image, ScrollView, StatusBar, StyleSheet, Text, TextInput, View} from 'react-native';
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

const KEYBOARD_EVENT = {
	SHOW: global.android ? 'keyboardDidShow' : 'keyboardWillShow',
	HIDE: global.android ? 'keyboardDidHide' : 'keyboardWillHide'
};

const portraitStyles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'space-between',
		width: '100%',
		height: Dimensions.get('window').height - (global.android ? StatusBar.currentHeight : 0),
		backgroundColor: '#fff'
	},
	tracsImage: {
		width: 80,
		height: 80 * (1378 / 1438),
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
		margin: 10,
		width: '100%',
		bottom: 0,
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
			view: null,
			loginPosition: {
				x: 0,
				y: 0
			}
		};
		this.underlineColor = '#000';
		this.uppsRequiredText = `Use of computer and network facilities owned or operated by Texas State University requires prior authorization. Unauthorized access is prohibited. Usage may be subject to security testing and monitoring, and affords no privacy guarantees or expectations except as otherwise provided by applicable privacy laws. Abuse is subject to criminal prosecution. Use of these facilities implies agreement to comply with the policies of Texas State University.`;

		if (global.android) {
			StatusBar.setBackgroundColor('#fff');
		}
		StatusBar.setBarStyle('dark-content');

		this.handleNetIDInput = this.handleNetIDInput.bind(this);
		this.handlePasswordInput = this.handlePasswordInput.bind(this);
		this.userLogin = this.userLogin.bind(this);
		this.scrollToTop = this.scrollToTop.bind(this);
		this.scrollToForm = this.scrollToForm.bind(this);
		Analytics().setScreen('Login', 'LoginScreen');
	}

	userLogin(netid, password) {
		if (!this.props.loggingIn) {
			this.props.login(netid, password);
		}
	}

	scrollToTop() {
		if (this.scrollView) {
			this.scrollView.scrollTo({y: 0, animated: true});
		}
	}

	scrollToForm() {
		if (this.scrollView) {
			this.scrollView.scrollTo({y: this.state.loginPosition.y, animated: true});
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
						this.userLogin(creds.username, creds.password);
					}
					this.setState({
						checkingCredentials: false
					});
				}).catch(() => {
					this.setState({
						checkingCredentials: false
					});
				});
			}
		}
		Orientation.lockToPortrait();
	}

	componentDidMount() {
		this.keyboardShowListener = Keyboard.addListener(KEYBOARD_EVENT.HIDE, this.scrollToTop);
		this.keyboardHideListener = Keyboard.addListener(KEYBOARD_EVENT.SHOW, this.scrollToForm);
	}

	componentWillUnmount() {
		Orientation.unlockAllOrientations();
		this.keyboardShowListener.remove();
		this.keyboardHideListener.remove();
	}

	handleNetIDInput(text) {
		this.setState({netid: text});
	}

	handlePasswordInput(text) {
		this.setState({password: text});
	}

	componentWillUpdate(nextProps) {
		if (nextProps.isAuthenticated && Actions.currentScene === 'login') {
			Actions.reset(main);
		}
	}

	componentDidUpdate() {
		if (!!(this.props.loginError || {}).message || !!(this.props.registerError || {}).message) {
			this.props.clearErrors();
		}
	}



	render() {
		if (this.props.loggingIn || this.props.registering || this.state.checkingCredentials) {
			return (
				<ActivityIndicator/>
			);
		} else {
			if (!!(this.props.loginError || {}).message || !!(this.props.registerError || {}).message) {
				let errorMessage = this.props.registerError.message;
				if ((errorMessage || "").length <= 0) errorMessage = this.props.loginError.message;
				Alert.alert(`Login Error`, `${errorMessage}`);
			}

			return (
				<ScrollView style={{backgroundColor: '#fff'}}
										ref={ref => this.scrollView = ref}
										contentViewStyle={{height: '100%'}}
										scrollEnabled={true}
										keyboardDismissMode={'none'}
										alwaysBounceVertical={false}
										keyboardShouldPersistTaps={'handled'}>
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
									autoCorrect={false}
									returnKeyType='next'
									keyboardType={global.android ? 'visible-password' : 'default'}
									value={this.state.netid}
									onChangeText={(text) => this.setState({netid: text})}
									onSubmitEditing={() => {this.password.focus()}}
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
									onSubmitEditing={() => this.userLogin(this.state.netid, this.state.password)}
								/>
								<LoginButton
									onLayout={({nativeEvent}) => {
										this.setState({
											loginPosition: {
												x: nativeEvent.layout.x,
												y: nativeEvent.layout.y
											}
										});
									}}
									onPress={() => this.userLogin(this.state.netid, this.state.password)}/>
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

const mapStateToProps = (state) => {
	return {
		isAuthenticated: state.login.isAuthenticated,
		loggingIn: state.login.isLoggingIn,
		registering: state.registrar.isRegistering,
		credentials: {netid: state.login.netid, password: state.login.password},
		loginError: state.login.errorMessage,
		registerError: state.registrar.errorMessage,
		currentScene: state.routes.scene,
		deviceToken: state.registrar.deviceToken
	}
};

const mapDispatchToProps = (dispatch) => {
	return {
		login: (netid, password) => dispatch(register(netid, password)),
		clearErrors: () => {
			dispatch(clearLoginError());
			dispatch(clearRegisterError());
		}
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);