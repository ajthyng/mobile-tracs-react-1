import {AppRegistry, Platform, AppState} from 'react-native';
import React, {Component} from 'react';
import {connect, Provider} from 'react-redux';
import {Router} from 'react-native-router-flux';
import configureStore from './src/store/configureStore';
import * as urls from './config/urls'
import PushNotification from 'react-native-push-notification';
import {credentials} from './src/utils/storage';
import axios from 'axios/index';
import {Analytics} from './src/utils/analytics';
import {token as TokenStore} from './src/utils/storage';
import {getNotifications} from './src/actions/notifications';

const ConnectedRouter = connect()(Router);
const store = configureStore();

global.urls = urls;
global.ios = Platform.OS === 'ios';
global.android = Platform.OS === 'android';

const Scenes = require('./src/scenes/Scenes')(store);

class App extends Component {
	constructor(props) {
		super(props);
		global.simulator = this.props.isSimulator;
		this.handleAppStateChange = this.handleAppStateChange.bind(this);
		this.handleNotification = this.handleNotification.bind(this);
		this.analytics = Analytics(store);
		this.analytics.logAppStart();
		this.state = {
			appState: AppState.currentState
		};
		PushNotification.configure({
			onRegister: ({token, os}) => {
				console.log(`Token: ${token}\nOS: ${os}`);
			},
			permissions: {
				alert: true,
				badge: true,
				sound: true
			},
			onNotification: this.handleNotification,
			requestPermissions: true
		});
	}

	componentDidMount() {
		AppState.addEventListener('change', this.handleAppStateChange);
	}

	handleAppStateChange(nextAppState) {
		if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
			credentials.get().then(creds => {
				if (creds.username && creds.password) {
					let options = {
						method: 'get',
						headers: {'Content-Type': 'application/json'}
					};
					let sessionURL = `${global.urls.baseUrl}${global.urls.session}`;
					axios(sessionURL, options).then(res => {
						if (res.data.hasOwnProperty('userEid') && res.data.userEid !== creds.username) {
							let loginUrl = `${global.urls.baseUrl}${global.urls.login(creds.username, creds.password)}`;
							let loginOptions = {
								method: 'post',
								headers: {'Content-Type': 'application/json'}
							};
							axios(loginUrl, loginOptions)
								.then(res => {
								})
								.catch(err => {
								});
						}
					}).catch(err => {
						console.log(err);
					});
				}
			});
		}
		this.setState({
			appState: nextAppState
		});
	}

	handleNotification(notification) {
		console.log('IOS Notification: ', notification);
		if (notification.data.remote) {
			PushNotification.presentLocalNotification({
				...notification
			});
		}
		store.dispatch(getNotifications());
	}

	render() {
		return (
			<Provider store={store}>
				<ConnectedRouter scenes={Scenes}/>
			</Provider>
		);
	}
}

AppRegistry.registerComponent('TRACSMobile', () => App);