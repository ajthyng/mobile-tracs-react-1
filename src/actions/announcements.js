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
import {haxios as axios} from '../utils/networking'

const {
  REQUEST_ANNOUNCEMENTS,
  ANNOUNCEMENTS_SUCCESS,
  ANNOUNCEMENTS_FAILURE
} = announcementsActions

const requestAnnouncements = () => ({
  type: REQUEST_ANNOUNCEMENTS
})

const announcementsSuccess = (announcements) => ({
  type: ANNOUNCEMENTS_SUCCESS,
  announcements
})

const announcementsFailure = (error) => ({
  type: ANNOUNCEMENTS_FAILURE,
  error
})

export const getAnnouncements = () => {
  return async (dispatch) => {
    dispatch(requestAnnouncements())

    const url = `${global.urls.baseUrl}${global.urls.allAnnouncements}`

    axios(url).then(res => {
      const data = res.data || {}
      const announcements = data.announcement_collection || []

      dispatch(announcementsSuccess(announcements))
    }).catch(err => {
      dispatch(announcementsFailure(err))
    })
  }
}