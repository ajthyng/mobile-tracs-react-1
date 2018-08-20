import {calendarActions} from '../constants/actions'
import {haxios as axios} from '../utils/networking'

const {
  REQUEST_ASSESSMENTS,
  ASSESSMENTS_SUCCESS,
  ASSESSMENTS_FAILURE,
  REQUEST_CALENDAR,
  CALENDAR_SUCCESS,
  CALENDAR_FAILURE,
  REQUEST_ASSIGNMENTS,
  ASSIGNMENTS_SUCCESS,
  ASSIGNMENTS_FAILURE
} = calendarActions

const requestAssessments = () => ({type: REQUEST_ASSESSMENTS})

const assessmentsSuccess = (assessments) => ({type: ASSESSMENTS_SUCCESS, assessments})

const assessmentsFailure = (error) => ({
  type: ASSESSMENTS_FAILURE,
  errorMessage: error.message || 'No assessments found'
})

export const getAssessments = (siteId = null) => {
  return dispatch => {
    dispatch(requestAssessments())

    if (!siteId) {
      dispatch(assessmentsFailure(new Error('A siteID is required to retrieve assessments')))
      return
    }

    const url = `${global.urls.baseUrl}${global.urls.assessments(siteId)}`

    return axios(url).then(res => {
      dispatch(assessmentsSuccess(res.data.sam_pub_collection))
    }).catch(err => {
      dispatch(assessmentsFailure(err))
    })
  }
}

const requestCalendar = () => ({type: REQUEST_CALENDAR})

const calendarSuccess = (calendarEvents) => ({type: CALENDAR_SUCCESS, calendarEvents})

const calendarFailure = (error) => ({type: CALENDAR_FAILURE, errorMessage: error.message || 'No calendar events found'})

export const getCalendarEvents = (siteId = null) => {
  return dispatch => {
    dispatch(requestCalendar())

    if (siteId === null) {
      dispatch(calendarFailure(new Error('A siteId is required to retrieve calendar events')))
      return
    }

    const url = `${global.urls.baseUrl}${global.urls.calendar(siteId)}`

    return axios(url).then(res => {
      dispatch(calendarSuccess(res.data.calendar_collection))
    }).catch(err => {
      dispatch(calendarFailure(err))
    })
  }
}


const requestAssignments = () => ({type: REQUEST_ASSIGNMENTS})

const assignmentsSuccess = (assignments, siteName) => ({type: ASSIGNMENTS_SUCCESS, assignments, siteName})

const assignmentsFailure = (error) => ({type: ASSIGNMENTS_FAILURE, errorMessage: error.message || 'No assignments found'})

export const getAssignments = (siteId = null, siteName = '') => {
  return dispatch => {
    dispatch(requestAssignments())

    if (siteId === null) {
      dispatch(assignmentsFailure(new Error('A siteId is required to retrieve calendar events')))
      return
    }

    const url = `${global.urls.baseUrl}${global.urls.assignment(siteId)}`

    return axios(url).then(res => {
      dispatch(assignmentsSuccess(res.data.assignment_collection, siteName))
    }).catch(err => {
      dispatch(assignmentsFailure(err))
    })
  }
}