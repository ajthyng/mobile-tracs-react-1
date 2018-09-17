import React, {Component} from 'react'
import {BackHandler, Dimensions, WebView, Platform, StyleSheet, requireNativeComponent} from 'react-native'
import WebError from './WebError'
import {Analytics} from '../../utils/analytics'
import {withNavigation} from 'react-navigation'
import ActivityIndicator from '../ActivityIndicator'

const TRACSWeb = requireNativeComponent('TRACSWeb', TRACSWebView)
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
  }

  handleBack = () => {
  }

  componentDidMount () {
    BackHandler.addEventListener(BackHandler.DEVICE_BACK_EVENT, this.handleBack)
    Analytics().logTracsWebOpen()
    Analytics().setScreen('TRACSWeb', 'TRACSWebView')
  }

  componentWillUnmount () {
    BackHandler.removeEventListener(BackHandler.DEVICE_BACK_EVENT, this.handleBack)
  }

  render () {
    const {baseUrl, portal} = global.urls
    const {getParam} = this.props.navigation

    const url = getParam('baseUrl', `${baseUrl}${portal}`)
    let removeHeaderJS = 'document.getElementById("loginLinks").style.display = "none";'
    if (Dimensions.get('screen').width <= 800) {}

    return Platform.select({
      ios: <WebView
        ref={c => this.webview = c}
        style={styles.webView}
        injectedJavaScript={removeHeaderJS}
        source={{url}}
        {...this.props}
        renderError={() => {
          return (
            <WebError refresh={this.webview.reload} />
          )
        }}
        onNavigationStateChange={({canGoBack}) => {
          this.setState(() => {
            return {canGoBack}
          })
        }}
      />,
      android: (
        <TRACSWeb
          {...this.props}
          ref={c => this.webview = c}
          style={styles.webView}
          baseUrl={url}
          injectedJavaScript={removeHeaderJS}
          renderLoading={ActivityIndicator}
        />
      )
    })
  }
}

export default withNavigation(TRACSWebView)
