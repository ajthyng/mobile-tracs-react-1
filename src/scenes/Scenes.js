import LoginScreen from '../components/Login/LoginScreen'
import HomeScreen from '../components/Home/HomeScreen'
import Header from '../components/Header/Header'

import React from 'react'
import { Easing, Platform, Animated } from 'react-native'

import { createSwitchNavigator, createStackNavigator } from 'react-navigation'
import { cardFromRight, cardFromBottom, cardFromLeft, cardFromTop, defaultTransition } from './Transitions'
import CourseDetailScreen from '../components/CourseDetailScreen/CourseDetailScreen'
import SettingsScreen from '../components/Settings/SettingsScreen'
import TRACSWebView from '../components/TRACSWebView/TRACSWebNative'
import SimpleWebView from '../components/SimpleWebView/SimpleWebView'
import AnnouncementsScreen from '../components/AnnouncementScreen/AnnouncementsScreen'
import ForumScreen from '../components/ForumScreen/ForumScreen'
import GradebookScreen from '../components/GradebookScreen/GradebookScreen'

const transitionSpec = {
  duration: Platform.select({ android: 500, ios: 500 }),
  timing: Animated.timing,
  easing: Easing.out(Easing.poly(4)),
  useNativeDriver: true
}

const MainNavigator = createStackNavigator(
  {
    Home: {
      screen: HomeScreen
    },
    Gradebook: {
      screen: GradebookScreen
    },
    CourseDetail: {
      screen: CourseDetailScreen
    },
    Settings: {
      screen: SettingsScreen
    },
    Announcements: {
      screen: AnnouncementsScreen
    },
    Forums: {
      screen: ForumScreen
    },
    Feedback: {
      screen: () => <SimpleWebView url={`${global.urls.feedback}`} />
    },
    Support: {
      screen: () => <SimpleWebView url={`${global.urls.support}`} />
    },
    TRACSWeb: {
      screen: TRACSWebView
    }
  }, {
    initialRouteName: 'Home',
    navigationOptions: {
      header: ({ navigation }) => (<Header navigation={navigation} />),
      gesturesEnabled: true,
      headerBackTitleVisible: true
    },
    headerMode: 'float',
    headerTransitionPreset: 'uikit',
    transitionConfig: () => ({
      transitionSpec,
      screenInterpolator: (sceneProps) => {
        const { scene } = sceneProps
        const params = scene.route.params || {}
        const transition = params.transition || 'default'
        return {
          cardFromRight: cardFromRight(sceneProps),
          cardFromLeft: cardFromLeft(sceneProps),
          cardFromTop: cardFromTop(sceneProps),
          cardFromBottom: cardFromBottom(sceneProps),
          default: defaultTransition(sceneProps)
        }[transition]
      }
    })
  }
)

const AuthenticationNavigator = (props) => {
  const Nav = createSwitchNavigator({
    Login: LoginScreen,
    Main: MainNavigator
  }, {
    initialRouteName: 'Login',
    navigationOptions: { header: null },
    resetOnBlur: false
  }
  )
  return <Nav {...props} />
}

module.exports = {
  Scenes: (props) => <AuthenticationNavigator {...props} />
}
