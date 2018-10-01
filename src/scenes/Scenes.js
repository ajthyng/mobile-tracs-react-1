import LoginScreen from '../components/Login/LoginScreen'
import HomeScreen from '../components/Home/HomeScreen'
import Header from '../components/Header/Header'
import React from 'react'
import { Easing, Platform, Animated } from 'react-native'

import { createSwitchNavigator, NavigationActions, createStackNavigator, createBottomTabNavigator } from 'react-navigation'
import { cardFromRight, cardFromBottom, cardFromLeft, cardFromTop, defaultTransition } from './Transitions'
import CourseDetailScreen from '../components/CourseDetailScreen/CourseDetailScreen'
import SettingsScreen from '../components/Settings/SettingsScreen'
import TRACSWebView from '../components/TRACSWebView/TRACSWebNative'
import SimpleWebView from '../components/SimpleWebView/SimpleWebView'
import AnnouncementsScreen from '../components/AnnouncementScreen/AnnouncementsScreen'
import ForumScreen from '../components/ForumScreen/ForumScreen'
import GradebookScreen from '../components/GradebookScreen/GradebookScreen'
import TabIcon from './TabIcon'
import TabLabel from './TabLabel'

const transitionSpec = {
  duration: Platform.select({ android: 500, ios: 500 }),
  timing: Animated.timing,
  easing: Easing.out(Easing.poly(4)),
  useNativeDriver: true
}

const goToAttendance = (navigation) => {
  const course = navigation.getParam('course', null)

  if (course === null) return

  const siteId = course.id
  const pageId = (course.tools['sakai.attendance'] || {}).pageId
  const mainSite = `${global.urls.baseUrl}${global.urls.portal}`
  const url = `${global.urls.baseUrl}${global.urls.webUrl}/${siteId}/page/${pageId}`

  const openAttendance = NavigationActions.navigate({
    routeName: 'Attendance',
    transition: 'cardFromRight',
    params: {
      baseUrl: pageId ? url : mainSite,
      transition: 'cardFromRight'
    }
  })

  navigation && navigation.dispatch(openAttendance)
}

const goToResources = (navigation) => {
  const course = navigation.getParam('course', null)

  if (course === null) return

  const siteId = course.id
  const pageId = (course.tools['sakai.resources'] || {}).pageId
  const mainSite = `${global.urls.baseUrl}${global.urls.portal}`
  const url = `${global.urls.baseUrl}${global.urls.webUrl}/${siteId}/page/${pageId}`

  const openResources = NavigationActions.navigate({
    routeName: 'Resources',
    transition: 'cardFromRight',
    params: {
      baseUrl: pageId ? url : mainSite,
      transition: 'cardFromRight'
    }
  })

  navigation && navigation.dispatch(openResources)
}

const namedTabIcon = (name) => props => <TabIcon iconName={name} {...props} />

const CourseDetailTab = createBottomTabNavigator({
  Forums: {
    screen: ForumScreen,
    navigationOptions: {
      tabBarIcon: namedTabIcon('comments'),
      tabBarLabel: props => <TabLabel {...props} />
    }
  },
  Announcements: {
    screen: AnnouncementsScreen,
    navigationOptions: {
      tabBarIcon: namedTabIcon('bullhorn'),
      tabBarLabel: props => <TabLabel {...props} />
    }
  },
  Course: {
    screen: CourseDetailScreen,
    navigationOptions: {
      tabBarIcon: namedTabIcon('book'),
      tabBarLabel: props => <TabLabel {...props} />
    }
  },
  Attendance: {
    screen: TRACSWebView,
    navigationOptions: {
      tabBarIcon: namedTabIcon('check-square'),
      tabBarOnPress: ({ navigation }) => {
        goToAttendance(navigation)
      },
      tabBarLabel: props => <TabLabel {...props} />
    }
  },
  Resources: {
    screen: TRACSWebView,
    navigationOptions: {
      tabBarIcon: namedTabIcon('folder-open'),
      tabBarOnPress: ({ navigation }) => {
        goToResources(navigation)
      },
      tabBarLabel: props => <TabLabel {...props} />
    }
  }
}, {
  initialRouteName: 'Course',
  tabBarOptions: {
    activeTintColor: '#3A6B86',
    inactiveTintColor: '#3A6B86',
    style: {
      minHeight: 55
    }
  }
})

const MainNavigator = createStackNavigator(
  {
    Home: {
      screen: HomeScreen
    },
    Gradebook: {
      screen: GradebookScreen
    },
    CourseDetailTab: {
      screen: CourseDetailTab
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
