import { AppRegistry, Text, Platform, AppState, YellowBox, PushNotificationIOS } from 'react-native'
import React, { Component } from 'react'
import { PersistGate } from 'redux-persist/integration/react'
import { Provider } from 'react-redux'
import configureStore from './src/store/configureStore'
import * as urls from './config/urls'
import PushNotification from 'react-native-push-notification'
import { credentials } from './src/utils/storage'
import { login } from './src/actions/login'
import { Analytics } from './src/utils/analytics'
import { getNotifications } from './src/actions/notifications'
import { setToken } from './src/actions/registrar'
import ThemedApp from './src/ThemedApp'
import Subject from './src/utils/subject'
import crashlytics from 'react-native-fabric-crashlytics'

crashlytics.init()
const { store, persistor } = configureStore()

YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Received data was not a string', "Warning: Can't call setState (or forceUpdate)", 'You are setting the style', 'Module RCTImageLoader', 'Class RCTCxxModule', 'startLoadWithResult', 'Did not receive response to shouldStartLoad'])

global.urls = urls
global['ios'] = Platform.OS === 'ios'
global['android'] = Platform.OS === 'android'

const textFixStyle = {
  style: {
    fontFamily: 'Roboto'
  }
}

const setCustomText = customProps => {
  const TextRender = Text.render
  const initialDefaultProps = Text.defaultProps
  Text.defaultProps = {
    ...initialDefaultProps,
    ...customProps
  }
  Text.render = function render (props) {
    let oldProps = props
    props = { ...props, style: [customProps.style, props.style] }
    try {
      return TextRender.apply(this, arguments)
    } finally {
      props = oldProps
    }
  }
}

setCustomText(textFixStyle)

class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      appState: AppState.currentState,
      firstRun: this.props.firstRun
    }
    global.simulator = this.props.isSimulator

    if (this.state.firstRun) {
      credentials.reset()
    }

    this.analytics = Analytics(store)
    this.analytics.logAppStart()

    if (global.simulator) {
      store.dispatch(setToken('9561548f635aad3fd3361c3dfe4c345d0aa0d3a32542675563eea05a6212dc95'))
    }

    PushNotification.configure({
      onRegister: ({ token, os }) => {
        if (token) {
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

  componentDidMount () {
    AppState.addEventListener('change', this.handleAppStateChange)
  }

  componentWillUnmount () {
    AppState.removeEventListener('change', this.handleAppStateChange)
  }

  handleAppStateChange = (nextAppState) => {
    if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
      credentials.get().then(creds => {
        if (creds.username && creds.password) {
          store.dispatch(login(creds.username, creds.password))
        }
      })
      Subject.fire('notification')
    }
    this.setState({
      appState: nextAppState
    })
  }

  handleNotification = (notification) => {
    if (notification.data.remote) {
      PushNotificationIOS.presentLocalNotification({
        alertBody: notification.message,
        isSilent: true,
        foreground: false,
        applicationIconBadgeNumber: notification.badge
      })
    }
    Subject.fire('notification')
  }

  render () {
    return (
      <Provider store={store}>
        <PersistGate persistor={persistor} loading={null}>
          <ThemedApp />
        </PersistGate>
      </Provider>
    )
  }
}

AppRegistry.registerComponent('TRACSMobile', () => App)
