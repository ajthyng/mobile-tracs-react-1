/**
 * Copyright 2017 Andrew Thyng
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import {initialState, sitesReducer} from '../../src/reducers/sites'
import {sitesActions} from '../../src/constants/actions'

const sites = sitesActions

let currentState = initialState

describe('basic sites reducer actions', () => {
  beforeEach(() => {
    currentState = initialState
  })

  it('should return initial state for unknown actions', () => {
	  expect(sitesReducer(undefined, {})).toEqual(initialState)
  })

  it('Should handle CLEAR_SITES action', () => {
      const action = {
        type: sites.CLEAR_SITES,
        userSites: {}
      }

      expect(sitesReducer(initialState, action)).toEqual({
        ...initialState
      })
    }
  )

  it('Should handle REQUEST_SITES action', () => {
      const action = {
        type: sites.REQUEST_SITES,
        isFetchingSites: true
      }

      expect(sitesReducer(initialState, action)).toEqual({
        ...initialState,
        isFetchingSites: true
      })
    }
  )

  it('Should handle SITES_SUCCESS action', () => {
      const action = {
        type: sites.SITES_SUCCESS,
        userSites: {'342908ufa0wefh': 'CS 1301'},
      }

      const state = {
        ...initialState,
        userSites: {},
        hasSites: false,
        isFetchingSites: true
      }
      
      const expectedState = {
        ...initialState,
        userSites: action.userSites,
        hasSites: true,
        isFetchingSites: false
      }

      expect(sitesReducer(state, action)).toMatchObject(expectedState)
    }
  )


  it('Should handle SITES_FAILURE action', () => {
      const action = {
        type: sites.SITES_FAILURE,
        hasFailed: true,
        hasSites: undefined
      }

      expect(sitesReducer(initialState, action)).toEqual({
        ...initialState,
        hasSites: undefined,
        hasFailed: true
      })
    }
  )
})

describe('favorites tests', () => {
  it('should not add favorites to the existing list', () => {
    const action = {
      type: sites.FAVORITES_SUCCESS,
      favorites: '5;3;4'
    }

    const state = {
      ...initialState,
      favorites: ['6', '8']
    }

    const expectedState = {
      ...initialState,
      isFetchingSites: false,
      favorites: ['5', '3', '4']
    }

    const newState = sitesReducer(state, action)

    expect(newState).toMatchObject(expectedState)
  })

  it('should not have duplicates in favorites', () => {
    const action = {
      type: sites.FAVORITES_SUCCESS,
      favorites: '5;3;4;4;4'
    }

    const state = {
      ...initialState,
      favorites: ['6', '8']
    }

    const expectedState = {
      ...initialState,
      isFetchingSites: false,
      favorites: ['5', '3', '4']
    }

    const newState = sitesReducer(state, action)

    expect(newState.favorites.length).toBe(3)
    expect(newState.favorites.filter(id => id === '4').length).toBe(1)
  })

  it('should maintain the same favorites order as received', () => {
    const action = {
      type: sites.FAVORITES_SUCCESS,
      favorites: '5;3;4;4;4;2;6;9;12'
    }

    const expectedOrder = ['5', '3', '4', '2', '6', '9', '12']
    const state = {
      ...initialState,
      favorites: ['6', '8']
    }

    const newState = sitesReducer(state, action)
    const matchingOrder = newState.favorites.filter((id, i) => expectedOrder[i] === id)

    expect(matchingOrder.length).toEqual(expectedOrder.length)
  })

  it('should return empty array for unexpected favorites', () => {
    const action = {
      type: sites.FAVORITES_SUCCESS,
      favorites: {}
    }

    expect(sitesReducer(initialState, action)).toMatchObject({
      ...initialState,
      favorites: []
    })
  })

  it('should return empty array for missing favorites', () => {
    const action = {
      type: sites.FAVORITES_SUCCESS
    }

    expect(sitesReducer(initialState, action)).toMatchObject({
      ...initialState,
      favorites: []
    })
  })

  it('should return empty array for no favorites', () => {
    const action = {
      type: sites.FAVORITES_SUCCESS,
      favorites: ''
    }

    expect(sitesReducer(initialState, action)).toMatchObject({
      ...initialState,
      favorites: []
    })
  })
})