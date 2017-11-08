/**
 * Copyright 2017 Andrew Thyng
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
import Settings from '../utils/settings';
import {settingsActions} from '../constants/actions';
import FCM from 'react-native-fcm';

const {
	REQUEST_SETTINGS,
	SETTINGS_SUCCESS,
	SETTINGS_FAILURE,
	REQUEST_SAVE_SETTINGS,
	SAVE_SETTINGS_SUCCESS,
	SAVE_SETTINGS_FAILURE
} = settingsActions;

const requestSettings = () => {
	return {
		type: REQUEST_SETTINGS,
	}
};

const settingsSuccess = (userSettings) => {
	return {
		type: SETTINGS_SUCCESS,
		userSettings,
	}
};

const settingsFailure = (errorMessage) => {
	return {
		type: SETTINGS_FAILURE,
		errorMessage
	}
};

const requestSaveSettings = () => {
	return {
		type: REQUEST_SAVE_SETTINGS,
	}
};

const saveSettingsSuccess = (userSettings) => {
	return {
		type: SAVE_SETTINGS_SUCCESS,
		userSettings
	}
};

const saveSettingsFailure = (errorMessage) => {
	return {
		type: SAVE_SETTINGS_FAILURE,
		errorMessage
	}
};

export function getSettings(token) {
	return async (dispatch) => {
		dispatch(requestSettings());
		if (!token) {
			await FCM.getFCMToken().then(deviceToken => token = deviceToken);
		}
		const settingsURL = `${global.urls.dispatchUrl}${global.urls.settings(token)}`;
		const options = {
			url: settingsURL,
			method: 'get'
		};
		return fetch(options).then(res => {
			const errorMessage = "Failed to retrieve settings, assigning defaults";
			if (res.ok) {
				return res.json();
			}
			dispatch(settingsFailure(errorMessage));
		}).then(settings => {
			if (settings) {
				console.log("Settings: ", settings);
				dispatch(settingsSuccess(settings));
			}
		});
	}
}

export function saveSettings(settings, token, local) {
	return async (dispatch) => {
		if (!token) {
			await FCM.getFCMToken().then(deviceToken => token = deviceToken);
		}
		const settingsURL = `${global.urls.dispatchUrl}${global.urls.settings(token)}`;
		const options = {
			method: 'post',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(settings)
		};
		dispatch(requestSaveSettings());
		if (local) {
			 dispatch(saveSettingsSuccess(settings));
			 return true;
		}
		return fetch(settingsURL, options).then(res => {
			console.log(options);
			if (res.ok) {
				dispatch(saveSettingsSuccess(settings));
				return true;
			} else {
				dispatch(saveSettingsFailure("Failed to save settings remotely"));
				return false;
			}
		});
	}
}