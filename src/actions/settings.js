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
import * as types from '../constants/actions';

const {
	GET_SETTINGS,
	UPDATE_SETTINGS,
	SAVE_REMOTE_SETTINGS,
	SAVE_LOCAL_SETTINGS,
	SAVE_SETTINGS_SUCCESS,
	SAVE_SETTINGS_FAILURE
} = types.settingsActions;

const getSettings = () => {
	return {
		type: GET_SETTINGS,
		isFetching: true
	}
};

const updateSettings = (userSettings) => {
	return {
		type: UPDATE_SETTINGS,
		userSettings,
		isFetching: false,
	}
};

const getSettingsFailed = () => {
	return {
		type: GET_SETTINGS_FAILED,
		isFetching: false,
		getSettingsFailed: true
	}
};

const saveSettings = () => {
	return {
		type: SAVE_REMOTE_SETTINGS,
		isSaving: true
	}
};

const saveSettingsSuccess = () => {
	return {
		type: SAVE_SETTINGS_SUCCESS,
		isSaving: false,
		isFetching: true
	}
};

const saveSettingsFailure = () => {
	return {
		type: SAVE_SETTINGS_FAILURE,
		isSaving: false,
		saveSettingsFailed: true,
		isFetching: true
	}
};

export function getRemoteSettings(token) {
	const settingsURL = `${global.urls.dispatchUrl}${global.urls.settings(token)}`;
	const options = {
		url: settingsURL,
		method: 'get'
	};
	return (dispatch) => {
		dispatch(getSettings());
		return fetch(options).then(res => {
			if (res.ok) {
				return res.json()
			} else {
				dispatch(getSettingsFailed());
			}
		}).then(settings => {
			dispatch(updateSettings(settings));
		});
	}
}

export function saveRemoteSettings(settings, token) {
	const settingsURL = `${global.urls.dispatchUrl}${global.urls.settings(token)}`;
	const options = {
		method: 'post',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(settings.getSettings())
	};

	return (dispatch) => {
		dispatch(saveSettings());
		return fetch(settingsURL, options).then(res => {
			console.log(options);
			if (res.ok) {
				console.log("Success!");
				dispatch(saveSettingsSuccess());
			} else {
				dispatch(saveSettingsFailure());
			}
		});
	}
}

export function saveLocalSettings(settings) {
	return {
		type: SAVE_LOCAL_SETTINGS,
		userSettings: settings
	}
}