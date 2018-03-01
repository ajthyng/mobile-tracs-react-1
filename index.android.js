/**
 * Copyright 2017 Andrew Thyng
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
import {AppRegistry, AppState, Platform, PermissionsAndroid} from 'react-native';
import React, {Component} from 'react';
import {connect, Provider} from 'react-redux';
import FCM, {FCMEvent} from 'react-native-fcm';
import {Router} from 'react-native-router-flux';
import configureStore from './src/store/configureStore';
import * as urls from './config/urls';
import {getNotifications} from './src/actions/notifications';
import {credentials} from './src/utils/storage';
import axios from 'axios';
import {Analytics} from './src/utils/analytics';

const store = configureStore();
const RouterWithRedux = connect()(Router);

global.urls = urls;
global.ios = Platform.OS === 'ios';
global.android = Platform.OS === 'android';
const Scenes = require('./src/scenes/Scenes')(store);

class App extends Component {
	handleNotification = (notification) => {
		console.log(notification);
		if (notification.local_notification) {
			//Not used but I don't want to forget the option
			console.log("From App: ", notification);
		} else if (notification.opened_from_tray) {

		} else {
			console.log(notification);
			FCM.presentLocalNotification({
				title: `${notification.fcm.title}`,
				body: `${notification.fcm.body}`,
				priority: "high",
				sound: "default",
				show_in_foreground: true,
				icon: "ic_notification"
			});
			store.dispatch(getNotifications());
		}
	};
	handleAppStateChange = (nextAppState) => {
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
							axios(loginUrl, loginOptions).then(res => {

							}).catch(err => {});
						}
					}).catch(err => {});
				}
			});
		}
		this.setState({
			appState: nextAppState
		});
	};

	constructor(props) {
		super(props);
		this.analytics = Analytics(store);
		this.analytics.logAppStart();
		FCM.getFCMToken().then(token => console.log(`${token}`));

		this.state = {
			appState: AppState.currentState
		};

		this.requestStoragePermission = this.requestStoragePermission.bind(this);
		this.requestStoragePermission();
	}

	componentDidMount() {
		FCM.on(FCMEvent.Notification, this.handleNotification);
		AppState.addEventListener('change', this.handleAppStateChange);
	}

	componentWillUnmount() {

		AppState.removeEventListener('change', this.handleAppStateChange);
	}

	async requestStoragePermission() {
		try {
			const granted = await PermissionsAndroid.request(
				PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
				{
					'title': "TRACS Storage Permission",
					'message': "TRACS needs permission to store downloads, notifications, and other data on your device; TRACS may not function properly without it."
				}
			);
			if (granted === PermissionsAndroid.RESULTS.GRANTED) {
				console.log("Cache Enabled");
			} else {
				console.log("Cache Disabled");
			}
		} catch (err) {
			console.log("Cache Disabled");
		}
	}

	render() {
		return (
			<Provider store={store}>
				<RouterWithRedux scenes={Scenes}/>
			</Provider>
		);
	}
}

AppRegistry.registerComponent('TRACSMobile', () => App);








