import {calendarActions} from '../constants/actions'

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
  return {
    ...state,
    loadingAssessments: false,
    assessments: action.assessments
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
  return {
    ...state,
    loadingCalendar: false,
    calendarEvents: action.calendarEvents
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
  return {
    ...state,
    loadingAssignments: false,
    assignments: action.assignments
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