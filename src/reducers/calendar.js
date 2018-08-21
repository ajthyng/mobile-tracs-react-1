import {calendarActions} from '../constants/actions'
import {CALENDAR, ASSIGNMENT, ASSESSMENT} from '../constants/calendar'
import dayjs from 'dayjs'

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
  aggregate: {},
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

  let aggregate = {...state.aggregate}

  aggregate = assessments.reduce((accum, item) => {
    const open = dayjs(item.startDate).startOf('day').format('YYYY-MM-DD')
    const due = dayjs(item.dueDate).startOf('day').format('YYYY-MM-DD')

    if (!accum[open]) accum[open] = []
    if (!accum[due]) accum[due] = []

    accum[open].push({...item, event: 'open'})
    accum[due].push({...item, event: 'due'})

    return accum
  }, aggregate)

  return {
    ...state,
    loadingAssessments: false,
    assessments,
    aggregate
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

  let aggregate = {...state.aggregate}

  aggregate = calendarEvents.reduce((accum, item) => {
    const eventDate = dayjs(item.firstTime.time).startOf('day').format('YYYY-MM-DD')
    if (!accum[eventDate]) accum[eventDate] = []
    accum[eventDate].push(item)
    return accum
  }, aggregate)

  return {
    ...state,
    loadingCalendar: false,
    calendarEvents,
    aggregate
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
  const assignments = action.assignments.map(({closeTime, openTime, dueTime, title, id}) => {
    const siteName = action.siteName
    return {openTime, dueTime, title, id, siteName, eventType: ASSIGNMENT}
  })

  let aggregate = {...state.aggregate}

  aggregate = assignments.reduce((accum, item) => {
    const open = dayjs(item.openTime.time).startOf('day').format('YYYY-MM-DD')
    const due = dayjs(item.dueTime.time).startOf('day').format('YYYY-MM-DD')

    if (!accum[open]) accum[open] = []
    if (!accum[due]) accum[due] = []

    accum[open].push({...item, event: 'open'})
    accum[due].push({...item, event: 'due'})

    return accum
  }, aggregate)

  return {
    ...state,
    loadingAssignments: false,
    assignments,
    aggregate
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