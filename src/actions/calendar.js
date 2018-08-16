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

const requestAssessments = () => ({type: REQUEST_ASSESSMENTS})

const assessmentsSuccess = (assessments) => ({type: ASSESSMENTS_SUCCESS, assessments})

const assessmentsFailure = (error) => ({type: ASSESSMENTS_FAILURE, errorMessage: error.message || 'No assessments found'})

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