/**
 * Copyright 2018 Andrew Thyng
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import {announcementsActions} from '../constants/actions'

const {
  REQUEST_ANNOUNCEMENTS,
  ANNOUNCEMENTS_SUCCESS,
  ANNOUNCEMENTS_FAILURE
} = announcementsActions

export const initialState = {
  isLoading: false,
  all: [],
  errorMessage: ''
}

const requestAnnouncements = (state) => {
  return {
    ...state,
    isLoading: true,
    errorMessage: ''
  }
}

const announcementsSuccess = (state, action) => {
  return {
    ...state,
    isLoading: false,
    all: action.announcements,
    errorMessage: ''
  }
}

const announcementsFailure = (state, action) => {
  return {
    ...state,
    isLoading: false,
    errorMessage: action.error.message || 'Could not load announcements'
  }
}

export function announcementsReducer(state = initialState, action) {
  switch (action.type) {
    case REQUEST_ANNOUNCEMENTS:
      return requestAnnouncements(state, action)
    case ANNOUNCEMENTS_SUCCESS:
      return announcementsSuccess(state, action)
    case ANNOUNCEMENTS_FAILURE:
      return announcementsFailure(state, action)
    default:
      return state
  }
}