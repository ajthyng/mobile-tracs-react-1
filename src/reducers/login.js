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
let { LOGIN, LOGOUT, LOGIN_HAS_FAILED, LOGIN_IS_GUEST, LOGGING_IN, IS_LOGGED_IN } = authActions;

export const initialState = {
	hasFailed: false,
	loginIsGuestAccount: false,
	isLoggedIn: false,
	loggingIn: false,
	netid: '',
	password: ''
};

function login(state, action) {
	return {
		...state,
		netid: action.netid,
		password: action.password
	}
}

function logout(state, action) {
	return {
		...state,
		netid: '',
		password: ''
	}
}

function isLoggedIn(state, action) {
	return {
		... state,
		isLoggedIn: action.isLoggedIn
	}
}

function loginHasFailed(state, action) {
	return {
		... state,
		loginHasFailed: action.loginHasFailed
	}}

function loginIsGuestAccount(state, action) {
	return {
		... state,
		loginIsGuestAccount: action.loginIsGuestAccount
	}}

function loggingIn(state, action) {
	return {
		... state,
		loggingIn: action.loggingIn
	}}

export function loginReducer(state = initialState, action) {
	switch (action.type) {
		case LOGIN: 						return login(state, action);
		case LOGOUT: 						return logout(state, action);
		case LOGIN_HAS_FAILED: 	return loginHasFailed(state, action);
		case LOGIN_IS_GUEST: 		return loginIsGuestAccount(state, action);
		case LOGGING_IN: 				return loggingIn(state, action);
		case IS_LOGGED_IN: 			return isLoggedIn(state, action);
		default: 								return state;
	}
}