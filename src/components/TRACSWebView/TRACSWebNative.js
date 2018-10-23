import React, { Component } from 'react'
import { BackHandler, Dimensions, Linking, WebView, Platform, StyleSheet, requireNativeComponent } from 'react-native'
import WebError from './WebError'
import { Analytics } from '../../utils/analytics'
import { withNavigation } from 'react-navigation'
import ActivityIndicator from '../ActivityIndicator'
import axios from '../../utils/networking'
import Subject from '../../utils/subject'

const styles = StyleSheet.create({
  webView: {
    height: '100%',
    width: '100%'
  }
})

class TRACSWebView extends Component {
  constructor (props) {
    super(props)
    this.state = {
      canGoBack: false
    }
    this.webView = React.createRef()
  }

  handleBack = () => {
    const webView = this.webView.current
    const { canGoBack } = this.state
    return { webView, canGoBack }
  }

  componentDidMount () {
    BackHandler.addEventListener(BackHandler.DEVICE_BACK_EVENT, this.handleBack)
    Subject.subscribe('back', this.handleBack)
    Analytics().logTracsWebOpen()
    Analytics().setScreen('TRACSWeb', 'TRACSWebView')
  }

  componentWillUnmount () {
    Subject.unsubscribe('back', this.handleBack)
    BackHandler.removeEventListener(BackHandler.DEVICE_BACK_EVENT, this.handleBack)
  }

  render () {
    const { baseUrl, portal } = global.urls
    const { getParam } = this.props.navigation

    const url = getParam('baseUrl', `${baseUrl}${portal}`)
    let removeHeaderJS = 'document.getElementById("loginLinks").style.display = "none";'
    if (Dimensions.get('screen').width <= 800) {}

    return Platform.select({
      ios: <WebView
        {...this.props}
        ref={this.webView}
        style={styles.webView}
        injectedJavaScript={removeHeaderJS}
        source={{ url }}
        renderLoading={() => <ActivityIndicator />}
        startInLoadingState
        startLoadWithResult={false}
        renderError={() => <WebError refresh={this.webView?.current?.reload} />}
        onNavigationStateChange={({ canGoBack }) => {
          this.setState(() => {
            return { canGoBack }
          })
        }}
      />,
      android: (
        <TRACSWeb
          {...this.props}
          ref={this.webView}
          style={styles.webView}
          baseUrl={url}
          injectedJavaScript={removeHeaderJS}
        />
      )
    })
  }
}

const TRACSWeb = requireNativeComponent('TRACSWeb', TRACSWebView)

export default withNavigation(TRACSWebView)
