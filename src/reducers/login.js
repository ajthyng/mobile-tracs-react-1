/**
 * Copyright 2017 Andrew Thyng
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
import { authActions } from '../constants/actions';
let {
	REQUEST_LOGIN,
	LOGIN_SUCCESS,
	LOGIN_FAILURE,
	REQUEST_LOGOUT,
	LOGOUT_SUCCESS,
	LOGOUT_FAILURE,
	CLEAR_ERROR
} = authActions;

export const initialState = {
	isAuthenticated: false,
	isLoggingIn: false,
	netid: '',
	password: '',
	tracsID: ''
};

const requestLogin = (state, action) => {
	return {
		...state,
		isAuthenticated: false,
		isLoggingIn: true,
		errorMessage: ""
	}
};

const loginSuccess = (state, action) => {
	return {
		...state,
		isAuthenticated: true,
		isLoggingIn: false,
		errorMessage: "",
		tracsID: action.tracsID,
		netid: action.netid,
		password: action.password
	}
};

const loginFailure = (state, action) => {
	return {
		...initialState,
		errorMessage: action.errorMessage,
	}
};

const requestLogout = (state, action) => {
	return {
		...state,
		isLoggingOut: true,
		errorMessage: ""
	}
};

const logoutFailure = (state, action) => {
	return {
		...initialState,
		errorMessage: action.errorMessage
	}
};

const clearError = (state, action) => {
	return {
		...state,
		errorMessage: ''
	}
};

export function loginReducer(state = initialState, action) {
	switch (action.type) {
		case REQUEST_LOGIN: 		return requestLogin(state, action);
		case LOGIN_SUCCESS: 		return loginSuccess(state, action);
		case LOGIN_FAILURE: 		return loginFailure(state, action);
		case REQUEST_LOGOUT: 		return requestLogout(state, action);
		case LOGOUT_FAILURE:		return logoutFailure(state, action);
		case CLEAR_ERROR: 			return clearError(state, action);
		default: 								return state;
	}
}