/**
 * Copyright 2017 Andrew Thyng
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import * as actions from '../../src/constants/actions';
import Settings from '../utils/settings';
const {
	GET_SETTINGS,
	SAVE_REMOTE_SETTINGS,
	SAVE_SETTINGS_SUCCESS,
	SAVE_SETTINGS_FAILURE,
	SAVE_LOCAL_SETTINGS,
	UPDATE_SETTINGS
} = actions.settingsActions;

const initialState = {
	isFetching: true,
	userSettings: new Settings(),
	isSaving: false
};

const getSettings = (state, action) => {
	return {
		...state,
		isFetching: action.isFetching,
	}
};

const updateSettings = (state, action) => {
	const userSettings = new Settings(action.userSettings);
	return {
		...state,
		userSettings,
		isFetching: action.isFetching
	}
};

const saveRemoteSettings = (state, action) => {
	return {
		...state,
		isSaving: action.isSaving
	}
};

const saveSettingsSuccess = (state, action) => {
	return {
		...state,
		isSaving: action.isSaving
	}
};

const saveSettingsFailure = (state, action) => {
	return {
		...state,
		isSaving: action.isSaving,
		saveSettingsFailed: action.saveSettingsFailed
	}
};

const saveLocalSettings = (state, action) => {
	return {
		...state,
		userSettings: action.userSettings
	}
};

export function settingsReducer(state = initialState, action) {
	switch (action.type) {
		case GET_SETTINGS: return getSettings(state, action);
		case UPDATE_SETTINGS: return updateSettings(state, action);
		case SAVE_REMOTE_SETTINGS: return saveRemoteSettings(state, action);
		case SAVE_SETTINGS_SUCCESS: return saveSettingsSuccess(state, action);
		case SAVE_SETTINGS_FAILURE: return saveSettingsFailure(state, action);
		case SAVE_LOCAL_SETTINGS: return saveLocalSettings(state, action);
		default: return state;
	}
}