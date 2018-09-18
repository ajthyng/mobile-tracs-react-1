import { initialState } from "../../src/reducers/settings"
import { settingsActions } from '../../src/constants/actions'
import { settingsReducer } from "../../src/reducers/settings"

const settings = settingsActions

it('should handle REQUEST_SETTINGS action', () => {
	const action = {
		type: settings.REQUEST_SETTINGS,
		isFetching: true,
		isLoaded: false,
		errorMessage: ""
  }
  
	expect(settingsReducer(initialState, action)).toEqual({
		...initialState,
		isFetching: true,
		isLoaded: false,
		errorMessage: "",
	})
})

it('should handle SETTINGS_SUCCESS action', () => {
	const action = {
		type: settings.SETTINGS_SUCCESS,
		userSettings: {},
		isFetching: false,
		isLoaded: true,
	}
	expect(settingsReducer(initialState, action)).toEqual({
		...initialState,
		userSettings: action.userSettings,
		isFetching: false,
		isLoaded: true
	})
})

it('should handle SETTINGS_FAILURE action', () => {
  const action = {
    type: settings.SETTINGS_FAILURE,
    isFetching: false,
    isLoaded: false,
    userSettings: initialState.userSettings,
    errorMessage: "",
  }

  expect(settingsReducer(initialState, action)).toEqual({
    ...initialState,
    userSettings: action.userSettings,
    isFetching: false,
    isLoaded: false,
    errorMessage: action.errorMessage,
  })
})

it('should handle REQUEST_SAVE_SETTINGS action', () => {
  const action = {
    type: settings.REQUEST_SAVE_SETTINGS,
    isSaving: true,
    isSaved: false,
    errorMessage: initialState.errorMessage
  }

  expect(settingsReducer(initialState, action)).toEqual({
    ...initialState,
    isSaving: true,
    isSaved: false,
    errorMessage: action.errorMessage
  })
})


it('should handle SAVE_SETTINGS_SUCCESS', () => {
	const action = {
		type: settings.SAVE_SETTINGS_SUCCESS,
		userSettings: {},
		isSaving: false,
		isSaved: true,
	}

	expect(settingsReducer(initialState, action)).toEqual({
		...initialState,
		userSettings: action.userSettings,
		isSaving: false,
		isSaved: true
	})
})


it('should handle SAVE_SETTINGS_FAILURE', () => {
	const action = {
		type: settings.SAVE_SETTINGS_FAILURE,
		isSaving: false,
		isSaved: false,
		errorMessage: ""
	}

	expect(settingsReducer(initialState, action)).toEqual({
		...initialState,
		isSaving: false,
		isSaved: false,
		errorMessage: action.errorMessage
	})
})
