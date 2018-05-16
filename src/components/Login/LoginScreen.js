import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Actions} from 'react-native-router-flux';
import {
	Alert,
	Keyboard,
	Dimensions,
	Image,
	ScrollView,
	StatusBar,
	StyleSheet,
	Text,
	TextInput,
	View
} from 'react-native';
import user from '../../../config/config.json';
import ActivityIndicator from '../Helper/ActivityIndicator';
import {clearRegisterError, register, registrationFailure} from '../../actions/registrar';
import * as Storage from '../../utils/storage';
import LoginButton from './LoginButton';
import {clearError as clearLoginError} from '../../actions/login';
import {Analytics} from '../../utils/analytics';
import {main} from '../../constants/scenes';
import * as Orientation from '../../utils/orientation';
import {loginScreen} from '../../constants/colors';

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
		backgroundColor: loginScreen.backgroundColor
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
	netidInput: global.android ? {} : {
		borderBottomWidth: 1,
		borderBottomColor: loginScreen.inputUnderline
	},
	passwordInput: global.android ? {} : {
		borderBottomWidth: 1,
		borderBottomColor: loginScreen.inputUnderline
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

const landscapeStyles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'space-between',
		width: '100%',
		backgroundColor: loginScreen.backgroundColor
	},
	tracsImage: {
		width: 120,
		height: 120 * (1378 / 1438),
		marginBottom: 16
	},
	loginPage: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-around',
		backgroundColor: loginScreen.backgroundColor,
		width: '100%'
	},
	loginGreeting: {
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center'
	},
	loginForm: {
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		width: '40%'
	},
	inputText: {
		width: '100%',
		height: 40
	},
	netidInput: global.android ? {} : {
		borderBottomWidth: 1,
		borderBottomColor: loginScreen.inputUnderline
	},
	passwordInput: global.android ? {} : {
		borderBottomWidth: 1,
		borderBottomColor: loginScreen.inputUnderline
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
			storedCreds: {},
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
			StatusBar.setBackgroundColor(loginScreen.backgroundColor);
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
			if (this.props.loggingIn === false && this.props.registering === false) {
				this.setState({
					checkingCredentials: true
				});
				Storage.credentials.get().then(creds => {
					if (creds !== false) {
						this.setState({
							storedCreds: creds
						});
						this.userLogin(creds.username, creds.password);
					}
				}).finally(() => {
					this.setState({
						checkingCredentials: false
					});
				});
			}
		}
	}

	componentDidMount() {
		this.keyboardShowListener = Keyboard.addListener(KEYBOARD_EVENT.HIDE, this.scrollToTop);
		this.keyboardHideListener = Keyboard.addListener(KEYBOARD_EVENT.SHOW, this.scrollToForm);
	}

	componentWillUnmount() {
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

			let currentOrientation = Orientation.getOrientation();
			let selectedStyle = currentOrientation === Orientation.PORTRAIT ? portraitStyles : landscapeStyles;
			let signInText = <Text style={{color: loginScreen.signInText}}>Sign in to your account</Text>;

			return (
				<ScrollView style={{backgroundColor: loginScreen.backgroundColor}}
										ref={ref => this.scrollView = ref}
										contentViewStyle={{height: '100%'}}
										scrollEnabled={true}
										keyboardDismissMode={'none'}
										alwaysBounceVertical={false}
										keyboardShouldPersistTaps={'handled'}>
					<View style={[
						selectedStyle.container,
						{
							height: Dimensions.get('window').height - (global.android ? StatusBar.currentHeight : 0)
						}
					]}>
						<View style={selectedStyle.loginPage}>
							<View style={selectedStyle.loginGreeting}>
								<Image
									source={require('../../../img/tracs.png')}
									style={selectedStyle.tracsImage}
								/>
								<Text style={{color: loginScreen.welcomeText, fontSize: 20}}>Welcome to TRACS</Text>
								{currentOrientation === Orientation.PORTRAIT ? signInText : null}
							</View>
							<View style={selectedStyle.loginForm}>
								{currentOrientation === Orientation.LANDSCAPE ? signInText : null}
								<TextInput
									style={[selectedStyle.inputText, selectedStyle.netidInput]}
									ref={ref => this.netid = ref}
									placeholder="Net ID"
									placeholderTextColor={loginScreen.placeHolderText}
									underlineColorAndroid={this.underlineColor}
									selectionColor={loginScreen.selectionColor}
									autoCapitalize='none'
									autoCorrect={false}
									returnKeyType='next'
									keyboardType={global.android ? 'visible-password' : 'default'}
									value={this.state.netid}
									onChangeText={(text) => this.setState({netid: text})}
									onSubmitEditing={() => {
										this.password.focus()
									}}
								/>
								<TextInput
									style={[selectedStyle.inputText, selectedStyle.passwordInput]}
									ref={ref => this.password = ref}
									underlineColorAndroid={this.underlineColor}
									placeholder="Password"
									placeholderTextColor={loginScreen.placeHolderText}
									selectionColor={loginScreen.selectionColor}
									autoCapitalize='none'
									autoCorrect={false}
									secureTextEntry={true}
									returnKeyType='send'
									value={this.state.password}
									onChangeText={(text) => this.setState({password: text})}
									onSubmitEditing={() => this.userLogin(this.state.netid, this.state.password)}
								/>
								<LoginButton
									onLayout={({nativeEvent: {layout}}) => {
										this.setState({
											loginPosition: {
												x: layout.x,
												y: layout.y
											}
										});
									}}
									onPress={() => {
										this.userLogin(this.state.netid, this.state.password)
									}}/>
							</View>
						</View>
						<View style={selectedStyle.uppsRequiredTextContainer}>
							<Text style={selectedStyle.uppsRequiredText}>
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
		login: (netid, password) => {
			dispatch(register(netid, password)).catch(err => {
				dispatch(registrationFailure(new Error("There was a problem connecting to the network. Please try again."), dispatch, netid, password));
			})
		},
		clearErrors: () => {
			dispatch(clearLoginError());
			dispatch(clearRegisterError());
		}
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);