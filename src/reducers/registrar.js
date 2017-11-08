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
	IS_REGISTERED,
	IS_REGISTERING,
	REMOVE_TOKEN,
	REMOVE_USER,
	REPLACE_TOKEN,
	REPLACE_USER,
	REGISTRATION_FAILED,
	REQUEST_REGISTRATION_DELETE,
	REGISTRATION_DELETE_SUCCESS,
	REGISTRATION_DELETE_FAILURE
} = registrarActions;

export const initialState = {
	isRegistered: false,
	deviceToken: '',
	registeredUser: '',
	platform: Platform.OS,
	isRegistering: false,
	hasFailed: false,
	errorMessage: "",
	isDeleting: false,
	isDeleted: false
};

function isRegistered(state, action) {
	return {
		...state,
		isRegistered: action.isRegistered
	}
}

function isRegistering(state, action) {
	return {
		...state,
		isRegistering: action.isRegistering
	}
}

function registrationHasFailed(state, action) {
	return {
		...state,
		hasFailed: action.hasFailed
	}
}

function removeToken(state, action) {
	return {
		...state,
		deviceToken: ''
	}
}

function replaceToken(state, action) {
	return {
		...state,
		deviceToken: action.deviceToken
	}
}

function removeUser(state, action) {
	return {
		...state,
		registeredUser: ''
	}
}

function replaceUser(state, action) {
	return {
		...state,
		registeredUser: action.registeredUser
	}
}

function requestDeleteRegistration(state, action) {
	return {
		...state,
		isDeleting: true,
		isDeleted: false,
		errorMessage: ""
	}
}

function deleteRegistrationSuccess(state, action) {
	return {
		...initialState,
		isDeleted: true
	}
}

function deleteRegistrationFailure(state, action) {
	return {
		...state,
		isDeleting: false,
		isDeleted: false,
		errorMessage: action.errorMessage
	}
}


export function registerReducer(state = initialState, action) {
	switch (action.type) {
		case REMOVE_USER: return removeUser(state, action);
		case REPLACE_USER: return replaceUser(state, action);
		case REMOVE_TOKEN: return removeToken(state, action);
		case REPLACE_TOKEN: return replaceToken(state, action);
		case IS_REGISTERED: return isRegistered(state, action);
		case IS_REGISTERING: return isRegistering(state, action);
		case REGISTRATION_FAILED: return registrationHasFailed(state, action);
		case REQUEST_REGISTRATION_DELETE: return requestDeleteRegistration(state, action);
		case REGISTRATION_DELETE_SUCCESS: return deleteRegistrationSuccess(state, action);
		case REGISTRATION_DELETE_FAILURE: return deleteRegistrationFailure(state, action);
		default: return state;
	}
}