import {AppRegistry, Platform, AppState, SafeAreaView, PushNotificationIOS} from 'react-native'
import React, {Component} from 'react'
import {Provider} from 'react-redux'
import configureStore from './src/store/configureStore'
import * as urls from './config/urls'
import PushNotification from 'react-native-push-notification'
import {credentials} from './src/utils/storage'
import {login} from './src/actions/login'
import {Analytics} from './src/utils/analytics'
import {getNotifications} from './src/actions/notifications'
import {setToken} from './src/actions/registrar'
import ThemedApp from './src/ThemedApp'
import {YellowBox} from 'react-native'

const store = configureStore()

YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', "Received data was not a string", "Warning: Can't call setState (or forceUpdate)", 'You are setting the style', 'Module RCTImageLoader', 'Class RCTCxxModule'])

global.urls = urls
global['ios'] = Platform.OS === 'ios'
global['android'] = Platform.OS === 'android'

class App extends Component {
	constructor(props) {
		super(props)
		global.simulator = this.props.isSimulator
		if (this.props.isFirstRun) {
			credentials.reset()
		}
		this.handleAppStateChange = this.handleAppStateChange.bind(this)
		this.handleNotification = this.handleNotification.bind(this)
		this.analytics = Analytics(store)
		this.analytics.logAppStart()
		this.state = {
			appState: AppState.currentState
		}
		if (global.simulator) {
			store.dispatch(setToken("9561548f635aad3fd3361c3dfe4c345d0aa0d3a32542675563eea05a6212dc95"))
		}
		PushNotification.configure({
			onRegister: ({token, os}) => {
				if (!!token) {
					store.dispatch(setToken(token))
				}
				console.log(`Token: ${token}\nOS: ${os}`)
			},
			permissions: {
				alert: true,
				badge: true,
				sound: true
			},
			onNotification: this.handleNotification,
			requestPermissions: true
		})
	}

	componentDidMount() {
		AppState.addEventListener('change', this.handleAppStateChange)
	}

	handleAppStateChange(nextAppState) {
		if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
			credentials.get().then(creds => {
				if (creds.username && creds.password) {
					store.dispatch(login(creds.username, creds.password))
				}
			})
		}
		this.setState({
			appState: nextAppState
		})
	}

	handleNotification(notification) {
		console.log('IOS Notification: ', notification)
		if (notification.data.remote) {
			PushNotificationIOS.presentLocalNotification({
				alertBody: notification.message,
				isSilent: true,
				foreground: false,
				applicationIconBadgeNumber: notification.badge
			})
		}
		store.dispatch(getNotifications())
	}

	render() {
		return (
			<Provider store={store}>
				<ThemedApp />
			</Provider>
		)
	}
}

AppRegistry.registerComponent('TRACSMobile', () => App)