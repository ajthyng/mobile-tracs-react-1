/**
 * Copyright 2017 Andrew Thyng
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import {settingsActions} from '../../src/constants/actions';
import Settings from '../utils/settings';
const {
	REQUEST_SETTINGS,
	SETTINGS_SUCCESS,
	SETTINGS_FAILURE,
	REQUEST_SAVE_SETTINGS,
	SAVE_SETTINGS_SUCCESS,
	SAVE_SETTINGS_FAILURE
} = settingsActions;

export const initialState = {
	userSettings: {
		blacklist: [],
		global_disable: false
	},
	errorMessage: "",
	isFetching: false,
	isLoaded: false,
	isSaving: false,
	isSaved: false
};

const requestSettings = (state, action) => {
	return {
		...state,
		isFetching: true,
		isLoaded: false,
		errorMessage: "",
	}
};

const settingsSuccess = (state, action) => {
	return {
		...state,
		userSettings: action.userSettings,
		isFetching: false,
		isLoaded: true
	}
};

const settingsFailure = (state, action) => {
	return {
		...state,
		isFetching: false,
		isLoaded: false,
		userSettings: initialState.userSettings,
		errorMessage: action.errorMessage
	}
};

const requestSaveSettings = (state, action) => {
	return {
		...state,
		isSaving: true,
		isSaved: false,
		errorMessage: "",
	}
};

const saveSettingsSuccess = (state, action) => {
	return {
		...state,
		userSettings: action.userSettings,
		isSaving: false,
		isSaved: true
	}
};

const saveSettingsFailure = (state, action) => {
	return {
		...state,
		isSaving: false,
		isSaved: false,
		errorMessage: action.errorMessage
	}
};

export function settingsReducer(state = initialState, action) {
	switch (action.type) {
		case REQUEST_SETTINGS: return requestSettings(state, action);
		case SETTINGS_SUCCESS: return settingsSuccess(state, action);
		case SETTINGS_FAILURE: return settingsFailure(state, action);
		case REQUEST_SAVE_SETTINGS: return requestSaveSettings(state, action);
		case SAVE_SETTINGS_SUCCESS: return saveSettingsSuccess(state, action);
		case SAVE_SETTINGS_FAILURE: return saveSettingsFailure(state, action);
		default: return state;
	}
}