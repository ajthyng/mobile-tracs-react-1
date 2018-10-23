/**
 * Copyright 2017 Andrew Thyng
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
import { AppRegistry, AppState, YellowBox, Text, Platform, PermissionsAndroid } from 'react-native'
import React, { Component } from 'react'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import FCM, { FCMEvent } from 'react-native-fcm'
import configureStore from './src/store/configureStore'
import * as urls from './config/urls'
import Subject from './src/utils/subject'
import { credentials } from './src/utils/storage'
import { Analytics } from './src/utils/analytics'
import { login } from './src/actions/login'
import ThemedApp from './src/ThemedApp'
import crashlytics from 'react-native-fabric-crashlytics'

crashlytics.init()

YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'You are setting the style', 'Module RCTImageLoader'])

const { store, persistor } = configureStore()

global.urls = urls
global.ios = Platform.OS === 'ios'
global.android = Platform.OS === 'android'

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
    this.analytics = Analytics(store)
    this.analytics.logAppStart()
    FCM.getFCMToken().then(token => console.log(`${token}`))

    this.state = {
      appState: AppState.currentState
    }

    this.handleAppStateChange = this.handleAppStateChange.bind(this)
    this.requestStoragePermission = this.requestStoragePermission.bind(this)
    this.requestStoragePermission()
  }

  handleNotification = (notification) => {
    if (notification.local_notification) {
      console.log('local notification')
    } else if (notification.opened_from_tray) {
      console.log('from tray')
    } else {
      FCM.presentLocalNotification({
        title: `${notification.fcm.title}`,
        body: `${notification.fcm.body}`,
        priority: 'high',
        sound: 'default',
        show_in_foreground: true,
        icon: 'ic_notification'
      })
      Subject.fire('notification')
    }
  }

  handleAppStateChange (nextAppState) {
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

  componentDidMount () {
    FCM.on(FCMEvent.Notification, this.handleNotification)
    AppState.addEventListener('change', this.handleAppStateChange)
  }

  componentWillUnmount () {
    AppState.removeEventListener('change', this.handleAppStateChange)
  }

  async requestStoragePermission () {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          'title': 'TRACS Storage Permission',
          'message': 'TRACS needs permission to store downloads, notifications, and other data on your device; TRACS may not function properly without it.'
        }
      )
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Cache Enabled')
      } else {
        console.log('Cache Disabled')
      }
    } catch (err) {
      console.log('Cache Disabled')
    }
  }

  render () {
    return (
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <ThemedApp />
        </PersistGate>
      </Provider>
    )
  }
}

AppRegistry.registerComponent('TRACSMobile', () => App)
