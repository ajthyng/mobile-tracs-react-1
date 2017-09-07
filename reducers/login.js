/**
 * Copyright 2017 Andrew Thyng
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import {LOGGED_IN, LOGGING_IN, LOGIN, LOGIN_HAS_FAILED, LOGIN_IS_GUEST, LOGOUT} from '../actions/login';

const defaultState = {
	loginHasFailed: false,
	loginIsGuestAccount: false,
	isLoggedIn: false,
	loggingIn: false,
	netid: '',
	password: ''
};

export function auth(state = {
	netid: defaultState.netid,
	password: defaultState.password,
	isLoggedIn: defaultState.isLoggedIn
}, action) {
	switch (action.type) {
		case LOGIN:
			return Object.assign({}, state, {
				netid: action.netid,
				password: action.password,
				isLoggedIn: action.isLoggedIn,
			});
		case LOGOUT:
			return Object.assign({}, state, {
				netid: '',
				password: '',
				isLoggedIn: action.isLoggedIn
			});
		default:
			return state;
	}
}

export function loginHasFailed(state = defaultState.loginHasFailed, action) {
	switch (action.type) {
		case LOGIN_HAS_FAILED:
			return action.hasFailed;
		default:
			return state;
	}
}

export function loginIsGuestAccount(state = defaultState.loginIsGuestAccount, action) {
	switch (action.type) {
		case LOGIN_IS_GUEST:
			return action.isGuestAccount;
		default:
			return state;
	}
}

export function loggingIn(state = defaultState.loggingIn, action) {
	switch (action.type) {
		case LOGGING_IN:
			return action.loggingIn;
		default:
			return state;
	}
}