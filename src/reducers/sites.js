/**
 * Copyright 2017 Andrew Thyng
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
import {sitesActions} from '../constants/actions'
import {toggleStatus} from '../constants/sites'

const {FAVORITES, ALL_SITES} = toggleStatus

const {
  CLEAR_SITES,
  REQUEST_SITES,
  SITES_SUCCESS,
  SITES_FAILURE,
  REQUEST_FAVORITES,
  FAVORITES_SUCCESS,
  FAVORITES_FAILURE,
  SET_FILTER_STATUS,
  REQUEST_UPDATE_FAVORITES,
  UPDATE_FAVORITES_SUCCESS,
  UPDATE_FAVORITES_FAILURE
} = sitesActions

export const initialState = {
  userSites: {},
  isFetchingSites: false,
  isFetchingFavorites: false,
  isUpdatingFavorites: false,
  hasFailed: false,
  favorites: [],
  filterStatus: FAVORITES
}

let clearSites = (state, action) => {
  return {
    ...state,
    userSites: action.userSites
  }
}

const requestSites = (state) => {
  return {
    ...state,
    isFetchingSites: true
  }
}

const sitesSuccess = (state, action) => {
  return {
    ...state,
    userSites: action.userSites,
    isFetchingSites: false,
    hasSites: Object.keys(action.userSites).length > 0
  }
}

const sitesFailure = (state) => {
  return {
    ...state,
    hasFailed: true,
    hasSites: undefined
  }
}

const requestFavorites = (state) => {
  return {
    ...state,
    isFetchingFavorites: true,
    errorMessage: ''
  }
}

const favoritesSuccess = (state, action) => {
  const favorites = (action.favorites || '').split(';').filter(site => (site || '').length > 0)
  return {
    ...state,
    isFetchingFavorites: false,
    favorites: Array.from(new Set([...favorites]))
  }
}

const favoritesFailure = (state, action) => {
  return {
    ...state,
    isFetchFavorites: false,
    errorMessage: action.error.message
  }
}

const setFilterStatus = (state, action) => {
  return {
    ...state,
    filterStatus: action.filterStatus
  }
}

const requestUpdateFavorites = (state, action) => {
  return {
    ...state,
    isUpdatingFavorites: true,
    errorMessage: ''
  }
}

const updateFavoritesSuccess = (state, action) => {
  const favorites = action.favorites
  return {
    ...state,
    favorites,
    isUpdatingFavorites: false,
    errorMessage: ''
  }
}

const updateFavoritesFailure = (state, action) => {
  return {
    ...state,
    isUpdatingFavorites: false,
    errorMessage: action.errorMessage
  }
}

export function sitesReducer (state = initialState, action) {
  switch (action.type) {
    case CLEAR_SITES:
      return clearSites(state, action)
    case REQUEST_SITES:
      return requestSites(state, action)
    case SITES_SUCCESS:
      return sitesSuccess(state, action)
    case SITES_FAILURE:
      return sitesFailure(state, action)
    case REQUEST_FAVORITES:
      return requestFavorites(state, action)
    case FAVORITES_SUCCESS:
      return favoritesSuccess(state, action)
    case FAVORITES_FAILURE:
      return favoritesFailure(state, action)
    case SET_FILTER_STATUS:
      return setFilterStatus(state, action)
    case REQUEST_UPDATE_FAVORITES:
      return requestUpdateFavorites(state, action)
    case UPDATE_FAVORITES_SUCCESS:
      return updateFavoritesSuccess(state, action)
    case UPDATE_FAVORITES_FAILURE:
      return updateFavoritesFailure(state, action)
    default:
      return state
  }
}
