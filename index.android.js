/**
 * Copyright 2017 Andrew Thyng
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
import {AppRegistry, Text} from 'react-native';
import React, {Component} from 'react';
import {connect, Provider} from 'react-redux';
import FCM, {FCMEvent} from 'react-native-fcm';
import {ActionConst, Actions, Router, Scene} from 'react-native-router-flux';
import configureStore from './src/store/configureStore';
import LoginScreen from './src/components/Login/LoginScreen';
import SiteList from './src/components/SiteList/SiteList';
import TabIcon from './src/components/TabBar/TabIcon';
import Notifications from './src/components/Notifications/Notifications';
import Settings from './src/components/Settings/Settings';
import {token} from './src/utils/storage';
import * as urls from './config/urls';
import env from './config/env.json';

class App extends Component {
	constructor(props) {
		super(props);
		console.log("Base URL: ", global.urls.baseUrl);
		FCM.getFCMToken().then((deviceToken) => {
			token.store(deviceToken).then(() => {
				console.log("TOKEN: ", deviceToken);
			});
		});
	}

	componentDidMount() {
		this.notificationListener = FCM.on(FCMEvent.Notification, async (notification) => {
			if (notification.local_notification) {

			}
			if (notification.opened_from_tray) {

			}

			handleNotification(notification);
		});
	}

	componentWillUnmount() {
		this.notificationListener.remove();
	}

	render() {

		return (
			<Provider store={store}>
				<Router scenes={Scenes}/>
			</Provider>
		);
	}
}

const store = configureStore();
const handleNotification = (notification) => {
	console.log("NOTIFICATION: ", notification);
};

if (env.debug) {
	global.urls = urls.debug;
} else {
	global.urls = urls.release;
}

const Scenes = Actions.create(
	<Scene key="root">
		<Scene key="login"
					 component={LoginScreen}
					 title="TRACS Mobile Login"
					 initial={true}
					 hideNavBar={true}
					 type={ActionConst.REPLACE} />
		<Scene tabs={true}
					 key="mainApp"
					 type={ActionConst.REPLACE}
					 showLabel={false}
					 swipe={true}
					 wrap={true}>
			<Scene key="announcements"
						 hideNavBar={true}
						 title={<Text>Announcements</Text>}
						 component={Notifications}
						 icon={TabIcon} />
			<Scene key="sites"
						 title={<Text>Sites</Text>}
						 hideNavBar={true}
						 component={SiteList}
						 initial={true}
						 icon={TabIcon}
						 onEnter={(props) => {
							 props.portalUrl = `${global.urls.baseUrl}${global.urls.portal}`
						 }}/>
			<Scene key="settings"
						 hideNavBar={true}
						 title={<Text>Settings</Text>}
						 component={Settings}
						 icon={TabIcon} />
		</Scene>
	</Scene>
);

AppRegistry.registerComponent('TRACSMobile', () => App);