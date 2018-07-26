import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Alert, Keyboard, Dimensions, StatusBar} from 'react-native'
import user from '../../../config/config.json'
import ActivityIndicator from '../../_components/Helper/ActivityIndicator'
import {clearRegisterError, register, registrationFailure} from '../../actions/registrar'
import {credentials} from '../../utils/storage'
import {clearError as clearLoginError} from '../../actions/login'
import {Analytics} from '../../utils/analytics'
import {loginScreen} from '../../constants/colors'
import Login from './Login'

const KEYBOARD_EVENT = {
  SHOW: global.android ? 'keyboardDidShow' : 'keyboardWillShow',
  HIDE: global.android ? 'keyboardDidHide' : 'keyboardWillHide'
}

const displayAlert = (regErr, loginErr) => {
  let regErrorMessage = regErr && regErr.message || ''
  let loginErrorMessage = loginErr && loginErr.message || ''
  if (regErrorMessage.length > 0) {
    Alert.alert('Login Error', `${regErrorMessage}`)
  } else {
    Alert.alert(`Login Error`, `${loginErrorMessage}`)
  }
}

class LoginScreen extends Component {
  constructor(props) {
    super(props)
    let netid = user ? user.netid : ''
    let password = user ? user.password : ''
    this.state = {
      netid,
      password,
      storedCreds: {},
      checkingCredentials: true,
      view: null,
      loginPosition: {
        x: 0,
        y: 0
      }
    }

    StatusBar.setBarStyle('dark-content')

    if (global.android) {
      StatusBar.setBackgroundColor(loginScreen.backgroundColor)
    }

    Analytics().setScreen('Login', 'LoginScreen')
  }

  checkForStoredCredentials = () => {
    const {loggingIn, registering} = this.props
    if (!loggingIn && !registering) {
      this.setState({
        checkingCredentials: true
      })
      credentials.get().then(creds => {
        if (creds !== false) {
          this.setState({
            storedCreds: creds
          })
          this.userLogin(creds.username, creds.password)
        }
      }).finally(() => {
        this.setState({
          checkingCredentials: false
        })
      })
    }
  }

  userLogin = (netid, password) => {
    const {loggingIn, login} = this.props
    if (!loggingIn) {
      login(netid, password)
    }
  }

  scrollTo = (y) => {
    this.scrollView && this.scrollView.scrollTo({y, animated: true})
  }

  onChangeText = (value) => {
    this.setState({...value})
  }

  onSubmitEditing = () => {
    this.userLogin(this.state.netid, this.state.password)
  }

  onLayout = ({nativeEvent: {layout}}) => {
    this.setState({
      loginPosition: {
        x: layout.x,
        y: layout.y
      }
    })
  }

  onPress = () => {
    const {netid, password} = this.state
    this.userLogin(netid, password)
  }

  hasErrors = () => {
    const {loginError, registerError} = this.props
    const hasLoginError = !!(loginError || {}).message
    const hasRegisterError = !!(registerError || {}).message

    return hasLoginError || hasRegisterError
  }

  componentDidMount() {
    this.keyboardShowListener = Keyboard.addListener(KEYBOARD_EVENT.HIDE, () => this.scrollTo(0))
    this.keyboardHideListener = Keyboard.addListener(KEYBOARD_EVENT.SHOW, () => this.scrollTo(this.state.loginPosition.y))
    this.checkForStoredCredentials()
  }

  componentWillUnmount() {
    this.keyboardShowListener.remove()
    this.keyboardHideListener.remove()
  }

  componentDidUpdate() {
    const {clearErrors, isAuthenticated, navigation: {navigate}} = this.props

    if (this.hasErrors()) {
      clearErrors()
    }

    isAuthenticated && navigate('Main')
  }

  render() {
    const {loggingIn, registering, isAuthenticated} = this.props
    const {checkingCredentials, netid, password} = this.state
    const actionInProgress = loggingIn || registering || checkingCredentials || isAuthenticated

    if (actionInProgress) {
      return <ActivityIndicator />
    } else {
      if (this.hasErrors()) {
        const {registerError, loginError} = this.props
        displayAlert(registerError, loginError)
      }
      return (
        <Login
          getRef={c => this.scrollView = c}
          netid={netid}
          password={password}
          onChangeText={this.onChangeText}
          onSubmitEditing={this.onSubmitEditing}
          onLayout={this.onLayout}
          onPress={this.onPress}
        />
      )
    }
  }
}

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.login.isAuthenticated,
    loggingIn: state.login.isLoggingIn,
    registering: state.registrar.isRegistering,
    credentials: {netid: state.login.netid, password: state.login.password},
    loginError: state.login.errorMessage,
    registerError: state.registrar.errorMessage,
    currentScene: state.routes.scene,
    deviceToken: state.registrar.deviceToken
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    login: (netid, password) => {
      dispatch(register(netid, password)).catch(err => {
        dispatch(registrationFailure(new Error("There was a problem connecting to the network. Please try again."), dispatch, netid, password))
      })
    },
    clearErrors: () => {
      dispatch(clearLoginError())
      dispatch(clearRegisterError())
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen)