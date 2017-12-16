/**
 * Copyright 2017 Andrew Thyng
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
import {AppRegistry} from 'react-native';
import React, {Component} from 'react';
import {connect, Provider} from 'react-redux';
import FCM, {FCMEvent} from 'react-native-fcm';
import {ActionConst, Actions, Router, Scene, Stack} from 'react-native-router-flux';
import configureStore from './src/store/configureStore';
import LoginScreen from './src/components/Login/LoginScreen';
import SiteList from './src/components/SiteList/SiteList';
import NotificationView from './src/components/Notifications/NotificationView';
import Settings from './src/components/Settings/Settings';
import * as urls from './config/urls';
import * as scenes from './src/constants/scenes';
import env from './config/env.json';
import NotificationSettings from './src/components/NotificationSettings/NotificationSettings';
import TabIcon from './src/components/TabBar/TabIcon';
import SimpleWebView from './src/components/SimpleWebView/SimpleWebView';
import {getNotifications} from './src/actions/notifications';
import {setCurrentScene} from './src/actions/routes';

const store = configureStore();
const RouterWithRedux = connect()(Router);

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


class App extends Component {
	handleNotification = (notification) => {
		FCM.presentLocalNotification({
			title: `${notification.fcm.title}`,
			body: `${notification.fcm.body}`,
			sound: "default",
			show_in_foreground: true,
			icon: "ic_notification"
		});
	};

	constructor(props) {
		super(props);

		this.Scenes = Actions.create(
			<Scene key="root">
				<Scene key={scenes.login}
							 component={LoginScreen}
							 title="TRACS Mobile Login"
							 initial={true}
							 hideNavBar={true}
							 type={ActionConst.RESET}/>
				<Scene key={scenes.main}
							 type={ActionConst.RESET}
							 hideNavBar
							 tabs={true}
							 swipeEnabled={false}
							 backToInitial
							 lazy={true}
							 showLabel={true}
							 tabBarPosition="bottom">
					<Scene key={scenes.announcements}
								 icon={TabIcons.announcements}
								 tabBarLabel="Announcements"
								 hideNavBar={true}
								 component={NotificationView}
								 onEnter={(props) => {
									 props.renderAnnouncements = true;
									 store.dispatch(setCurrentScene(scenes.announcements));
									 return props;
								 }}
					/>
					<Stack key={scenes.sitesTab}
								 icon={TabIcons.sites}
								 initial
								 tabBarLabel="Courses">
						<Scene key={scenes.sites}
									 hideNavBar={true}
									 component={SiteList}
									 initial
									 onEnter={() => {
										 store.dispatch(setCurrentScene(scenes.sitesTab));
									 }}/>
						<Scene key={scenes.dashboard}
									 title="Dashboard"
									 swipeEnabled={false}
									 component={NotificationView}/>
					</Stack>
					<Stack key={scenes.settingsTab}
								 icon={TabIcons.settings}
								 onEnter={() => {
									 store.dispatch(setCurrentScene(scenes.settingsTab));
								 }}
								 tabBarLabel="Settings">
						<Scene key={scenes.settings}
									 initial
									 title="Settings"
									 component={Settings}/>
						<Scene key={scenes.notificationSettings}
									 back
									 title="Notification Settings"
									 component={NotificationSettings}/>
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
				</Scene>
			</Scene>
		);
	}

	componentDidMount() {
		this.notificationListener = FCM.on(FCMEvent.Notification, (notification) => {
			if (notification.local_notification) {
				//Not used but I don't want to forget the option
			} else if (notification.opened_from_tray) {

			} else {
				console.log(notification);
				this.handleNotification(notification);
				store.dispatch(getNotifications());
			}
		});
	}

	componentWillUnmount() {
		this.notificationListener.remove();
	}

	render() {
		return (
			<Provider store={store}>
				<RouterWithRedux scenes={this.Scenes}/>
			</Provider>
		);
	}
}

AppRegistry.registerComponent('TRACSMobile', () => App);








