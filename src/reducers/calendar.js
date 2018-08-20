import {calendarActions} from '../constants/actions'
import {CALENDAR, ASSIGNMENT, ASSESSMENT} from '../constants/calendar'

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

const initialState = {
  loadingAssessments: false,
  loadingAssignments: false,
  loadingCalendar: false,
  assessments: [],
  assignments: [],
  calendarEvents: [],
  errorMessage: '',
}

const requestAssessments = (state, action) => {
  return {
    ...state,
    loadingAssessments: true
  }
}

const assessmentsSuccess = (state, action) => {
  const assessments = action.assessments.map(({title, dueDate, startDate, ownerSite: siteName, ownerSiteId: siteId}) => ({
    title,
    startDate,
    dueDate,
    siteName,
    siteId,
    eventType: ASSESSMENT
  }))
  return {
    ...state,
    loadingAssessments: false,
    assessments
  }
}

const assessmentsFailure = (state, action) => {
  return {
    ...state,
    loadingAssessments: false,
    errorMessage: action.errorMessage
  }
}

const requestCalendar = (state, action) => {
  return {
    ...state,
    loadingCalendar: true
  }
}

const calendarSuccess = (state, action) => {
  const calendarEvents = action.calendarEvents.map(({firstTime, title, type, assignmentId, siteId, siteName}) => ({
    firstTime,
    title,
    type,
    assignmentId,
    siteId,
    siteName,
    eventType: CALENDAR
  }))
  return {
    ...state,
    loadingCalendar: false,
    calendarEvents
  }
}

const calendarFailure = (state, action) => {
  return {
    ...state,
    loadingCalendar: false,
    errorMessage: action.errorMessage
  }
}

const requestAssignments = (state, action) => {
  return {
    ...state,
    loadingAssignments: true
  }
}

const assignmentsSuccess = (state, action) => {
  const assignments = action.assignments.map(({closeTime, openTime, dueTime, title, id: siteId}) => {
    const siteName = action.siteName
    return {closeTime, openTime, dueTime, title, siteId, siteName, eventType: ASSIGNMENT}
  })
  return {
    ...state,
    loadingAssignments: false,
    assignments
  }
}

const assignmentsFailure = (state, action) => {
  return {
    ...state,
    loadingAssignments: false,
    errorMessage: action.errorMessage
  }
}

export function calendarReducer(state = initialState, action) {
  switch (action.type) {
    case REQUEST_ASSESSMENTS:
      return requestAssessments(state, action)
    case ASSESSMENTS_SUCCESS:
      return assessmentsSuccess(state, action)
    case ASSESSMENTS_FAILURE:
      return assessmentsFailure(state, action)
    case REQUEST_CALENDAR:
      return requestCalendar(state, action)
    case CALENDAR_SUCCESS:
      return calendarSuccess(state, action)
    case CALENDAR_FAILURE:
      return calendarFailure(state, action)
    case REQUEST_ASSIGNMENTS:
      return requestAssignments(state, action)
    case ASSIGNMENTS_SUCCESS:
      return assignmentsSuccess(state, action)
    case ASSIGNMENTS_FAILURE:
      return assignmentsFailure(state, action)
    default:
      return state
  }
}