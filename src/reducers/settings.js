import { settingsActions } from '../../src/constants/actions'

const {
  REQUEST_SETTINGS,
  SETTINGS_SUCCESS,
  SETTINGS_FAILURE,
  REQUEST_SAVE_SETTINGS,
  SAVE_SETTINGS_SUCCESS,
  SAVE_SETTINGS_FAILURE
} = settingsActions

export const initialState = {
  userSettings: {
    blacklist: [],
    global_disable: false
  },
  errorMessage: '',
  isFetching: false,
  isLoaded: false,
  isSaving: false,
  isSaved: false
}

const requestSettings = (state, action) => {
  return {
    ...state,
    isFetching: true,
    isLoaded: false,
    errorMessage: ''
  }
}

const settingsSuccess = (state, action) => {
  return {
    ...state,
    userSettings: action.userSettings,
    isFetching: false,
    isLoaded: true
  }
}

const settingsFailure = (state, action) => {
  return {
    ...initialState,
    errorMessage: action.errorMessage
  }
}

const requestSaveSettings = (state, action) => {
  return {
    ...state,
    isSaving: true,
    isSaved: false,
    errorMessage: ''
  }
}

const saveSettingsSuccess = (state, action) => {
  return {
    ...state,
    userSettings: action.userSettings,
    isSaving: false,
    isSaved: true
  }
}

const saveSettingsFailure = (state, action) => {
  return {
    ...state,
    isSaving: false,
    isSaved: false,
    errorMessage: action.errorMessage
  }
}

export function settingsReducer (state = initialState, action) {
  switch (action.type) {
    case REQUEST_SETTINGS:
      return requestSettings(state, action)
    case SETTINGS_SUCCESS:
      return settingsSuccess(state, action)
    case SETTINGS_FAILURE:
      return settingsFailure(state, action)
    case REQUEST_SAVE_SETTINGS:
      return requestSaveSettings(state, action)
    case SAVE_SETTINGS_SUCCESS:
      return saveSettingsSuccess(state, action)
    case SAVE_SETTINGS_FAILURE:
      return saveSettingsFailure(state, action)
    default:
      return state
  }
}
