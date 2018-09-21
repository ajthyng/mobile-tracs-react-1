import React, { Component } from 'react'
import { WebView, BackHandler } from 'react-native'

const WEBVIEW_REF = 'WEBVIEW_REF'

class SimpleWebView extends Component {
  constructor (props) {
    super(props)
    this.state = {
      canGoBack: false
    }
  }

  componentDidMount () {
    BackHandler.addEventListener('hardwareBackPress', this.handleBack)
  }

  componentWillUnmount () {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBack)
  }

  handleBack = () => {
    if (this.state.canGoBack) {
      this.refs[WEBVIEW_REF].goBack()
    } else {
      this.props.navigation.pop()
    }
    return true
  };

  onNavigationStateChange = (navState) => {
    this.setState({
      canGoBack: navState.canGoBack
    })
  };

  render () {
    const { url: uri } = this.props
    return (
      <WebView
        ref={WEBVIEW_REF}
        source={{ uri }}
        onNavigationStateChange={this.onNavigationStateChange}
      />
    )
  }
}

export default SimpleWebView
