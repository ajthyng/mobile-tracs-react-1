import {initialState, gradesReducer} from '../../src/reducers/grades'
import {gradesActions} from '../../src/constants/actions'
import {makeGrade} from '../responses/grades/gradeFactory'
import CourseCard from '../../src/components/CourseList/CourseCard/CourseCard'

const _ = require('lodash/core')

const {GRADES_SUCCESS} = gradesActions
const gradeSuccess = (grades) => ({
	type: GRADES_SUCCESS,
	grades
})
const getRandom = (min, max) => {
	return Math.random() * (max - min) * min
}

describe('grades success action', () => {
  it('should handle missing grades key', () => {
    const state = initialState
  
    expect(gradesReducer(state, {type: GRADES_SUCCESS})).toMatchObject(state)
  })

  it('should not fail on missing grades key', () => {
    const state = initialState

    const expectedState = {
      ...initialState,
      grades: [],
      isLoading: false,
      errorMessage: ''
    }

    const action = {
      type: gradesActions.GRADES_SUCCESS
    }

    expect(gradesReducer(state, action)).toMatchObject(expectedState)
  })

  it('should not fail for null/undefined site entries', () => {
    const state = initialState
    const expectedState = {
      ...initialState,
      grades: [],
      isLoading: false,
      errorMessage: ''
    }

    const action = {
      type: gradesActions.GRADES_SUCCESS,
      grades: [null]
    }

    expect(gradesReducer(state, action)).toMatchObject(expectedState)
  })

  it('should not fail if an object is passed to reducer', () => {
    const state = initialState
    const expectedState = {
      ...initialState,
      grades: [],
      isLoading: false,
      errorMessage: ''
    }

    const action = {
      type: gradesActions.GRADES_SUCCESS,
      grades: {}
    }

    expect(gradesReducer(state, action)).toMatchObject(expectedState)
  })
})

describe('grades failure action', () => {
  it('should have no grades if request fails', () => {
    const err = new Error('Could not fetch TRACS grades')
    const expectedState = {
      ...initialState,
      errorMessage: 'Could not fetch TRACS grades'
    }

    const action = {
      type: gradesActions.GRADES_FAILURE,
      error: err
    }

    const result = gradesReducer(initialState, action)

    expect(result).toMatchObject(expectedState)
    expect(result.grades.length).toBe(0)
  })

  it('should have no error message on next request', () => {
    const err = new Error('Could not fetch TRACS grades')
    const action = {
      type: gradesActions.GRADES_FAILURE,
      error: err
    }

    const result = gradesReducer(initialState, action)
    const retryAction = {
      type: gradesActions.REQUEST_GRADES
    }

    const expectedState = {
      ...result,
      isLoading: true,
      errorMessage: ''
    }

    const retryResult = gradesReducer(result, retryAction)

    expect(retryResult).toMatchObject(expectedState)
  })
})

