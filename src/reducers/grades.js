/**
 * Copyright 2018 Andrew Thyng
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import { gradesActions } from '../constants/actions'

const {
  REQUEST_GRADES,
  GRADES_SUCCESS,
  GRADES_FAILURE
} = gradesActions

export const initialState = {
  isLoading: false,
  grades: [],
  errorMessage: ''
}

const requestGrades = (state) => ({
  ...state,
  isLoading: true,
  errorMessage: ''
})

const siteWithGrades = (site) => ({
  name: site.siteName || null,
  id: site.siteId || null,
  calculatedGrade: site.calculatedGrade || null,
  mappedGrade: site.mappedGrade || null,
  overrideGrade: site.overrideGrade || null,
  grades: site.assignments || []
})

const gradesSuccess = (state, action) => {
  const { grades } = action
  let gradesArray = []
  let gradesBySiteId = {}

  if (Array.isArray(grades)) {
    gradesArray = (grades || []).reduce((accum, site) => {
      if (site) accum.push(siteWithGrades(site))
      return accum
    }, [])
    gradesBySiteId = (grades || []).reduce((accum, site) => {
      if (site && site.hasOwnProperty('siteId')) {
        accum[site.siteId] = siteWithGrades(site)
      }
      return accum
    }, {})
  }

  return {
    ...state,
    ...gradesBySiteId,
    grades: gradesArray,
    isLoading: false,
    errorMessage: ''
  }
}

const gradesFailure = (state, action) => ({
  ...initialState,
  errorMessage: (action.error || {}).message || 'No Error Message Provided'
})

export function gradesReducer (state = initialState, action) {
  switch (action.type) {
    case REQUEST_GRADES:
      return requestGrades(state, action)
    case GRADES_SUCCESS:
      return gradesSuccess(state, action)
    case GRADES_FAILURE:
      return gradesFailure(state, action)
    default:
      return state
  }
}
