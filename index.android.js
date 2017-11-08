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
import {ActionConst, Actions, Router, Scene, Stack, Tabs} from 'react-native-router-flux';
import configureStore from './src/store/configureStore';
import LoginScreen from './src/components/Login/LoginScreen';
import SiteList from './src/components/SiteList/SiteList';
import Notifications from './src/components/Notifications/Notifications';
import Settings from './src/components/Settings/Settings';
import {token} from './src/utils/storage';
import * as urls from './config/urls';
import * as scenes from './src/constants/scenes';
import env from './config/env.json';
import NotificationSettings from './src/components/NotificationSettings/NotificationSettings';
import TabIcon from './src/components/TabBar/TabIcon';
import SimpleWebView from './src/components/SimpleWebView/SimpleWebView';
import {updateToken} from './src/actions/registrar';



class App extends Component {
	constructor(props) {
		super(props);
	}

	async componentDidMount() {
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
				<RouterWithRedux scenes={Scenes}/>
			</Provider>
		);
	}
}

const store = configureStore();
const RouterWithRedux = connect()(Router);
const handleNotification = (notification) => {
	console.log("NOTIFICATION: ", notification);
};

if (env.debug) {
	global.urls = urls.debug;
} else {
	global.urls = urls.release;
}

const tabIconSize = 20;
const tabIconColor = "#000";
const TabIcons = {
	announcements: () => {
		return (<TabIcon name="bullhorn" size={tabIconSize} color={tabIconColor}/>);
	},
	sites: () => {
		return (<TabIcon name="list" size={tabIconSize} color={tabIconColor}/>);
	},
	settings: () => {
		return (<TabIcon name="cog" size={tabIconSize} color={tabIconColor}/>);
	}
};

//FCM.getFCMToken().then((deviceToken) => {
//	console.log("TOKEN: ", deviceToken);
//	store.dispatch(updateToken(deviceToken));
//	token.store(deviceToken).then(() => {});
//});

const Scenes = Actions.create(
	<Scene key="root">
		<Scene key={scenes.login}
					 component={LoginScreen}
					 title="TRACS Mobile Login"
					 initial={true}
					 hideNavBar={true}
					 type={ActionConst.RESET}/>
		<Tabs key={scenes.main}
					type={ActionConst.RESET}
					hideNavBar
					swipeEnabled
					backToInitial={true}
					showLabel={true}
					tabBarPosition="bottom">
			<Scene key={scenes.announcements}
						 icon={TabIcons.announcements}
						 tabBarLabel="Announcements"
						 hideNavBar={true}
						 title={<Text>Announcements</Text>}
						 component={Notifications}/>
			<Scene key={scenes.sites}
						 icon={TabIcons.sites}
						 tabBarLabel="Courses"
						 title={<Text>Sites</Text>}
						 hideNavBar={true}
						 component={SiteList}
						 initial={true}
						 onEnter={(props) => {
							 props.portalUrl = `${global.urls.baseUrl}${global.urls.portal}`
						 }}/>
			<Stack key={scenes.settingsTab}
						 icon={TabIcons.settings}
						 tabBarLabel="Settings">
				<Scene key={scenes.settings}
							 initial
							 title="Settings"
							 component={Settings}/>
				<Scene key={scenes.notificationSettings}
							 back
							 title="Notification Settings"
							 component={NotificationSettings}
				/>
				<Scene key={scenes.feedback}
							 back
							 title="Feedback"
							 component={SimpleWebView}
							 url={global.urls.feedback}/>
				<Scene key={scenes.support}
							 back
							 title="TRACS Support"
							 component={SimpleWebView}
							 url={global.urls.support}/>

			</Stack>
		</Tabs>
	</Scene>
);

AppRegistry.registerComponent('TRACSMobile', () => App);








