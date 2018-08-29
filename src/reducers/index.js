/**
 * Copyright 2017 Andrew Thyng
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import {combineReducers} from 'redux'
import {loginReducer} from './login'
import {registerReducer} from './registrar'
import {sitesReducer} from './sites'
import {settingsReducer} from './settings'
import {notificationsReducer} from './notifications'
import {authActions as auth} from '../constants/actions'
import {announcementsReducer} from './announcements'
import {themeReducer} from './theme'
import {gradesReducer} from './grades'
import {forumReducer} from './forums'
import {calendarReducer} from './calendar'

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

const rootReducer = (state, action) => {
  if (action.type === auth.REQUEST_LOGOUT) {
    state = undefined
  }
  return appReducer(state, action)
}

export default rootReducer
