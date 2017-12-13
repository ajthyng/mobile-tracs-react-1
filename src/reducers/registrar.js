/**
 * Copyright 2017 Andrew Thyng
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import {Platform} from 'react-native';
import {registrarActions} from '../constants/actions';

const {
	REQUEST_REGISTRATION,
	REGISTRATION_SUCCESS,
	REGISTRATION_FAILURE,
	REQUEST_UNREGISTER,
	UNREGISTER_SUCCESS,
	UNREGISTER_FAILURE
} = registrarActions;

export const initialState = {
	isRegistering: false,
	isRegistered: false,
	deviceToken: '',
	netid: '',
	platform: Platform.OS,
	isUnregistering: false,
	errorMessage: ''
};

function requestRegistration(state, action) {
	return {
		...state,
		isRegistering: true,
		isRegistered: false,
		errorMessage: ''
	}
}

function registrationSuccess(state, action) {
	return {
		...state,
		isRegistering: false,
		isRegistered: true,
		netid: action.netid,
		deviceToken: action.deviceToken,
		errorMessage: ''
	}
}

function registrationFailure(state, action) {
	return {
		...initialState,
		errorMessage: action.errorMessage
	}
}


function requestUnregister(state, action) {
	return {
		...state,
		isDeleting: true,
		isDeleted: false,
		errorMessage: ''
	}
}

function unregisterSuccess(state, action) {
	return {
		...initialState
	}
}

function unregisterFailure(state, action) {
	return {
		...state,
		isDeleting: false,
		isRegistered: true,
		errorMessage: action.errorMessage
	}
}


export function registerReducer(state = initialState, action) {
	switch (action.type) {
		case REQUEST_REGISTRATION: return requestRegistration(state, action);
		case REGISTRATION_SUCCESS: return registrationSuccess(state, action);
		case REGISTRATION_FAILURE: return registrationFailure(state, action);
		case REQUEST_UNREGISTER: return requestUnregister(state, action);
		case UNREGISTER_SUCCESS: return unregisterSuccess(state, action);
		case UNREGISTER_FAILURE: return unregisterFailure(state, action);
		default: return state;
	}
}