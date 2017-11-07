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
		isFetching: true
	}
};

const settingsSuccess = (userSettings) => {
	return {
		type: SETTINGS_SUCCESS,
		userSettings,
		isFetching: false,
	}
};

const settingsFailure = (errorMessage) => {
	return {
		type: SETTINGS_FAILURE,
		isFetching: false,
		errorMessage
	}
};

const requestSaveSettings = () => {
	return {
		type: REQUEST_SAVE_SETTINGS,
		isSaving: true
	}
};

const saveSettingsSuccess = (userSettings) => {
	return {
		type: SAVE_SETTINGS_SUCCESS,
		isSaving: false,
		userSettings
	}
};

const saveSettingsFailure = (errorMessage) => {
	return {
		type: SAVE_SETTINGS_FAILURE,
		isSaving: false,
		errorMessage
	}
};

export function getSettings(token) {
	const settingsURL = `${global.urls.dispatchUrl}${global.urls.settings(token)}`;
	const options = {
		url: settingsURL,
		method: 'get'
	};
	return (dispatch) => {
		dispatch(requestSettings());
		return fetch(options).then(res => {
			if (res.ok) {
				return res.json()
			} else {
				dispatch(settingsFailure("Retrieving remote settings failed"));
			}
		}).then(settings => {
			console.log("SETTINGS: ", settings);
			dispatch(settingsSuccess(settings));
		});
	}
}

export function saveSettings(settings, token, local) {
	const settingsURL = `${global.urls.dispatchUrl}${global.urls.settings(token)}`;
	const options = {
		method: 'post',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(settings)
	};

	return (dispatch) => {
		dispatch(requestSaveSettings());
		if (local) {
			return saveSettingsSuccess(settings);
		}
		return fetch(settingsURL, options).then(res => {
			console.log(options);
			if (res.ok) {
				console.log("Success!");
				dispatch(saveSettingsSuccess(settings));
			} else {
				dispatch(saveSettingsFailure("Failed to save settings remotely"));
			}
		});
	}
}