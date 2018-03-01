/**
 * Copyright 2017 Andrew Thyng
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
import {settingsActions} from '../constants/actions';
import {token as TokenStore} from '../utils/storage';
import {haxios as axios} from '../utils/networking';

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
			await TokenStore.get().then(deviceToken => token = deviceToken);
		}
		const settingsURL = `${global.urls.dispatchUrl}${global.urls.settings(token)}`;
		return axios(settingsURL, {method: 'get'}).then(res => {
			let settings = res.data;
			if (settings) {
				dispatch(settingsSuccess(settings));
			}
		}).catch(err => {
			dispatch(settingsFailure(err.message));
		});
	}
}

export function saveSettings(settings, token, local) {
	return async (dispatch) => {
		dispatch(requestSaveSettings());
		if (!token) {
			await TokenStore.get().then(deviceToken => token = deviceToken);
		}
		const settingsURL = `${global.urls.dispatchUrl}${global.urls.settings(token)}`;
		const options = {
			method: 'post',
			headers: {
				'Content-Type': 'application/json'
			},
			data: settings
		};
		if (local) {
			dispatch(saveSettingsSuccess(settings));
			return true;
		}
		return axios(settingsURL, options).then(res => {
			console.log(options);
			dispatch(saveSettingsSuccess(settings));
			return true;
		}).catch(err => {
			dispatch(saveSettingsFailure(err.message));
		});
	}
}