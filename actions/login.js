/**
 * Copyright 2017 Andrew Thyng
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import {credentials} from '../utils/storage';
import {user} from '../actions/registrar';

export const LOGIN_HAS_FAILED = 'LOGIN_HAS_FAILED';
function loginHasFailed(bool) {
	return {
		type: LOGIN_HAS_FAILED,
		hasFailed: bool
	};
}

export const LOGIN_IS_GUEST = 'LOGIN_IS_GUEST';
export function loginIsGuestAccount(bool) {
	return {
		type: LOGIN_IS_GUEST,
		isGuestAccount: bool
	};
}

export const LOGIN = 'LOGIN';
function netidLogin(netid, password) {
	return {
		type: LOGIN,
		netid: netid,
		password: password
	};
}

export const LOGOUT = 'LOGOUT';
export function netidLogout() {
	return {
		type: LOGOUT
	};
}
export const LOGGING_IN = 'LOGGING_IN';
function loggingIn(bool) {
	return {
		type: LOGGING_IN,
		loggingIn: bool,
	}
}

export const IS_LOGGED_IN = 'IS_LOGGED_IN';
function isLoggedIn(bool) {
	return {
		type: IS_LOGGED_IN,
		isLoggedIn: bool
	}
}

export function auth(netid, password) {
	return (dispatch) => {
		dispatch(loggingIn(true));

		if (netid.length <= 0) {
			dispatch(loggingIn(false));
			return;
		}
		const baseUrl = 'https://staging.tracs.txstate.edu/';

		fetch(`${baseUrl}portal/relogin?eid=${netid}&pw=${password}`, {
			method: "post"
		})
			.then((res) => {
				if (res.ok) {
					fetch(`${baseUrl}direct/session/current.json`, {
						method: 'get'
					}).then((res) => {
						res.text().then((text) => {
							let session = JSON.parse(text);
							if (session.userEid === netid) {
								console.log(session);
								credentials.store(netid, password).then(() => {
									dispatch(netidLogin(netid, password));
									dispatch(isLoggedIn(true));
									dispatch(loggingIn(false));
									dispatch(loginHasFailed(false));
								});
							} else {
								console.log("ELSE BLOCK");
								dispatch(netidLogout());
								dispatch(loginHasFailed(true));
							}
						});
					});
				} else {
					console.log("Login failed with response");
					dispatch(loginHasFailed(true));
				}
			});
	};
}