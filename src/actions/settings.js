import { settingsActions } from '../constants/actions'
import { token as TokenStore } from '../utils/storage'
import { haxios as axios } from '../utils/networking'

const {
  REQUEST_SETTINGS,
  SETTINGS_SUCCESS,
  SETTINGS_FAILURE,
  REQUEST_SAVE_SETTINGS,
  SAVE_SETTINGS_SUCCESS,
  SAVE_SETTINGS_FAILURE
} = settingsActions

const requestSettings = () => {
  return {
    type: REQUEST_SETTINGS
  }
}

const settingsSuccess = (userSettings) => {
  return {
    type: SETTINGS_SUCCESS,
    userSettings
  }
}

const settingsFailure = (errorMessage) => {
  return {
    type: SETTINGS_FAILURE,
    errorMessage
  }
}

const requestSaveSettings = () => {
  return {
    type: REQUEST_SAVE_SETTINGS
  }
}

const saveSettingsSuccess = (userSettings) => {
  return {
    type: SAVE_SETTINGS_SUCCESS,
    userSettings
  }
}

const saveSettingsFailure = (errorMessage) => {
  return {
    type: SAVE_SETTINGS_FAILURE,
    errorMessage
  }
}

export function getSettings (token) {
  return async (dispatch) => {
    dispatch(requestSettings())
    if (!token) {
      token = await TokenStore.getDeviceToken().then(deviceToken => deviceToken)
    }
    const settingsURL = `${global.urls.dispatchUrl}${global.urls.settings(token)}`
    return axios(settingsURL, { method: 'get' }).then(res => {
      let settings = res.data
      if (settings) {
        dispatch(settingsSuccess(settings))
      }
    }).catch(err => {
      dispatch(settingsFailure(err.message))
    })
  }
}

export function saveSettings (settings, token) {
  return async (dispatch) => {
    dispatch(requestSaveSettings())
    if (!token) {
      token = await TokenStore.getDeviceToken().then(deviceToken => deviceToken)
    }
    const settingsURL = `${global.urls.dispatchUrl}${global.urls.settings(token)}`
    const options = {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      data: settings
    }
    return axios(settingsURL, options).then(res => {
      dispatch(saveSettingsSuccess(settings))
      return true
    }).catch(err => {
      dispatch(saveSettingsFailure(err.message))
    })
  }
}
