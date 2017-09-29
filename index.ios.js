import {AppRegistry, Text} from 'react-native';
import React, {Component} from 'react';
import {Provider, connect} from 'react-redux';
import {ActionConst, Actions, Router, Scene} from 'react-native-router-flux';
import configureStore from './src/store/configureStore';
import LoginScreen from './src/components/Login/LoginScreen';
import SiteList from './src/components/SiteList/SiteList';
import TabIcon from './src/components/TabBar/TabIcon';
import Notifications from './src/components/Notifications/Notifications';
import Settings from './src/components/Settings/Settings';
import PushNotification from 'react-native-push-notification';
import {token} from './src/utils/storage';
import * as urls from './config/urls';
import env from './config/env.json';


if (env.debug) {
	global.urls = urls.debug;
} else {
	global.urls = urls.release;
}

const ConnectedRouter = connect()(Router);
const store = configureStore();
const handleNotification = (notification) => {
	console.log("NOTIFICATION: ", notification);
};

const Scenes = Actions.create(
	<Scene key="root">
		<Scene key="login"
					 component={LoginScreen}
					 title="TRACS Mobile Login"
					 initial={true}
					 hideNavBar={true}/>
		<Scene tabs={true}
					 key="mainApp"
					 hideNavBar
					 type={ActionConst.REPLACE}
					 wrap={true}
					 tabBarPosition="bottom">
			<Scene key="announcements"
						 title={<Text>Announcements</Text>}
						 component={Notifications}
						 icon={TabIcon} />
			<Scene key="sites"
						 title={<Text>Sites</Text>}
						 component={SiteList}
						 icon={TabIcon}
						 initial
						 onEnter={(props) => {
							 props.portalUrl = `${global.urls.baseUrl}${global.urls.portal}`
						 }}/>
			<Scene key="settings"
						 title={<Text>Settings</Text>}
						 component={Settings}
						 icon={TabIcon} />
		</Scene>
	</Scene>
);

class App extends Component {
	constructor(props) {
		super(props);
		PushNotification.configure({
			onRegister: function (deviceToken) {
				token.store(deviceToken.token).then(() => {
					console.log("TOKEN: ", deviceToken);
				});
			},
			onNotification: handleNotification,
			permissions: {
				alert: true,
				badge: true,
				sound: true,
			},
			popInitialNotification: true,
			requestPermissions: true,
		});
	}

	render() {
		return (
			<Provider store={store}>
				<ConnectedRouter scenes={Scenes} />
			</Provider>
		);
	}
}

AppRegistry.registerComponent('TRACSMobile', () => App);