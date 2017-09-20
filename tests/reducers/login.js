/**
 * Copyright 2017 Andrew Thyng
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import {initialState, loginReducer} from '../../src/reducers/login';
import {authActions} from '../../src/constants/actions';

const auth = authActions;
const netid = 'fak103';
const password = 'password123';

let currentState = initialState;

beforeEach(() => {
	currentState = initialState;
});

it('should return initial state for unrecognized actions', () => {
	expect(loginReducer(undefined, {})).toEqual(currentState);
});

it('should handle LOGIN action', () => {
	const action = {
		type: auth.LOGIN,
		netid: netid,
		password: password,
		isLoggedIn: true
	};
	expect(loginReducer(initialState, action)).toEqual({
		...initialState,
		netid,
		password,
		isLoggedIn: true
	});
});

it('should handle LOGOUT action', () => {
	const action = {
		type: auth.LOGOUT,
		netid: '',
		password: '',
		isLoggedIn: false
	};

	currentState.netid = netid;
	currentState.password = password;
	currentState.isLoggedIn = true;

	expect(loginReducer(currentState, action)).toEqual({
		...currentState,
		netid: '',
		password: '',
		isLoggedIn: false
	});
});

it('should handle LOGIN_HAS_FAILED action', () => {
	const action = {
		type: auth.LOGIN_HAS_FAILED,
		hasFailed: true
	};

	expect(loginReducer(currentState, action)).toEqual({
		...currentState,
		hasFailed: true
	});
});

it('should handle LOGGING_IN action', () => {
	const action = {
		type: auth.LOGGING_IN,
		loggingIn: true
	};

	expect(loginReducer(currentState, action)).toEqual({
		...currentState,
		loggingIn: true
	});
});

it('should handle LOGIN_IS_GUEST action', () => {
	const action = {
		type: auth.LOGIN_IS_GUEST,
		loginIsGuestAccount: true
	};

	expect(loginReducer(currentState, action)).toEqual({
		...currentState,
		loginIsGuestAccount: true
	});
});