import { Platform } from 'react-native'
import { combineReducers } from 'redux'
import { loginReducer } from './login'
import { registerReducer } from './registrar'
import { sitesReducer } from './sites'
import { settingsReducer } from './settings'
import { notificationsReducer } from './notifications'
import { authActions as auth } from '../constants/actions'
import { announcementsReducer } from './announcements'
import { themeReducer } from './theme'
import { gradesReducer } from './grades'
import { forumReducer } from './forums'
import { calendarReducer } from './calendar'
const PushNotification = require('react-native-push-notification')

const appReducer = combineReducers({
  login: loginReducer,
  registrar: registerReducer,
  tracsSites: sitesReducer,
  settings: settingsReducer,
  notifications: notificationsReducer,
  theme: themeReducer,
  grades: gradesReducer,
  announcements: announcementsReducer,
  forums: forumReducer,
  calendar: calendarReducer
})

const clearBadgeCount = Platform.select({
  ios: () => { PushNotification.setApplicationIconBadgeNumber(0) },
  android: () => null
})

const rootReducer = (state, action) => {
  if (action.type === auth.REQUEST_LOGOUT) {
    state = undefined
    clearBadgeCount()
  }
  return appReducer(state, action)
}

export default rootReducer
