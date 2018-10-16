import React, { Component } from 'react'
import { Animated, Easing } from 'react-native'
import { connect } from 'react-redux'
import { withTheme } from 'styled-components'
import { Menu, MenuTrigger, MenuOptions, MenuOption } from 'react-native-popup-menu'
import Profile from '../Header/Profile'
import ProfileMenuOption from './ProfileMenuOption'
import { logout } from '../../actions/login'
import * as Storage from '../../utils/storage'

class CustomMenuRenderer extends Component {
  constructor (props) {
    super(props)
    this.state = {
      slide: new Animated.Value(0)
    }
  }

  componentDidMount () {
    this.openAnimation = Animated.timing(this.state.slide, {
      duration: 200,
      toValue: 1,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true
    }).start()
  }

  close () {
    return new Promise(resolve => {
      Animated.timing(this.state.slide, {
        duration: 200,
        toValue: 0,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true
      }).start(resolve)
    })
  }

  componentWillUnmount () {
    this.openAnimation && this.openAnimation.cancel()
  }

  render () {
    const { style, children, layouts, ...other } = this.props
    const width = layouts.windowLayout.width * 0.65
    const layout = { top: 0, right: 0, height: '100%', position: 'absolute', width }
    const animation = {
      transform: [{
        translateX: this.state.slide.interpolate({
          inputRange: [0, 1],
          outputRange: [width, 0]
        })
      }]
    }

    return (
      <Animated.View
        {...other}
        style={[style, layout, animation]}
      >
        {children}
      </Animated.View>
    )
  }
}

class ProfileMenu extends Component {
  constructor (props) {
    super(props)
    this.state = {
      open: false
    }
  }

  onTriggerPress = () => {
    this.setState({ open: !this.state.open })
  }

  onSelect = val => {
    if (val.toLowerCase() === 'logout') {
      this.props.logout && this.props.logout()
    } else {
      this.props.navigation && this.props.navigation.navigate(val, { transition: 'cardFromRight' })
    }
  }

  render () {
    const { theme } = this.props

    return (
      <Menu
        renderer={CustomMenuRenderer}
        onSelect={this.onSelect}>
        <MenuTrigger>
          <Profile
            accessible
            accessibilityLabel={'settings menu'}
          />
        </MenuTrigger>
        <MenuOptions customStyles={optionStyles(this.props)} >
          <Profile
            diameter={50}
            shouldDisplayName
            accessible={false}
            style={{
              container: { flexDirection: 'column', alignItems: 'center', justifyContent: 'center' },
              text: { color: theme.darkText, fontSize: 22, fontWeight: 'bold' }
            }}
          />
          <MenuOption value='Settings' customStyles={{ optionWrapper: optionStyles(this.props).topOption }}>
            <ProfileMenuOption label='Settings' icon='cog' size={22} />
          </MenuOption>
          <MenuOption value='Feedback'>
            <ProfileMenuOption label='Feedback' icon='comments-o' size={22} />
          </MenuOption>
          <MenuOption value='Support'>
            <ProfileMenuOption label='Support' icon='question-circle-o' size={22} />
          </MenuOption>
          <MenuOption value='Logout'>
            <ProfileMenuOption label='Logout' icon='logout' size={22} iconFamily='SimpleLineIcons' />
          </MenuOption>
        </MenuOptions>
      </Menu>
    )
  }
}

const optionStyles = (props) => ({
  optionsContainer: {
    marginTop: 0,
    paddingTop: 40,
    paddingLeft: 0,
    paddingRight: 0,
    paddingBottom: 0,
    backgroundColor: props.theme.viewBackground
  },
  topOption: {
    marginTop: 30
  },
  optionText: {
    color: props.theme.viewBackground
  }
})

const mapDispatchToProps = (dispatch, props) => ({
  logout: async () => {
    const cleared = await Storage.credentials.reset()
    if (cleared) {
      dispatch(logout())
      props.navigation.navigate('Login')
    }
  }
})

export default connect(null, mapDispatchToProps)(withTheme(ProfileMenu))
