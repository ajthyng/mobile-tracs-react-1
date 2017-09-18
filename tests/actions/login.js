/**
 * Copyright 2017 Andrew Thyng
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
import * as LoginActions from '../../src/actions/login';

const netid = "fak103";
const password = "password123";

it('should create a login action', () => {
	const expectedAction = {
		type: LoginActions.LOGIN,
		netid,
		password
	};

	expect(LoginActions.netidLogin(netid, password)).toEqual(expectedAction);
});

it('should create a logout action', () => {
	const expectedAction = {
		type: LoginActions.LOGOUT
	};

	expect(LoginActions.netidLogout()).toEqual(expectedAction);
});

it('should mark guest account', () => {
	const isGuestAccount = true;
	const expectedAction = {
		type: LoginActions.LOGIN_IS_GUEST,
		isGuestAccount
	};

	expect(LoginActions.loginIsGuestAccount(isGuestAccount)).toEqual(expectedAction);
});

it('should mark login as failed', () => {
	const hasFailed = true;
	const expectedAction = {
		type: LoginActions.LOGIN_HAS_FAILED,
		hasFailed
	};

	expect(LoginActions.loginHasFailed(hasFailed)).toEqual(expectedAction);
});

it('should mark user as logged in', () => {
	const isLoggedIn = true;
	const expectedAction = {
		type: LoginActions.IS_LOGGED_IN,
		isLoggedIn
	};

	expect(LoginActions.isLoggedIn(isLoggedIn)).toEqual(expectedAction);
});
